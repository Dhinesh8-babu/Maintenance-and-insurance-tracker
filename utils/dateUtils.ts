export const isWithinDays = (dateString: string, days: number): boolean => {
    if (!dateString) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parts = dateString.split('-').map(part => parseInt(part, 10));
    if (parts.length !== 3 || parts.some(isNaN)) {
        return false;
    }
    
    const targetDate = new Date(parts[0], parts[1] - 1, parts[2]);
    if (isNaN(targetDate.getTime())) {
        return false;
    }

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= days;
};

export const isDatePast = (dateString: string): boolean => {
    if (!dateString) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parts = dateString.split('-').map(part => parseInt(part, 10));
    if (parts.length !== 3 || parts.some(isNaN)) {
        return false;
    }
    
    const targetDate = new Date(parts[0], parts[1] - 1, parts[2]);
    if (isNaN(targetDate.getTime())) {
        return false;
    }

    return targetDate.getTime() < today.getTime();
}

export const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }

    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
};

export const formatDateDisplay = (dateString: string): string => {
    if (!dateString) return 'N/A';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parts = dateString.split('-').map(part => parseInt(part, 10));
    if (parts.length !== 3 || parts.some(isNaN)) return 'Invalid Date';
    
    const targetDate = new Date(parts[0], parts[1] - 1, parts[2]);
    if (isNaN(targetDate.getTime())) return 'Invalid Date';

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) return `in ${diffDays}d`;
    if (diffDays === 0) return 'Today';
    
    return formatDate(dateString);
};

export const isToday = (dateString: string | undefined): boolean => {
    if (!dateString) return false;
    
    const today = new Date();
    const targetDate = new Date(dateString);

    if (isNaN(targetDate.getTime())) return false;

    return targetDate.getUTCFullYear() === today.getUTCFullYear() &&
           targetDate.getUTCMonth() === today.getUTCMonth() &&
           targetDate.getUTCDate() === today.getUTCDate();
};