
import { useState, useEffect } from 'react';

// Interface for staff members data
interface SiteStaffMember {
  id: string;
  name: string;
  email: string;
  userType: string;
  employDate: string;
  status: string;
  phone_number: string;
  ic_number: string;
  siteLocation: string;
}

// Hook to fetch and manage site staff data
export const useSiteStaffData = (user: any, organizationInfo: any) => {
  const [staffList, setStaffList] = useState<SiteStaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locationOptions, setLocationOptions] = useState<string[]>([]);
  const [statusOptions, setStatusOptions] = useState<string[]>(['Active', 'On Leave', 'Inactive']);

  useEffect(() => {
    const fetchSiteStaffData = async () => {
      if (!user || !organizationInfo.organization_id) {
        setIsLoading(false);
        return;
      }

      try {
        // In a real app, fetch data from API or Supabase
        // For now, use mock data
        const mockData = [
          {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            userType: 'site_staff',
            employDate: '2023-03-15',
            status: 'Active',
            phone_number: '+60123456789',
            ic_number: '901234-56-7890',
            siteLocation: 'Kuala Lumpur Center'
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            userType: 'site_manager',
            employDate: '2023-05-20',
            status: 'Active',
            phone_number: '+60123456788',
            ic_number: '911234-56-7890',
            siteLocation: 'Shah Alam Hub'
          },
          {
            id: '3',
            name: 'Ahmad Abdullah',
            email: 'ahmad@example.com',
            userType: 'site_technician',
            employDate: '2022-11-10',
            status: 'On Leave',
            phone_number: '+60123456787',
            ic_number: '921234-56-7890',
            siteLocation: 'Petaling Jaya Office'
          },
          {
            id: '4',
            name: 'Sarah Lee',
            email: 'sarah@example.com',
            userType: 'site_staff',
            employDate: '2023-01-05',
            status: 'Inactive',
            phone_number: '+60123456786',
            ic_number: '931234-56-7890',
            siteLocation: 'Kuala Lumpur Center'
          }
        ];

        setStaffList(mockData);
        
        // Extract all unique locations
        const uniqueLocations = [...new Set(mockData.map(staff => staff.siteLocation))];
        setLocationOptions(uniqueLocations);
        
        // Extract all unique status values
        const uniqueStatuses = [...new Set(mockData.map(staff => staff.status))];
        setStatusOptions(uniqueStatuses);
      } catch (error) {
        console.error('Error fetching site staff data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSiteStaffData();
  }, [user, organizationInfo.organization_id]);

  const addStaffMember = (newStaff: SiteStaffMember) => {
    setStaffList(prevList => [...prevList, newStaff]);
    
    // If this staff has a new location, add it to the options
    if (newStaff.siteLocation && !locationOptions.includes(newStaff.siteLocation)) {
      setLocationOptions(prev => [...prev, newStaff.siteLocation]);
    }
  };

  const updateStaffMember = (updatedStaff: SiteStaffMember) => {
    setStaffList(prevList => 
      prevList.map(staff => 
        staff.id === updatedStaff.id ? updatedStaff : staff
      )
    );
    
    // If this staff has a new location, add it to the options
    if (updatedStaff.siteLocation && !locationOptions.includes(updatedStaff.siteLocation)) {
      setLocationOptions(prev => [...prev, updatedStaff.siteLocation]);
    }
  };

  const removeStaffMember = (staffId: string) => {
    setStaffList(prevList => prevList.filter(staff => staff.id !== staffId));
  };

  return {
    staffList,
    isLoading,
    locationOptions,
    statusOptions,
    addStaffMember,
    updateStaffMember,
    removeStaffMember
  };
};
