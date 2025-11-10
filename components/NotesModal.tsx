import React, { useState } from 'react';
import { Vehicle } from '../types';
import { SparklesIcon } from './icons';
import Spinner from './Spinner';

interface NotesModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehicle: Vehicle;
    onSave: (vehicle: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
    summarizeNotes: (notes: string) => Promise<string>;
}

const NotesModal: React.FC<NotesModalProps> = ({ isOpen, onClose, vehicle, onSave, summarizeNotes }) => {
    const [newNote, setNewNote] = useState('');
    const [summary, setSummary] = useState<string | null>(null);
    const [isSummarizing, setIsSummarizing] = useState(false);
    
    const handleAddNote = async () => {
        if (!newNote.trim()) return;

        const timestamp = new Date().toLocaleString();
        const updatedNotes = vehicle.notes 
            ? `${vehicle.notes}\n\n---\n[${timestamp}]\n${newNote}`
            : `[${timestamp}]\n${newNote}`;
        
        const { id, created_at, updated_at, ...vehicleData } = vehicle;
        const updatedVehicleData = { ...vehicleData, notes: updatedNotes };
        
        await onSave(updatedVehicleData);
        setNewNote('');
        setSummary(null); // Clear summary as notes have changed
    };
    
    const handleSummarize = async () => {
        setIsSummarizing(true);
        setSummary(null);
        const result = await summarizeNotes(vehicle.notes);
        setSummary(result);
        setIsSummarizing(false);
    };

    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-3xl mx-auto flex flex-col" style={{maxHeight: '90vh'}}>
                <div className="p-8 pb-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Notes for {`${vehicle.year} ${vehicle.make} ${vehicle.model}`}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{vehicle.license_plate}</p>
                </div>

                <div className="p-8 flex-grow overflow-y-auto">
                    {(summary || isSummarizing) && (
                        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-200 dark:border-slate-700">
                            <h3 className="font-semibold text-slate-800 dark:text-slate-300 mb-2 flex items-center">
                                <SparklesIcon className="h-5 w-5 mr-2 text-slate-500" /> AI Summary
                            </h3>
                            {isSummarizing ? (
                                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                                    <Spinner small /><span>Generating summary...</span>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{summary}</p>
                            )}
                        </div>
                    )}

                    <div className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg h-64 overflow-y-auto border border-slate-200 dark:border-slate-700">
                        {vehicle.notes || <span className="text-slate-400">No notes yet.</span>}
                    </div>
                    
                    <div className="mt-4">
                        <textarea
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Add a new note..."
                            rows={3}
                            className="w-full rounded-lg border-slate-300 dark:border-slate-600 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm bg-slate-100 dark:bg-slate-700 dark:text-white"
                        />
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-4 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 rounded-b-xl border-t border-slate-200 dark:border-slate-700">
                     <button
                        onClick={handleSummarize}
                        disabled={!vehicle.notes || isSummarizing}
                        className="w-full sm:w-auto flex justify-center items-center space-x-2 py-2 px-4 bg-slate-200 text-slate-700 border border-transparent rounded-lg text-sm font-medium hover:bg-slate-300 disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 dark:disabled:bg-slate-600 dark:disabled:text-slate-400"
                    >
                        <SparklesIcon className="h-5 w-5" />
                        <span>Summarize Notes</span>
                    </button>
                    <div className="flex w-full sm:w-auto space-x-3">
                         <button type="button" onClick={onClose} className="flex-1 sm:flex-none py-2 px-5 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-600">
                            Close
                        </button>
                        <button onClick={handleAddNote} className="flex-1 sm:flex-none py-2 px-5 bg-slate-700 text-white border border-transparent rounded-lg shadow-sm text-sm font-medium hover:bg-slate-800">
                            Add Note
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotesModal;