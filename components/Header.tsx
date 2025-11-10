import React, { useRef } from 'react';
import { CarIcon, UploadIcon, ExportIcon, SettingsIcon } from './icons';

interface HeaderProps {
    onAddVehicle: () => void;
    onFileUpload: (file: File) => void;
    onOpenSettings: () => void;
    onOpenExport: () => void;
    onExportTodaysUpdates: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddVehicle, onFileUpload, onOpenSettings, onOpenExport, onExportTodaysUpdates }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileUpload(file);
             // Reset file input to allow uploading the same file again
            if(fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700/50 sticky top-0 z-40">
            <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <CarIcon className="h-8 w-8 text-slate-600 dark:text-slate-400" />
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                        Fairental Tracker
                    </h1>
                </div>
                <div className="flex items-center space-x-1 md:space-x-2">
                     <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".xlsx, .xls"
                    />
                    <button
                        onClick={handleImportClick}
                        className="flex items-center space-x-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 font-semibold py-2 px-3 rounded-lg transition-colors duration-200 text-sm"
                    >
                        <UploadIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Import</span>
                    </button>
                     <button
                        onClick={onOpenExport}
                        className="flex items-center space-x-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 font-semibold py-2 px-3 rounded-lg transition-colors duration-200 text-sm"
                    >
                        <ExportIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Export</span>
                    </button>
                    <button
                        onClick={onExportTodaysUpdates}
                        className="flex items-center space-x-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 font-semibold py-2 px-3 rounded-lg transition-colors duration-200 text-sm"
                        title="Export vehicles created or updated today"
                    >
                        <ExportIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Today's Log</span>
                    </button>
                    <button
                        onClick={onAddVehicle}
                        className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                    >
                        + Add Vehicle
                    </button>
                    <button
                        onClick={onOpenSettings}
                        className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:focus:ring-offset-slate-800"
                        aria-label="Settings"
                    >
                        <SettingsIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;