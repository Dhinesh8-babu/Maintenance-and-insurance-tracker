import React from 'react';
import { Vehicle } from '../types';
import { isWithinDays, formatDateDisplay } from '../utils/dateUtils';
import { EditIcon, TrashIcon, NotesIcon } from './icons';

interface VehicleItemProps {
    vehicle: Vehicle;
    onEdit: (vehicle: Vehicle) => void;
    onDelete: (id: string) => void;
    onViewNotes: (vehicle: Vehicle) => void;
    insuranceReminderDays: number;
    maintenanceReminderDays: number;
}

const VehicleItem: React.FC<VehicleItemProps> = ({ vehicle, onEdit, onDelete, onViewNotes, insuranceReminderDays, maintenanceReminderDays }) => {
    const insuranceExpiring = isWithinDays(vehicle.insurance_renewal_date, insuranceReminderDays);
    const maintenanceDue = isWithinDays(vehicle.next_maintenance_date, maintenanceReminderDays);

    const getHighlightClass = (isUrgent: boolean) => 
        isUrgent ? 'text-rose-600 dark:text-rose-400 font-semibold' : '';

    return (
        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150">
            <td className="px-6 py-5 whitespace-nowrap">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">{`${vehicle.year} ${vehicle.make} ${vehicle.model}`}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{vehicle.license_plate}</div>
                {vehicle.renter_name && <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{vehicle.renter_name}</div>}
                 <div className="text-sm text-slate-500 dark:text-slate-400 lg:hidden mt-1">{vehicle.vin}</div>
            </td>
            <td className="px-6 py-5 whitespace-nowrap hidden lg:table-cell text-sm text-slate-500 dark:text-slate-400">
                {vehicle.vin}
            </td>
            <td className="px-6 py-5 whitespace-nowrap hidden sm:table-cell">
                <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    vehicle.renter_status && vehicle.renter_status.toLowerCase() === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' 
                    : 'bg-slate-100 text-slate-800 dark:bg-slate-700/60 dark:text-slate-300'
                }`}>
                    {vehicle.renter_status}
                </span>
            </td>
            <td className={`px-6 py-5 whitespace-nowrap text-sm ${getHighlightClass(insuranceExpiring)}`}>
                <div>{formatDateDisplay(vehicle.insurance_renewal_date)}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{vehicle.insurance_company}</div>
            </td>
            <td className={`px-6 py-5 whitespace-nowrap text-sm ${getHighlightClass(maintenanceDue)}`}>
                {formatDateDisplay(vehicle.next_maintenance_date)}
            </td>
            <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end items-center space-x-4">
                    <button onClick={() => onViewNotes(vehicle)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors" title="View Notes">
                        <NotesIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => onEdit(vehicle)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors" title="Edit Vehicle">
                        <EditIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => onDelete(vehicle.id)} className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 transition-colors" title="Delete Vehicle">
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default VehicleItem;