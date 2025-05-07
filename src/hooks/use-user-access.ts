
import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { useUserGroup } from "./use-user-group";

interface UserAccessResult {
  userType: string;
  isAdmin: boolean;
  isStaff: boolean;
  isSuperAdmin: boolean;
  isMember: boolean;
  isVendor: boolean;
  accessChecked: boolean;
}

export function useUserAccess(): UserAccessResult {
  const { user } = useAuth();
  const { userType: groupType, isSuperAdmin } = useUserGroup();
  const [userType, setUserType] = useState<string>("");
  const [accessChecked, setAccessChecked] = useState(false);

  useEffect(() => {
    if (user?.user_metadata?.user_type) {
      setUserType(user.user_metadata.user_type);
      setAccessChecked(true);
    } else if (groupType) {
      setUserType(groupType);
      setAccessChecked(true);
    }
  }, [user, groupType]);

  // Staff types include staff_manager, staff_assistant_manager, and now tp_site
  const isStaff = userType === "staff_manager" || 
                 userType === "staff_assistant_manager" || 
                 userType === "tp_site";
  
  // Admin types
  const isAdmin = userType === "super_admin" || 
                 userType === "tp_admin" || 
                 userType === "tp_hr" || 
                 isSuperAdmin;
  
  const isMember = userType === "member";
  const isVendor = userType === "vendor_admin" || userType === "vendor_staff";

  return {
    userType,
    isAdmin,
    isStaff,
    isSuperAdmin,
    isMember,
    isVendor,
    accessChecked,
  };
}
