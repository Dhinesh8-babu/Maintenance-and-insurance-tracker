import React from 'react';
import { Vehicle, SortKey, SortDirection } from '../types';
import VehicleItem from './VehicleItem';
import { CarIcon, ArrowUpIcon, ArrowDownIcon } from './icons';

interface VehicleListProps {
    vehicles: Vehicle[];
    onEdit: (vehicle: Vehicle) => void;
    onDelete: (id: string) => void;
    onViewNotes: (vehicle: Vehicle) => void;
    insuranceReminderDays: number;
    maintenanceReminderDays: number;
    sortKey: SortKey | null;
    sortDirection: SortDirection;
    onSort: (key: SortKey) => void;
}

const VehicleList: React.FC<VehicleListProps> = ({ vehicles, onEdit, onDelete, onViewNotes, insuranceReminderDays, maintenanceReminderDays, sortKey, sortDirection, onSort }) => {
    
    const renderSortIcon = (key: SortKey) => {
        if (sortKey !== key) {
            return <ArrowUpIcon className="w-4 h-4 text-slate-400 opacity-40 group-hover:opacity-100" />;
        }
        return sortDirection === 'asc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />;
    };
    
    if (vehicles.length === 0) {
        return (
            <div className="text-center py-20 px-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
                <CarIcon className="mx-auto h-16 w-16 text-slate-400" />
                <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">No vehicles found</h3>
                <p className="mt-2 text-base text-slate-500 dark:text-slate-400">Try changing the filter or add a new vehicle.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Vehicle</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell">VIN</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">Status</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer group" onClick={() => onSort('insurance_renewal_date')}>
                                <div className="flex items-center space-x-1">
                                    <span>Insurance</span>
                                    {renderSortIcon('insurance_renewal_date')}
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer group" onClick={() => onSort('next_maintenance_date')}>
                                <div className="flex items-center space-x-1">
                                    <span>Maintenance</span>
                                    {renderSortIcon('next_maintenance_date')}
                                </div>
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                        {vehicles.map(vehicle => (
                            <VehicleItem
                                key={vehicle.id}
                                vehicle={vehicle}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onViewNotes={onViewNotes}
                                insuranceReminderDays={insuranceReminderDays}
                                maintenanceReminderDays={maintenanceReminderDays}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VehicleList;