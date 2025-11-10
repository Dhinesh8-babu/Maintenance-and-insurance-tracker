export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  vin: string;
  color: string;
  insurance_company: string;
  insurance_renewal_date: string; // YYYY-MM-DD
  next_maintenance_date: string; // YYYY-MM-DD
  renter_status: string;
  renter_name: string;
  notes: string;
  created_at?: string;
  updated_at?: string;
}

export type VehicleFilter = 'all' | 'insurance' | 'maintenance' | 'insurance_expired' | 'maintenance_overdue';

export interface ExportCriteria {
    startDate: string;
    endDate: string;
    includeInsurance: boolean;
    includeMaintenance: boolean;
    includeAll: boolean;
}

export type SortKey = 'insurance_renewal_date' | 'next_maintenance_date';
export type SortDirection = 'asc' | 'desc';
