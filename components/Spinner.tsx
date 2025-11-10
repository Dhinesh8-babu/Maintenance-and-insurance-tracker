import React from 'react';

interface SpinnerProps {
    small?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ small = false }) => {
    const sizeClass = small ? 'h-5 w-5' : 'h-8 w-8';
    const borderClass = small ? 'border-2' : 'border-4';

    return (
        <div 
            className={`${sizeClass} ${borderClass} border-slate-500 border-t-transparent rounded-full animate-spin`}
            role="status"
            aria-label="Loading..."
        >
        </div>
    );
};

export default Spinner;