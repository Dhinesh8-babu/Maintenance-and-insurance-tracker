import React, { useState, useEffect } from 'react';
import { Vehicle } from '../types';

interface VehicleFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (vehicle: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>) => void;
    vehicle: Vehicle | null;
}

const VehicleFormModal: React.FC<VehicleFormModalProps> = ({ isOpen, onClose, onSubmit, vehicle }) => {
    const [formData, setFormData] = useState({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        license_plate: '',
        vin: '',
        color: '',
        renter_name: '',
        insurance_company: '',
        insurance_renewal_date: '',
        next_maintenance_date: '',
        renter_status: 'Active',
        notes: '',
    });

    useEffect(() => {
        if (vehicle) {
            setFormData({
                make: vehicle.make || '',
                model: vehicle.model || '',
                year: vehicle.year || new Date().getFullYear(),
                license_plate: vehicle.license_plate || '',
                vin: vehicle.vin || '',
                color: vehicle.color || '',
                renter_name: vehicle.renter_name || '',
                insurance_company: vehicle.insurance_company || '',
                insurance_renewal_date: vehicle.insurance_renewal_date || '',
                next_maintenance_date: vehicle.next_maintenance_date || '',
                renter_status: vehicle.renter_status || 'Active',
                notes: vehicle.notes || '',
            });
        } else {
            setFormData({
                make: '',
                model: '',
                year: new Date().getFullYear(),
                license_plate: '',
                vin: '',
                color: '',
                renter_name: '',
                insurance_company: '',
                insurance_renewal_date: '',
                next_maintenance_date: '',
                renter_status: 'Active',
                notes: '',
            });
        }
    }, [vehicle, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'year' ? parseInt(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;
    
    const inputClass = "mt-1 block w-full rounded-lg border-slate-300 dark:border-slate-600 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm bg-slate-100 dark:bg-slate-700 dark:text-white";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-3xl mx-auto my-8">
                <form onSubmit={handleSubmit}>
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div>
                                <label htmlFor="make" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Make</label>
                                <input type="text" name="make" id="make" value={formData.make} onChange={handleChange} required className={inputClass} />
                            </div>
                            <div>
                                <label htmlFor="model" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Model</label>
                                <input type="text" name="model" id="model" value={formData.model} onChange={handleChange} required className={inputClass} />
                            </div>
                             <div>
                                <label htmlFor="year" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Year</label>
                                <input type="number" name="year" id="year" value={formData.year} onChange={handleChange} required className={inputClass} />
                            </div>
                            <div>
                                <label htmlFor="license_plate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">License Plate</label>
                                <input type="text" name="license_plate" id="license_plate" value={formData.license_plate} onChange={handleChange} required className={inputClass} />
                            </div>
                             <div className="md:col-span-2">
                                <label htmlFor="vin" className="block text-sm font-medium text-slate-700 dark:text-slate-300">VIN</label>
                                <input type="text" name="vin" id="vin" value={formData.vin} onChange={handleChange} required className={inputClass} />
                            </div>
                             <div>
                                <label htmlFor="color" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Color</label>
                                <input type="text" name="color" id="color" value={formData.color} onChange={handleChange} className={inputClass} />
                            </div>
                             <div>
                                <label htmlFor="renter_name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Renter Name</label>
                                <input type="text" name="renter_name" id="renter_name" value={formData.renter_name} onChange={handleChange} className={inputClass} />
                            </div>
                             <div className="md:col-span-2">
                                <label htmlFor="insurance_company" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Insurance Company</label>
                                <input type="text" name="insurance_company" id="insurance_company" value={formData.insurance_company} onChange={handleChange} className={inputClass} />
                            </div>
                             <div>
                                <label htmlFor="insurance_renewal_date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Insurance Renewal Date</label>
                                <input type="date" name="insurance_renewal_date" id="insurance_renewal_date" value={formData.insurance_renewal_date} onChange={handleChange} required className={inputClass} />
                            </div>
                             <div>
                                <label htmlFor="next_maintenance_date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Next Maintenance Date</label>
                                <input type="date" name="next_maintenance_date" id="next_maintenance_date" value={formData.next_maintenance_date} onChange={handleChange} required className={inputClass} />
                            </div>
                              <div className="md:col-span-2">
                                <label htmlFor="renter_status" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Renter Status</label>
                                <select id="renter_status" name="renter_status" value={formData.renter_status} onChange={handleChange} className={inputClass}>
                                    <option>Active</option>
                                    <option>Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-4 flex justify-end space-x-3 rounded-b-xl border-t border-slate-200 dark:border-slate-700">
                        <button type="button" onClick={onClose} className="py-2 px-5 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:focus:ring-offset-slate-800">
                            Cancel
                        </button>
                        <button type="submit" className="py-2 px-5 bg-slate-700 text-white border border-transparent rounded-lg shadow-sm text-sm font-medium hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:focus:ring-offset-slate-800">
                            Save Vehicle
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VehicleFormModal;