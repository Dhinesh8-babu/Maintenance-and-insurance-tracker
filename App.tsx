import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Vehicle, VehicleFilter, ExportCriteria, SortKey, SortDirection } from './types';
import { getVehicles, addVehicle, updateVehicle, deleteVehicle, batchAddVehicles } from './services/supabaseService';
import { summarizeNotes } from './services/geminiService';
import { isWithinDays, isDatePast, isToday } from './utils/dateUtils';
import { exportToExcel } from './utils/excelUtils';
import * as xlsx from 'xlsx';

import Header from './components/Header';
import FilterControls from './components/FilterControls';
import VehicleList from './components/VehicleList';
import VehicleFormModal from './components/VehicleFormModal';
import NotesModal from './components/NotesModal';
import Spinner from './components/Spinner';
import SettingsModal from './components/SettingsModal';
import ExportModal from './components/ExportModal';
import { CheckCircleIcon, XCircleIcon } from './components/icons';

const DEFAULT_INSURANCE_DAYS = 30;
const DEFAULT_MAINTENANCE_DAYS = 14;

const App: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<VehicleFilter>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortKey, setSortKey] = useState<SortKey | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const [insuranceReminderDays, setInsuranceReminderDays] = useState(DEFAULT_INSURANCE_DAYS);
    const [maintenanceReminderDays, setMaintenanceReminderDays] = useState(DEFAULT_MAINTENANCE_DAYS);

    useEffect(() => {
        const savedInsuranceDays = localStorage.getItem('insuranceReminderDays');
        const savedMaintenanceDays = localStorage.getItem('maintenanceReminderDays');
        if (savedInsuranceDays) setInsuranceReminderDays(parseInt(savedInsuranceDays, 10));
        if (savedMaintenanceDays) setMaintenanceReminderDays(parseInt(savedMaintenanceDays, 10));
    }, []);

    const fetchVehicles = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getVehicles();
            setVehicles(data || []);
        } catch (err) {
            setError('Failed to fetch vehicles. Please ensure your Supabase credentials are correct and the table schema is updated.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVehicles();
    }, [fetchVehicles]);
    
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleAddVehicle = () => {
        setSelectedVehicle(null);
        setIsFormModalOpen(true);
    };

    const handleEditVehicle = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        setIsFormModalOpen(true);
    };

    const handleViewNotes = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        setIsNotesModalOpen(true);
    };

    const handleDeleteVehicle = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            try {
                await deleteVehicle(id);
                setNotification({ message: 'Vehicle deleted successfully!', type: 'success' });
                fetchVehicles();
            } catch (err) {
                setNotification({ message: 'Failed to delete vehicle.', type: 'error' });
                console.error(err);
            }
        }
    };

    const handleFormSubmit = async (vehicleData: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>) => {
        try {
            if (selectedVehicle) {
                await updateVehicle(selectedVehicle.id, vehicleData);
                setNotification({ message: 'Vehicle updated successfully!', type: 'success' });
            } else {
                await addVehicle(vehicleData);
                setNotification({ message: 'Vehicle added successfully!', type: 'success' });
            }
            fetchVehicles();
            setIsFormModalOpen(false);
            setSelectedVehicle(null);
        } catch (err) {
            setNotification({ message: 'Failed to save vehicle.', type: 'error' });
            console.error(err);
        }
    };
    
    const handleFileUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = xlsx.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = xlsx.utils.sheet_to_json(worksheet, { cellDates: true }) as any[];

                const newVehicles: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>[] = json.map(row => {
                    const normalizedRow: {[key: string]: any} = {};
                    for (const key in row) {
                        normalizedRow[key.trim().toLowerCase().replace(/\s+/g, '_')] = row[key];
                    }

                    const toYYYYMMDD = (date: Date | string | null | undefined): string => {
                        if (date instanceof Date && !isNaN(date.getTime())) {
                            const userTimezoneOffset = date.getTimezoneOffset() * 60000;
                            return new Date(date.getTime() - userTimezoneOffset).toISOString().split('T')[0];
                        }
                        if (typeof date === 'string') {
                            const parsedDate = new Date(date);
                             if (!isNaN(parsedDate.getTime())) {
                                const userTimezoneOffset = parsedDate.getTimezoneOffset() * 60000;
                                return new Date(parsedDate.getTime() - userTimezoneOffset).toISOString().split('T')[0];
                             }
                        }
                        return '';
                    };
                    
                    const sixMonthsFromNow = new Date();
                    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

                    return {
                        make: normalizedRow['make'] || '',
                        model: normalizedRow['model'] || '',
                        year: parseInt(normalizedRow['year'], 10) || new Date().getFullYear(),
                        license_plate: String(normalizedRow['plate_number'] || normalizedRow['license_plate'] || ''),
                        vin: String(normalizedRow['vin'] || ''),
                        color: String(normalizedRow['color'] || ''),
                        insurance_company: String(normalizedRow['insurance_company'] || ''),
                        insurance_renewal_date: toYYYYMMDD(normalizedRow['insurance_expiry'] || normalizedRow['insurance_expir'] || normalizedRow['insurance_renewal_date']),
                        next_maintenance_date: toYYYYMMDD(normalizedRow['next_maintenance_date'] || sixMonthsFromNow),
                        renter_status: String(normalizedRow['renter_status'] || 'Inactive'),
                        renter_name: String(normalizedRow['renter_name'] || ''),
                        notes: String(normalizedRow['notes'] || ''),
                    };
                }).filter(v => {
                    const isActive = v.renter_status.toLowerCase() === 'active';
                    const hasRequiredFields = v.make && v.model && v.year && v.license_plate && v.vin && v.insurance_renewal_date;
                    return isActive && hasRequiredFields;
                });


                if (newVehicles.length > 0) {
                    await batchAddVehicles(newVehicles);
                    setNotification({ message: `${newVehicles.length} vehicles imported successfully!`, type: 'success' });
                    fetchVehicles();
                } else {
                    setNotification({ message: 'No valid "Active" vehicles found in the file. Check column names, data, and renter status.', type: 'error' });
                }
            } catch (err) {
                 setNotification({ message: 'Error processing Excel file. Please check format.', type: 'error' });
                 console.error(err);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleSaveSettings = (settings: { insurance: number; maintenance: number }) => {
        setInsuranceReminderDays(settings.insurance);
        setMaintenanceReminderDays(settings.maintenance);
        localStorage.setItem('insuranceReminderDays', settings.insurance.toString());
        localStorage.setItem('maintenanceReminderDays', settings.maintenance.toString());
        setIsSettingsModalOpen(false);
        setNotification({ message: 'Reminder settings saved!', type: 'success' });
    };

    const handleExportData = (criteria: ExportCriteria) => {
        let dataToExport: Vehicle[] = [];
        const { startDate, endDate, includeInsurance, includeMaintenance, includeAll } = criteria;

        if (includeAll) {
            dataToExport = vehicles;
        } else {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const uniqueVehicles = new Map<string, Vehicle>();

            vehicles.forEach(v => {
                if (includeInsurance) {
                    const insuranceDate = new Date(v.insurance_renewal_date);
                    if (insuranceDate >= start && insuranceDate <= end) {
                        uniqueVehicles.set(v.id, v);
                    }
                }
                if (includeMaintenance) {
                    const maintenanceDate = new Date(v.next_maintenance_date);
                    if (maintenanceDate >= start && maintenanceDate <= end) {
                        uniqueVehicles.set(v.id, v);
                    }
                }
            });
            dataToExport = Array.from(uniqueVehicles.values());
        }

        if (dataToExport.length > 0) {
            const formattedDate = new Date().toISOString().split('T')[0];
            exportToExcel(dataToExport, `Fairental-Report_${formattedDate}.xlsx`);
            setNotification({ message: `Successfully exported ${dataToExport.length} vehicles.`, type: 'success' });
        } else {
            setNotification({ message: 'No vehicles found matching the selected criteria.', type: 'error' });
        }
        
        setIsExportModalOpen(false);
    };

    const handleExportTodaysUpdates = () => {
        const todayVehicles = vehicles.filter(v => isToday(v.updated_at) || isToday(v.created_at));
        if (todayVehicles.length > 0) {
            const formattedDate = new Date().toISOString().split('T')[0];
            exportToExcel(todayVehicles, `Fairental_Todays-Updates_${formattedDate}.xlsx`);
            setNotification({ message: `Successfully exported ${todayVehicles.length} vehicles updated today.`, type: 'success' });
        } else {
            setNotification({ message: 'No vehicles were added or updated today.', type: 'error' });
        }
    };
    
    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const processedVehicles = useMemo(() => {
        let filtered = vehicles;

        switch (filter) {
            case 'insurance':
                filtered = vehicles.filter(v => isWithinDays(v.insurance_renewal_date, insuranceReminderDays));
                break;
            case 'maintenance':
                filtered = vehicles.filter(v => isWithinDays(v.next_maintenance_date, maintenanceReminderDays));
                break;
            case 'insurance_expired':
                filtered = vehicles.filter(v => isDatePast(v.insurance_renewal_date));
                break;
            case 'maintenance_overdue':
                filtered = vehicles.filter(v => isDatePast(v.next_maintenance_date));
                break;
            case 'all':
            default:
                filtered = vehicles;
                break;
        }

        if (searchQuery) {
            const lowercasedQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(v => 
                v.make?.toLowerCase().includes(lowercasedQuery) ||
                v.model?.toLowerCase().includes(lowercasedQuery) ||
                v.year?.toString().includes(lowercasedQuery) ||
                v.license_plate?.toLowerCase().includes(lowercasedQuery) ||
                v.vin?.toLowerCase().includes(lowercasedQuery) ||
                v.renter_name?.toLowerCase().includes(lowercasedQuery) ||
                v.insurance_company?.toLowerCase().includes(lowercasedQuery)
            );
        }
        
        if (sortKey) {
            filtered = [...filtered].sort((a, b) => {
                const valA = a[sortKey];
                const valB = b[sortKey];
                
                if (!valA) return 1;
                if (!valB) return -1;

                const dateA = new Date(valA).getTime();
                const dateB = new Date(valB).getTime();
                
                if (isNaN(dateA)) return 1;
                if (isNaN(dateB)) return -1;

                if (sortDirection === 'asc') {
                    return dateA - dateB;
                } else {
                    return dateB - dateA;
                }
            });
        }

        return filtered;
        
    }, [vehicles, filter, insuranceReminderDays, maintenanceReminderDays, searchQuery, sortKey, sortDirection]);

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
            <Header
                onAddVehicle={handleAddVehicle}
                onFileUpload={handleFileUpload}
                onOpenSettings={() => setIsSettingsModalOpen(true)}
                onOpenExport={() => setIsExportModalOpen(true)}
                onExportTodaysUpdates={handleExportTodaysUpdates}
            />
            
            <main className="container mx-auto p-4 md:p-8">
                <FilterControls 
                    activeFilter={filter} 
                    onFilterChange={setFilter}
                    insuranceDays={insuranceReminderDays}
                    maintenanceDays={maintenanceReminderDays}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/20 p-6 rounded-xl">
                        <p className="font-semibold text-lg">An Error Occurred</p>
                        <p className="mt-1">{error}</p>
                    </div>
                ) : (
                    <VehicleList
                        vehicles={processedVehicles}
                        onEdit={handleEditVehicle}
                        onDelete={handleDeleteVehicle}
                        onViewNotes={handleViewNotes}
                        insuranceReminderDays={insuranceReminderDays}
                        maintenanceReminderDays={maintenanceReminderDays}
                        sortKey={sortKey}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                    />
                )}
            </main>

            {isFormModalOpen && (
                <VehicleFormModal
                    isOpen={isFormModalOpen}
                    onClose={() => setIsFormModalOpen(false)}
                    onSubmit={handleFormSubmit}
                    vehicle={selectedVehicle}
                />
            )}
            
            {isNotesModalOpen && selectedVehicle && (
                 <NotesModal
                    isOpen={isNotesModalOpen}
                    onClose={() => setIsNotesModalOpen(false)}
                    vehicle={selectedVehicle}
                    onSave={async (updatedVehicle) => {
                        await handleFormSubmit(updatedVehicle);
                    }}
                    summarizeNotes={summarizeNotes}
                />
            )}

            {isSettingsModalOpen && (
                <SettingsModal
                    isOpen={isSettingsModalOpen}
                    onClose={() => setIsSettingsModalOpen(false)}
                    onSave={handleSaveSettings}
                    currentSettings={{
                        insurance: insuranceReminderDays,
                        maintenance: maintenanceReminderDays,
                    }}
                />
            )}

            {isExportModalOpen && (
                <ExportModal
                    isOpen={isExportModalOpen}
                    onClose={() => setIsExportModalOpen(false)}
                    onExport={handleExportData}
                />
            )}
            
             {notification && (
                <div className={`fixed top-5 right-5 flex items-center p-4 rounded-xl shadow-2xl text-white ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {notification.type === 'success' ? <CheckCircleIcon className="h-6 w-6 mr-3" /> : <XCircleIcon className="h-6 w-6 mr-3" />}
                    <span className="text-sm font-semibold">{notification.message}</span>
                </div>
            )}
        </div>
    );
};

export default App;