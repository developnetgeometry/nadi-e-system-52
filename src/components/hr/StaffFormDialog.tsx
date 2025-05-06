
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { createStaffMember } from "@/lib/staff";
import { useAuth } from "@/hooks/useAuth";
import { useUserAccess } from "@/hooks/use-user-access";
import { useUserMetadata } from "@/hooks/use-user-metadata";

const staffFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email({ message: "Please enter a valid email address" }),
  userType: z.string().min(2, "User type is required"),
  employDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Please enter a valid date",
  }),
  status: z.enum(["Active", "On Leave", "Inactive"]),
  siteLocation: z.string().min(2, "Site location is required"),
  phone_number: z.string()
    .regex(/^(\+?6?01)[0-9]{8,9}$/, { 
      message: "Please enter a valid Malaysian phone number (e.g., +60123456789 or 01123456789)" 
    })
    .optional()
    .or(z.literal('')),
  ic_number: z.string()
    .regex(/^\d{6}-\d{2}-\d{4}$/, { 
      message: "Please enter a valid IC number in the format xxxxxx-xx-xxxx" 
    }),
  personal_email: z.string().email({ message: "Please enter a valid personal email" }).optional().or(z.literal('')),
  qualification: z.string().optional().or(z.literal('')),
  dob: z.string().optional().or(z.literal('')),
  place_of_birth: z.string().optional().or(z.literal('')),
  marital_status: z.string().optional().or(z.literal('')),
  race_id: z.string().optional().or(z.literal('')),
  religion_id: z.string().optional().or(z.literal('')),
  nationality_id: z.string().optional().or(z.literal('')),
});

type StaffFormValues = z.infer<typeof staffFormSchema>;

interface StaffFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  organizationName: string;
  onStaffAdded: (staff: any) => void;
  siteLocations?: string[];
}

export function StaffFormDialog({
  open,
  onOpenChange,
  organizationId,
  organizationName,
  onStaffAdded,
  siteLocations,
}: StaffFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [availableSites, setAvailableSites] = useState<{id: string, sitename: string}[]>([]);
  const [userTypes, setUserTypes] = useState<string[]>([]);
  const { user } = useAuth();
  const { userType: currentUserType } = useUserAccess();
  const userMetadataString = useUserMetadata();
  
  const [races, setRaces] = useState<{id: string, eng: string}[]>([]);
  const [religions, setReligions] = useState<{id: string, eng: string}[]>([]);
  const [nationalities, setNationalities] = useState<{id: string, eng: string}[]>([]);
  const [maritalStatuses, setMaritalStatuses] = useState<{id: string, eng: string}[]>([]);
  const [cities, setCities] = useState<{id: string, name: string}[]>([]);
  
  const [currentUserCredentials, setCurrentUserCredentials] = useState<{
    email?: string;
    password?: string;
  }>({});

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const { data, error } = await supabase
          .from('nd_site_profile')
          .select('id, sitename')
          .eq('dusp_tp_id', organizationId);
        
        if (error) throw error;
        if (data) {
          setAvailableSites(data);
        }
      } catch (err) {
        console.error('Error fetching sites:', err);
        toast({
          title: "Error",
          description: "Failed to load site locations.",
          variant: "destructive",
        });
      }
    };

    const fetchUserTypes = async () => {
      try {
        const allowedTypes = ['staff_manager', 'staff_assistant_manager'];
        setUserTypes(allowedTypes);
      } catch (err) {
        console.error('Error fetching user types:', err);
      }
    };

    const fetchRaces = async () => {
      try {
        const { data, error } = await supabase
          .from('nd_races')
          .select('id, eng')
          .order('eng');
        
        if (error) throw error;
        if (data) setRaces(data);
      } catch (err) {
        console.error('Error fetching races:', err);
      }
    };

    const fetchReligions = async () => {
      try {
        const { data, error } = await supabase
          .from('nd_religion')
          .select('id, eng')
          .order('eng');
        
        if (error) throw error;
        if (data) setReligions(data);
      } catch (err) {
        console.error('Error fetching religions:', err);
      }
    };

    const fetchNationalities = async () => {
      try {
        const { data, error } = await supabase
          .from('nd_nationalities')
          .select('id, eng')
          .order('eng');
        
        if (error) throw error;
        if (data) setNationalities(data);
      } catch (err) {
        console.error('Error fetching nationalities:', err);
      }
    };

    const fetchMaritalStatuses = async () => {
      try {
        const { data, error } = await supabase
          .from('nd_marital_status')
          .select('id, eng')
          .order('eng');
        
        if (error) throw error;
        if (data) setMaritalStatuses(data);
      } catch (err) {
        console.error('Error fetching marital statuses:', err);
      }
    };

    const fetchCities = async () => {
      try {
        const { data, error } = await supabase
          .from('nd_city')
          .select('id, name')
          .order('name');
        
        if (error) throw error;
        if (data) setCities(data);
      } catch (err) {
        console.error('Error fetching cities:', err);
      }
    };

    if (organizationId) {
      fetchSites();
      fetchUserTypes();
      fetchRaces();
      fetchReligions();
      fetchNationalities();
      fetchMaritalStatuses();
      fetchCities();
    }
  }, [organizationId, toast]);

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      name: "",
      email: "",
      userType: "",
      employDate: new Date().toISOString().split("T")[0],
      status: "Active",
      siteLocation: "",
      phone_number: "",
      ic_number: "",
      personal_email: "",
      qualification: "",
      dob: "",
      place_of_birth: "",
      marital_status: "",
      race_id: "",
      religion_id: "",
      nationality_id: "",
    },
  });

  const handleICNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9-]/g, '');
    
    if (value.length > 6 && value.charAt(6) !== '-') {
      value = value.slice(0, 6) + '-' + value.slice(6);
    }
    if (value.length > 9 && value.charAt(9) !== '-') {
      value = value.slice(0, 9) + '-' + value.slice(9);
    }
    
    if (value.length > 14) {
      value = value.slice(0, 14);
    }
    
    form.setValue('ic_number', value);
  };

  useEffect(() => {
    const promptForPassword = async () => {
      if (user?.email) {
        setCurrentUserCredentials({
          email: user.email,
        });
      }
    };
    
    if (open && user) {
      promptForPassword();
    }
  }, [open, user]);

  const onSubmit = async (data: StaffFormValues) => {
    setIsSubmitting(true);
    try {
      const allowedCreatorTypes = ['tp_admin', 'tp_hr', 'super_admin'];
      if (!currentUserType || !allowedCreatorTypes.includes(currentUserType)) {
        throw new Error('You do not have permission to create staff members');
      }
      
      if (!['staff_manager', 'staff_assistant_manager'].includes(data.userType)) {
        throw new Error('Only staff_manager and staff_assistant_manager user types are allowed');
      }
      
      console.log("Submitting staff with user type:", data.userType, "and site location:", data.siteLocation);
      
      // Find the selected site for displaying in success message
      const selectedSite = availableSites.find(site => site.id === data.siteLocation);
      
      // Ensure site location is a number for database compatibility
      const siteLocationId = parseInt(data.siteLocation, 10);
      
      if (isNaN(siteLocationId)) {
        throw new Error('Invalid site location format');
      }
      
      // Parse organization ID from user metadata if available
      let parsedOrganizationId = organizationId;
      if (userMetadataString) {
        try {
          const metadata = JSON.parse(userMetadataString);
          if (metadata.organization_id) {
            parsedOrganizationId = metadata.organization_id;
          }
        } catch (error) {
          console.error("Error parsing user metadata:", error);
        }
      }

      const result = await createStaffMember({
        ...data,
        organizationId: parsedOrganizationId,
        siteLocation: siteLocationId, // Convert to number to match bigint in database
      });

      // If result includes user_id, add user to organization_users table
      if (result.data && result.data.user_id) {
        await supabase.from('organization_users').insert({
          user_id: result.data.user_id,
          organization_id: parsedOrganizationId,
          role: 'staff'
        });
      }

      onStaffAdded({
        ...result.data,
        name: data.name,
        userType: data.userType,
        siteLocationName: selectedSite?.sitename || "Unknown site"
      });
      
      toast({
        title: "Success",
        description: `${data.name} has been added to ${organizationName} as ${data.userType.replace(/_/g, ' ')} at ${selectedSite?.sitename || "Unknown site"}`,
      });
      onOpenChange(false);
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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New Staff Member
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John Doe" />
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
                    <FormLabel>Work Email*</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="user@example.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="personal_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personal Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="personal@example.com" />
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
                      <Input 
                        {...field} 
                        onChange={handleICNumberChange}
                        placeholder="xxxxxx-xx-xxxx"
                        className="font-mono"
                      />
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
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" placeholder="+60123456789" />
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
                    <FormLabel>User Type*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {userTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Date*</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="join_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Join Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
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
                          <SelectValue placeholder="Select site location">
                            {field.value && availableSites.find(site => site.id === field.value)?.sitename}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {availableSites.map((site) => (
                          <SelectItem key={site.id} value={site.id}>
                            {site.sitename}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="qualification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualification</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Bachelor's Degree, etc." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="place_of_birth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Place of Birth</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.name}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="marital_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marital Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select marital status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {maritalStatuses.map((status) => (
                          <SelectItem key={status.id} value={status.id}>
                            {status.eng}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="race_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Race</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select race" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {races.map((race) => (
                          <SelectItem key={race.id} value={race.id}>
                            {race.eng}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="religion_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Religion</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select religion" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {religions.map((religion) => (
                          <SelectItem key={religion.id} value={religion.id}>
                            {religion.eng}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nationality_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nationality</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select nationality" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {nationalities.map((nationality) => (
                          <SelectItem key={nationality.id} value={nationality.id}>
                            {nationality.eng}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Staff"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
