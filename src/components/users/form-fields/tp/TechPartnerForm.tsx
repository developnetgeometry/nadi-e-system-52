
import { UseFormReturn } from "react-hook-form";
import { UserFormData } from "../../types";
import {
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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { OrganizationType } from "@/types/organization";
import { useEffect } from "react";

interface TechPartnerFormProps {
  form: UseFormReturn<UserFormData>;
  isLoading: boolean;
}

export function TechPartnerForm({ form, isLoading }: TechPartnerFormProps) {
  const userType = form.watch("user_type");

  // Fetch organizations of type 'tp' (Technology Partner)
  const { data: organizations, isLoading: isLoadingOrganizations } = useQuery({
    queryKey: ["organizations-tp"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select("id, name")
        .eq("type", "tp" as OrganizationType)
        .order("name", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // Fetch available sites based on organization
  const organizationId = form.watch("organization_id");
  const { data: sites, isLoading: isLoadingSites } = useQuery({
    queryKey: ["organization-sites", organizationId],
    queryFn: async () => {
      if (!organizationId) return [];
      
      const { data, error } = await supabase
        .from("nd_site_profile")
        .select("id, sitename")
        .eq("dusp_tp_id", organizationId)
        .order("sitename", { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!organizationId && userType === "tp_site",
  });

  // Fetch races
  const { data: races, isLoading: isLoadingRaces } = useQuery({
    queryKey: ["races"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nd_races")
        .select("id, eng, bm")
        .order("eng", {
          ascending: true,
        });
      if (error) throw error;
      return data;
    },
  });

  // Fetch religions
  const { data: religions, isLoading: isLoadingReligions } = useQuery({
    queryKey: ["religions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nd_religion")
        .select("id, eng, bm")
        .order("eng", {
          ascending: true,
        });
      if (error) throw error;
      return data;
    },
  });

  // Fetch marital statuses
  const { data: maritalStatuses, isLoading: isLoadingMaritalStatuses } =
    useQuery({
      queryKey: ["marital-statuses"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("nd_marital_status")
          .select("id, eng, bm")
          .order("eng", {
            ascending: true,
          });
        if (error) throw error;
        return data;
      },
    });

  // Fetch nationalities
  const { data: nationalities, isLoading: isLoadingNationalities } = useQuery({
    queryKey: ["nationalities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nd_nationalities")
        .select("id, eng, bm")
        .order("eng", {
          ascending: true,
        });
      if (error) throw error;
      return data;
    },
  });

  // Map user type to organization role
  useEffect(() => {
    if (userType && userType.startsWith('tp_')) {
      let role = '';
      
      if (userType === 'tp_admin') {
        role = 'admin';
      } else if (userType === 'tp_finance') {
        role = 'finance';
      } else if (userType === 'tp_hr') {
        role = 'hr';
      } else if (userType === 'tp_management') {
        role = 'management';
      } else if (userType === 'tp_operation') {
        role = 'operation';
      } else if (userType === 'tp_pic') {
        role = 'pic';
      } else if (userType === 'tp_region') {
        role = 'region';
      } else if (userType === 'tp_site') {
        role = 'site';
      } else {
        role = 'member'; // Default role
      }
      
      form.setValue("organization_role", role);
    }
  }, [userType, form]);

  // Check if any data is still loading
  const isDataLoading =
    isLoadingOrganizations ||
    isLoadingRaces ||
    isLoadingReligions ||
    isLoadingMaritalStatuses ||
    isLoadingNationalities;

  return (
    <div className="mt-4 p-4 bg-muted rounded-md">
      <h3 className="text-lg font-medium mb-3">
        Technology Partner Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Technology Partner Organization */}
        <FormField
          control={form.control}
          name="organization_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Organization <span className="text-red-500">*</span>
              </FormLabel>
              {isLoadingOrganizations ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select organization" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {organizations?.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Organization Role - Read-only as it's set automatically based on user_type */}
        <FormField
          control={form.control}
          name="organization_role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Role <span className="text-red-500">*</span>
              </FormLabel>
              <Input 
                value={field.value || ""}
                disabled={true}
                className="bg-gray-100"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Site selection for tp_site users */}
        {userType === "tp_site" && (
          <FormField
            control={form.control}
            name="assigned_site_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Assigned Site <span className="text-red-500">*</span>
                </FormLabel>
                {isLoadingSites ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select
                    disabled={isLoading || !organizationId}
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select site" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sites.map((site) => (
                        <SelectItem key={site.id} value={site.id.toString()}>
                          {site.sitename}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Personal Email */}
        <FormField
          control={form.control}
          name="personal_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Personal Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="personal@example.com"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Join Date */}
        <FormField
          control={form.control}
          name="join_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Join Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Qualification */}
        <FormField
          control={form.control}
          name="qualification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qualification</FormLabel>
              <FormControl>
                <Input
                  placeholder="Bachelor's Degree, Master's, etc."
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date of Birth */}
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input type="date" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Place of Birth */}
        <FormField
          control={form.control}
          name="place_of_birth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Place of Birth</FormLabel>
              <FormControl>
                <Input
                  placeholder="Kuala Lumpur, Penang, etc."
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Marital Status */}
        <FormField
          control={form.control}
          name="marital_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marital Status</FormLabel>
              {isLoadingMaritalStatuses ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {maritalStatuses?.map((status) => (
                      <SelectItem key={status.id} value={status.id.toString()}>
                        {status.eng}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Race */}
        <FormField
          control={form.control}
          name="race_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Race</FormLabel>
              {isLoadingRaces ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select race" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {races?.map((race) => (
                      <SelectItem key={race.id} value={race.id.toString()}>
                        {race.eng}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Religion */}
        <FormField
          control={form.control}
          name="religion_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Religion</FormLabel>
              {isLoadingReligions ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select religion" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {religions?.map((religion) => (
                      <SelectItem
                        key={religion.id}
                        value={religion.id.toString()}
                      >
                        {religion.eng}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nationality */}
        <FormField
          control={form.control}
          name="nationality_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nationality</FormLabel>
              {isLoadingNationalities ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {nationalities?.map((nationality) => (
                      <SelectItem
                        key={nationality.id}
                        value={nationality.id.toString()}
                      >
                        {nationality.eng}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
