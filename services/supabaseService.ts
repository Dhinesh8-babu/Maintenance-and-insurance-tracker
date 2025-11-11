import { createClient } from '@supabase/supabase-js';
import { Vehicle } from '../types';

// IMPORTANT: These are your Supabase credentials.
// For production applications, it's recommended to use environment variables.
const supabaseUrl = 'https://zwukpsabeeskniakuiya.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3dWtwc2FiZWVza25pYWt1aXlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3Nzg5NzcsImV4cCI6MjA3ODM1NDk3N30.BizoJIhZdlEzhgeML7B-xqjZHD2-3Dx4wrDZm84g9LA';


const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getVehicles = async (): Promise<Vehicle[]> => {
    const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching vehicles:', error);
        throw error;
    }
    return data || [];
};

export const addVehicle = async (vehicle: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
        .from('vehicles')
        .insert([vehicle])
        .select();

    if (error) {
        console.error('Error adding vehicle:', error);
        throw error;
    }
    return data;
};

export const updateVehicle = async (id: string, updates: Partial<Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>>) => {
    const updatesWithTimestamp = {
        ...updates,
        updated_at: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
        .from('vehicles')
        .update(updatesWithTimestamp)
        .eq('id', id)
        .select();

    if (error) {
        console.error('Error updating vehicle:', error);
        throw error;
    }
    return data;
};

export const deleteVehicle = async (id: string) => {
    const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting vehicle:', error);
    }
};

export const batchAddVehicles = async (vehicles: Omit<Vehicle, 'id'| 'created_at' | 'updated_at'>[]) => {
    const { data, error } = await supabase
        .from('vehicles')
        .insert(vehicles)
        .select();
    
    if (error) {
        console.error('Error batch adding vehicles:', error);
        throw error;
    }
    return data;
};