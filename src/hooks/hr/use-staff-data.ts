
import { useState, useEffect } from 'react';

// Interface for staff members data
interface StaffMember {
  id: string;
  name: string;
  email: string;
  userType: string;
  employDate: string;
  status: string;
  phone_number: string;
  ic_number: string;
  role: string;
}

// Hook to fetch and manage staff data
export const useStaffData = (user: any, organizationInfo: any) => {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusOptions, setStatusOptions] = useState<string[]>(['Active', 'On Leave', 'Inactive']);

  useEffect(() => {
    const fetchStaffData = async () => {
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
            userType: 'staff_admin',
            employDate: '2023-03-15',
            status: 'Active',
            phone_number: '+60123456789',
            ic_number: '901234-56-7890',
            role: 'Site Manager'
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            userType: 'staff_regular',
            employDate: '2023-05-20',
            status: 'Active',
            phone_number: '+60123456788',
            ic_number: '911234-56-7890',
            role: 'Technical Support'
          },
          {
            id: '3',
            name: 'Ahmad Abdullah',
            email: 'ahmad@example.com',
            userType: 'staff_supervisor',
            employDate: '2022-11-10',
            status: 'On Leave',
            phone_number: '+60123456787',
            ic_number: '921234-56-7890',
            role: 'Operations Supervisor'
          },
          {
            id: '4',
            name: 'Sarah Lee',
            email: 'sarah@example.com',
            userType: 'staff_regular',
            employDate: '2023-01-05',
            status: 'Inactive',
            phone_number: '+60123456786',
            ic_number: '931234-56-7890',
            role: 'Customer Service'
          }
        ];

        setStaffList(mockData);
        
        // Extract all unique status values
        const uniqueStatuses = [...new Set(mockData.map(staff => staff.status))];
        setStatusOptions(uniqueStatuses);

      } catch (error) {
        console.error('Error fetching staff data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffData();
  }, [user, organizationInfo.organization_id]);

  const addStaffMember = (newStaff: StaffMember) => {
    setStaffList(prevList => [...prevList, newStaff]);
  };

  const updateStaffMember = (updatedStaff: StaffMember) => {
    setStaffList(prevList => 
      prevList.map(staff => 
        staff.id === updatedStaff.id ? updatedStaff : staff
      )
    );
  };

  const removeStaffMember = (staffId: string) => {
    setStaffList(prevList => prevList.filter(staff => staff.id !== staffId));
  };

  return {
    staffList,
    isLoading,
    statusOptions,
    addStaffMember,
    updateStaffMember,
    removeStaffMember
  };
};
