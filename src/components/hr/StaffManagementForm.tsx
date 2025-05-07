
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { createStaffMember } from "@/lib/staff";

// Form schema
const staffFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone_number: z.string().min(10, "Phone number must be at least 10 characters"),
  ic_number: z.string().min(6, "IC number must be at least 6 characters"),
  userType: z.enum(["staff_manager", "staff_assistant_manager"]),
  siteLocation: z.string().min(1, "Please select a site location"),
});

type StaffFormValues = z.infer<typeof staffFormSchema>;

interface StaffManagementFormProps {
  organizationId: string;
  organizationName: string;
  onStaffAdded: (newStaff: any) => void;
  siteLocations: string[];
}

export function StaffManagementForm({
  organizationId,
  organizationName,
  onStaffAdded,
  siteLocations,
}: StaffManagementFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      ic_number: "",
      userType: "staff_manager",
      siteLocation: "",
    },
  });

  async function onSubmit(values: StaffFormValues) {
    setIsSubmitting(true);
    try {
      const staffData = {
        name: values.name,
        email: values.email,
        phone_number: values.phone_number,
        ic_number: values.ic_number,
        userType: values.userType,
        siteLocation: values.siteLocation,
        siteLocationName: siteLocations.find(loc => loc === values.siteLocation) || values.siteLocation,
        organizationId
      };

      const result = await createStaffMember(staffData);
      
      onStaffAdded({
        ...staffData,
        id: result.data?.id,
        status: "Active",
      });

      // Display success message
      toast({
        title: "Success",
        description: `${values.name} has been added successfully as ${values.userType.replace(/_/g, " ")}`,
      });

      // Reset form
      form.reset();
    } catch (error: any) {
      console.error("Error adding staff:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add staff member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>Add New Staff</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address*</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number*</FormLabel>
                    <FormControl>
                      <Input placeholder="0123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ic_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IC Number*</FormLabel>
                    <FormControl>
                      <Input placeholder="990101-10-1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Role*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="staff_manager">Staff Manager</SelectItem>
                        <SelectItem value="staff_assistant_manager">Staff Assistant Manager</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="siteLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Location*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select site location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {siteLocations.length > 0 ? (
                          siteLocations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="default" disabled>
                            No locations available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Staff Member"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
