import React, { useState, useEffect } from 'react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (settings: { insurance: number; maintenance: number }) => void;
    currentSettings: {
        insurance: number;
        maintenance: number;
    };
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, currentSettings }) => {
    const [insurance, setInsurance] = useState(currentSettings.insurance);
    const [maintenance, setMaintenance] = useState(currentSettings.maintenance);

    useEffect(() => {
        setInsurance(currentSettings.insurance);
        setMaintenance(currentSettings.maintenance);
    }, [currentSettings, isOpen]);

    const handleSave = () => {
        const insuranceDays = insurance > 0 ? insurance : 1;
        const maintenanceDays = maintenance > 0 ? maintenance : 1;
        onSave({ insurance: insuranceDays, maintenance: maintenanceDays });
    };

    if (!isOpen) return null;
    
    const inputClass = "block w-full rounded-lg border-slate-300 dark:border-slate-600 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm bg-slate-100 dark:bg-slate-700 dark:text-white";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md mx-auto">
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Reminder Settings</h2>
                    
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="insurance-days" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Insurance Renewal Reminder</label>
                            <div className="mt-1 flex items-center">
                                <input 
                                    type="number" 
                                    name="insurance-days" 
                                    id="insurance-days" 
                                    value={insurance} 
                                    onChange={(e) => setInsurance(parseInt(e.target.value, 10) || 0)} 
                                    min="1"
                                    className={inputClass} 
                                />
                                <span className="ml-3 text-sm text-slate-500 dark:text-slate-400">days before</span>
                            </div>
                        </div>
                        <div>
                             <label htmlFor="maintenance-days" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Maintenance Due Reminder</label>
                            <div className="mt-1 flex items-center">
                                <input 
                                    type="number" 
                                    name="maintenance-days" 
                                    id="maintenance-days" 
                                    value={maintenance} 
                                    onChange={(e) => setMaintenance(parseInt(e.target.value, 10) || 0)} 
                                    min="1"
                                    className={inputClass} 
                                />
                                <span className="ml-3 text-sm text-slate-500 dark:text-slate-400">days before</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex justify-end space-x-3 rounded-b-xl border-t border-slate-200 dark:border-slate-700">
                    <button type="button" onClick={onClose} className="py-2 px-5 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:focus:ring-offset-slate-800">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="py-2 px-5 bg-slate-700 text-white border border-transparent rounded-lg shadow-sm text-sm font-medium hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:focus:ring-offset-slate-800">
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;