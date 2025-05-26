
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VendorStaffMember {
  id: number;
  fullname: string;
  ic_no: string;
  mobile_no: string;
  work_email: string;
  position_id: number;
  is_active: boolean;
  registration_number: number;
  user_id: string;
  vendor_company?: {
    business_name: string;
    registration_number: string;
    business_type: string;
  };
  contract_status?: {
    is_active: boolean;
    contract_start?: string;
    contract_end?: string;
  };
}

interface VendorStaffViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  staff: VendorStaffMember | null;
}

const VendorStaffViewDialog: React.FC<VendorStaffViewDialogProps> = ({
  isOpen,
  onClose,
  staff,
}) => {
  if (!staff) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Staff Details - {staff.fullname}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <p className="text-sm text-gray-900">{staff.fullname}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">IC Number</label>
                  <p className="text-sm text-gray-900">{staff.ic_no}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Mobile Number</label>
                  <p className="text-sm text-gray-900">{staff.mobile_no}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Work Email</label>
                  <p className="text-sm text-gray-900">{staff.work_email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Position</label>
                  <p className="text-sm text-gray-900">
                    {staff.position_id === 1 ? "Admin" : "Staff"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div>
                    <Badge variant={staff.is_active ? "default" : "secondary"}>
                      {staff.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Business Name</label>
                  <p className="text-sm text-gray-900">{staff.vendor_company?.business_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Registration Number</label>
                  <p className="text-sm text-gray-900">{staff.vendor_company?.registration_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Business Type</label>
                  <p className="text-sm text-gray-900">{staff.vendor_company?.business_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Contract Status</label>
                  <div>
                    <Badge variant={staff.contract_status?.is_active ? "default" : "destructive"}>
                      {staff.contract_status?.is_active ? "Active Contract" : "Inactive Contract"}
                    </Badge>
                  </div>
                </div>
              </div>
              {staff.contract_status?.contract_start && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Contract Start</label>
                    <p className="text-sm text-gray-900">{formatDate(staff.contract_status.contract_start)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Contract End</label>
                    <p className="text-sm text-gray-900">{formatDate(staff.contract_status.contract_end)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VendorStaffViewDialog;
