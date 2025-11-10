import * as xlsx from 'xlsx';
import { Vehicle } from '../types';
import { formatDate } from './dateUtils';

// A helper to format the vehicle data for a cleaner export
const formatVehiclesForExport = (vehicles: Vehicle[]) => {
    return vehicles.map(v => ({
        'Make': v.make,
        'Model': v.model,
        'Year': v.year,
        'License Plate': v.license_plate,
        'VIN': v.vin,
        'Color': v.color,
        'Renter Status': v.renter_status,
        'Renter Name': v.renter_name,
        'Insurance Company': v.insurance_company,
        'Insurance Renewal Date': formatDate(v.insurance_renewal_date),
        'Next Maintenance Date': formatDate(v.next_maintenance_date),
        'Notes': v.notes || '',
        'Created At': v.created_at ? formatDate(new Date(v.created_at).toISOString().split('T')[0]) : 'N/A',
        'Updated At': v.updated_at ? formatDate(new Date(v.updated_at).toISOString().split('T')[0]) : 'N/A',
    }));
};


export const exportToExcel = (vehicles: Vehicle[], fileName: string): void => {
    if (vehicles.length === 0) {
        console.warn("No data to export.");
        return;
    }
    
    const formattedData = formatVehiclesForExport(vehicles);

    const worksheet = xlsx.utils.json_to_sheet(formattedData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Vehicles');

    // Adjust column widths for better readability
    const columnWidths = [
        { wch: 15 }, // Make
        { wch: 20 }, // Model
        { wch: 8 },  // Year
        { wch: 15 }, // License Plate
        { wch: 20 }, // VIN
        { wch: 12 }, // Color
        { wch: 12 }, // Renter Status
        { wch: 20 }, // Renter Name
        { wch: 20 }, // Insurance Company
        { wch: 20 }, // Insurance Renewal Date
        { wch: 20 }, // Next Maintenance Date
        { wch: 50 }, // Notes
        { wch: 15 }, // Created At
        { wch: 15 }, // Updated At
    ];
    worksheet['!cols'] = columnWidths;

    xlsx.writeFile(workbook, fileName);
};