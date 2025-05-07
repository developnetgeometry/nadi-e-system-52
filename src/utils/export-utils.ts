
import { saveAs } from 'file-saver';

// Function to export data to CSV
export const exportToCSV = (data: any[], filename: string) => {
  if (!data || !data.length) {
    console.error("No data to export");
    return;
  }

  // Get headers from the first object's keys
  const headers = Object.keys(data[0]);
  
  // Create CSV rows
  const rows = data.map(item => 
    headers.map(header => {
      // Handle case where the value might contain commas or quotes
      let value = item[header] === null || item[header] === undefined ? '' : item[header];
      value = String(value).replace(/"/g, '""'); // Escape double quotes
      
      // If value contains commas, newlines, or double quotes, enclose in double quotes
      if (value.includes(',') || value.includes('\n') || value.includes('"')) {
        value = `"${value}"`;
      }
      return value;
    }).join(',')
  );
  
  // Add headers as first row
  const csvContent = [
    headers.join(','),
    ...rows
  ].join('\n');
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `${filename}.csv`);
};

// Prepare staff data for export by flattening and formatting
export const prepareStaffDataForExport = (staffList: any[]) => {
  return staffList.map(staff => ({
    Name: staff.name || '',
    Email: staff.email || '',
    'Phone Number': staff.phone_number || '',
    'User Type': staff.userType?.replace(/_/g, " ") || '',
    Status: staff.status || '',
    Role: staff.role || '',
    'Employment Date': staff.employDate || '',
    'IC Number': staff.ic_number || '',
    Location: staff.siteLocation || ''
  }));
};

// Function to export staff data to CSV
export const exportStaffToCSV = (staffList: any[], filename = 'staff-data') => {
  const formattedData = prepareStaffDataForExport(staffList);
  exportToCSV(formattedData, filename);
};
