
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/dashboard/PageHeader";
import { PageContainer } from "@/components/ui/dashboard/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface VendorStaffFormData {
  fullname: string;
  ic_no: string;
  mobile_no: string;
  work_email: string;
  password: string;
}

const VendorStaffRegistration = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<VendorStaffFormData>({
    defaultValues: {
      fullname: "",
      ic_no: "",
      mobile_no: "",
      work_email: "",
      password: "",
    },
  });

  const onSubmit = async (data: VendorStaffFormData) => {
    setLoading(true);
    try {
      console.log("Submitting vendor admin registration:", data);

      // Validate required fields
      if (!data.fullname || !data.ic_no || !data.work_email || !data.password) {
        throw new Error("Please fill in all required fields");
      }

      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error("You must be logged in to register staff");
      }

      // First try to get registration number from vendor profile created by current user
      const { data: vendorProfile, error: vendorProfileError } = await supabase
        .from("nd_vendor_profile")
        .select("registration_number")
        .eq("created_by", currentUser.id)
        .maybeSingle();

      let registrationNumber = vendorProfile?.registration_number;

      // If not found in vendor profile, try to get from vendor staff records
      if (!registrationNumber) {
        const { data: vendorStaff, error: vendorStaffError } = await supabase
          .from("nd_vendor_staff")
          .select("registration_number")
          .eq("user_id", currentUser.id)
          .maybeSingle();

        registrationNumber = vendorStaff?.registration_number;
      }

      if (!registrationNumber) {
        throw new Error("No vendor company found. Please register a vendor company first before adding staff.");
      }

      console.log("Using registration number:", registrationNumber);

      // Check if vendor admin already exists for this company
      const { data: existingAdmin, error: adminCheckError } = await supabase
        .from("nd_vendor_staff")
        .select("id")
        .eq("registration_number", registrationNumber)
        .eq("position_id", 1) // Admin position
        .maybeSingle();

      if (adminCheckError) {
        console.error("Admin check error:", adminCheckError);
        throw new Error(`Failed to check existing admin: ${adminCheckError.message}`);
      }

      if (existingAdmin) {
        throw new Error("A vendor admin already exists for this company. Only one admin per company is allowed.");
      }

      // Create user account using the edge function
      const { data: authData, error: authError } = await supabase.functions.invoke("create-user", {
        body: {
          email: data.work_email,
          fullName: data.fullname,
          userType: "vendor_admin", // Fixed to vendor_admin only
          userGroup: 5, // vendor group
          phoneNumber: data.mobile_no,
          icNumber: data.ic_no,
          password: data.password,
        },
      });

      if (authError) {
        console.error("Auth error:", authError);
        throw new Error(`Failed to create user account: ${authError.message}`);
      }

      if (!authData?.id) {
        throw new Error("Failed to create user account - no user ID returned");
      }

      console.log("User created with ID:", authData.id);

      // Insert vendor staff record with fixed position_id = 1 (Admin)
      const staffData = {
        user_id: authData.id,
        fullname: data.fullname,
        ic_no: data.ic_no,
        mobile_no: data.mobile_no,
        work_email: data.work_email,
        position_id: 1, // Fixed to Admin position
        registration_number: registrationNumber, // Keep as string/varchar, not BigInt
        is_active: true,
        created_by: currentUser.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("Inserting vendor staff:", staffData);

      const { error: staffError } = await supabase
        .from("nd_vendor_staff")
        .insert(staffData);

      if (staffError) {
        console.error("Staff creation error:", staffError);
        throw new Error(`Failed to create staff record: ${staffError.message}`);
      }

      toast({
        title: "Success",
        description: "Vendor admin registered successfully",
      });

      navigate("/vendor/staff");
    } catch (error: any) {
      console.error("Error registering vendor admin:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to register vendor admin",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageContainer>
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link to="/vendor/staff">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Staff
            </Link>
          </Button>
        </div>

        <PageHeader
          title="Register Vendor Admin"
          description="Register a new vendor admin for the company"
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
            <Card>
              <CardHeader>
                <CardTitle>Admin Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> This form will create a Vendor Admin user with Admin position. 
                    Only one admin per company is allowed.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter full name" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ic_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IC Number *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter IC number" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="mobile_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter mobile number" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="work_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Email *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter work email"
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Fixed User Type and Position Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">User Type</label>
                    <div className="p-3 bg-gray-50 border rounded-md">
                      <span className="text-sm text-gray-600">Vendor Admin (Fixed)</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Position</label>
                    <div className="p-3 bg-gray-50 border rounded-md">
                      <span className="text-sm text-gray-600">Admin (Fixed)</span>
                    </div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Enter password"
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" asChild>
                <Link to="/vendor/staff">Cancel</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Registering..." : "Register Admin"}
              </Button>
            </div>
          </form>
        </Form>
      </PageContainer>
    </div>
  );
};

export default VendorStaffRegistration;
