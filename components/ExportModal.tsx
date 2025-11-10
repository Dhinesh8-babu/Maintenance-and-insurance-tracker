import React, { useState } from 'react';
import { ExportCriteria } from '../types';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (criteria: ExportCriteria) => void;
}

// Helper to get today's date in YYYY-MM-DD format
const getTodayString = () => new Date().toISOString().split('T')[0];

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onExport }) => {
    const [startDate, setStartDate] = useState(getTodayString());
    const [endDate, setEndDate] = useState(getTodayString());
    const [includeInsurance, setIncludeInsurance] = useState(true);
    const [includeMaintenance, setIncludeMaintenance] = useState(true);
    const [includeAll, setIncludeAll] = useState(false);

    const handleExport = () => {
        if (!includeAll && (!startDate || !endDate)) {
            alert('Please select a valid date range.');
            return;
        }
        if (!includeAll && !includeInsurance && !includeMaintenance) {
            alert('Please select at least one data type to include in the report.');
            return;
        }
        onExport({ startDate, endDate, includeInsurance, includeMaintenance, includeAll });
    };
    
    const handleIncludeAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setIncludeAll(isChecked);
        if (isChecked) {
            setIncludeInsurance(false);
            setIncludeMaintenance(false);
        } else {
            setIncludeInsurance(true);
            setIncludeMaintenance(true);
        }
    };

    if (!isOpen) return null;

    const inputClass = "mt-1 block w-full rounded-lg border-slate-300 dark:border-slate-600 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm bg-slate-100 dark:bg-slate-700 dark:text-white disabled:bg-slate-200 dark:disabled:bg-slate-700/50";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg mx-auto">
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Custom Filter & Export</h2>
                    
                    <div className="space-y-6">
                        <div className="relative flex items-start p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex h-6 items-center">
                                <input
                                    id="include-all"
                                    name="include-all"
                                    type="checkbox"
                                    checked={includeAll}
                                    onChange={handleIncludeAllChange}
                                    className="h-4 w-4 rounded border-gray-300 text-slate-600 focus:ring-slate-600 dark:bg-slate-700 dark:border-slate-600"
                                />
                            </div>
                            <div className="ml-3 text-sm leading-6">
                                <label htmlFor="include-all" className="font-medium text-slate-900 dark:text-slate-200">
                                    Export All Vehicles
                                </label>
                                <p className="text-slate-500 dark:text-slate-400">Select this to ignore date filters and export all records.</p>
                            </div>
                        </div>

                        <div className={`transition-opacity duration-300 ${includeAll ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                            <fieldset className="space-y-6">
                                <div>
                                    <legend className="text-base font-semibold leading-6 text-slate-900 dark:text-white">Filter by Date Range</legend>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Select a start and end date for the report.</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="start-date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Start Date</label>
                                            <input type="date" name="start-date" id="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className={inputClass} />
                                        </div>
                                        <div>
                                            <label htmlFor="end-date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">End Date</label>
                                            <input type="date" name="end-date" id="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required className={inputClass} />
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <legend className="text-base font-semibold leading-6 text-slate-900 dark:text-white">Data to Include</legend>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Choose which records to include based on the date range.</p>
                                    <div className="mt-4 space-y-4">
                                        <div className="relative flex items-start">
                                            <div className="flex h-6 items-center">
                                                <input id="include-insurance" name="include-insurance" type="checkbox" checked={includeInsurance} onChange={(e) => setIncludeInsurance(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-slate-600 focus:ring-slate-600 dark:bg-slate-700 dark:border-slate-600 disabled:opacity-50" />
                                            </div>
                                            <div className="ml-3 text-sm leading-6">
                                                <label htmlFor="include-insurance" className="font-medium text-slate-900 dark:text-slate-200">
                                                    Insurance Renewals in Range
                                                </label>
                                            </div>
                                        </div>
                                        <div className="relative flex items-start">
                                            <div className="flex h-6 items-center">
                                                <input id="include-maintenance" name="include-maintenance" type="checkbox" checked={includeMaintenance} onChange={(e) => setIncludeMaintenance(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-slate-600 focus:ring-slate-600 dark:bg-slate-700 dark:border-slate-600 disabled:opacity-50" />
                                            </div>
                                            <div className="ml-3 text-sm leading-6">
                                                <label htmlFor="include-maintenance" className="font-medium text-slate-900 dark:text-slate-200">
                                                    Maintenance Due in Range
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-4 flex justify-end space-x-3 rounded-b-xl border-t border-slate-200 dark:border-slate-700">
                    <button type="button" onClick={onClose} className="py-2 px-5 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:focus:ring-offset-slate-800">
                        Cancel
                    </button>
                    <button onClick={handleExport} className="py-2 px-5 bg-slate-700 text-white border border-transparent rounded-lg shadow-sm text-sm font-medium hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:focus:ring-offset-slate-800">
                        Export to Excel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportModal;