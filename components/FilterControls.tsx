import React from 'react';
import { VehicleFilter } from '../types';
import { SearchIcon } from './icons';

interface FilterControlsProps {
    activeFilter: VehicleFilter;
    onFilterChange: (filter: VehicleFilter) => void;
    insuranceDays: number;
    maintenanceDays: number;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ activeFilter, onFilterChange, insuranceDays, maintenanceDays, searchQuery, onSearchChange }) => {
    const filters: { id: VehicleFilter; label: string }[] = [
        { id: 'all', label: 'All Vehicles' },
        { id: 'insurance', label: `Insurance Due (${insuranceDays}d)` },
        { id: 'maintenance', label: `Maintenance Due (${maintenanceDays}d)` },
        { id: 'insurance_expired', label: 'Expired' },
        { id: 'maintenance_overdue', label: 'Overdue' },
    ];

    return (
        <div className="mb-6 bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm p-3 rounded-xl shadow-sm flex flex-col md:flex-row flex-wrap items-center gap-3">
            <div className="flex-grow w-full md:w-auto">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by make, model, VIN, renter..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm border-slate-300 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-slate-500 focus:border-slate-500"
                    />
                </div>
            </div>
             <div className="flex flex-col sm:flex-row flex-wrap items-center gap-2">
                {filters.map(filter => (
                    <button
                        key={filter.id}
                        onClick={() => onFilterChange(filter.id)}
                        className={`w-full sm:w-auto px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 text-center ${
                            activeFilter === filter.id
                                ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-md'
                                : 'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/50'
                        }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FilterControls;