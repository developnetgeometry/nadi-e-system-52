
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { UserFormData } from "../types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useMemo } from "react";

interface UserTypeFieldProps {
  form: UseFormReturn<UserFormData>;
  isLoading: boolean;
  required?: boolean;
}

export function UserTypeField({
  form,
  isLoading,
  required = true,
}: UserTypeFieldProps) {
  const selectedUserGroup = form.watch("user_group");

  const { data: userTypes = [], isLoading: isLoadingTypes } = useQuery({
    queryKey: ["user-types"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("roles")
          .select("name, description")
          .order("name", { ascending: true });

        if (error) throw error;
        return data || []; // Ensure we return an array even if data is null
      } catch (e) {
        console.error("Error fetching user types:", e);
        return [];
      }
    },
  });

  const { data: selectedGroupInfo } = useQuery({
    queryKey: ["user-group-info", selectedUserGroup],
    queryFn: async () => {
      if (!selectedUserGroup) return null;
      
      try {
        const { data, error } = await supabase
          .from("nd_user_group")
          .select("group_name")
          .eq("id", selectedUserGroup)
          .single();
        
        if (error) throw error;
        return data;
      } catch (e) {
        console.error("Error fetching group info:", e);
        return null;
      }
    },
    enabled: !!selectedUserGroup,
  });
  
  // Filter user types based on the selected user group
  const filteredUserTypes = useMemo(() => {
    if (!userTypes || !selectedGroupInfo?.group_name) return userTypes || [];
    
    const groupName = (selectedGroupInfo.group_name || "").toLowerCase();
    let keyword = "";
    
    if (groupName.includes("mcmc")) {
      keyword = "mcmc";
    } else if (groupName.includes("dusp")) {
      keyword = "dusp";
    } else if (groupName.includes("sso")) {
      keyword = "sso";
    } else if (groupName.includes("tp") || groupName.includes("tech partner")) {
      keyword = "tp";
    } else if (groupName.includes("vendor")) {
      keyword = "vendor";
    }
    
    // If keyword is empty, return all user types
    if (!keyword) return userTypes;
    
    // Filter user types that include the keyword
    return userTypes.filter(type => 
      (type.name || "").toLowerCase().includes(keyword)
    );
  }, [userTypes, selectedGroupInfo]);

  // Reset user type when user group changes
  useEffect(() => {
    if (selectedUserGroup) {
      form.setValue("user_type", "");
    }
  }, [selectedUserGroup, form]);

  return (
    <FormField
      control={form.control}
      name="user_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{required ? "User Type *" : "User Type"}</FormLabel>
          {isLoadingTypes ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select
              disabled={isLoading || !selectedUserGroup}
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={
                    !selectedUserGroup 
                      ? "Please select a user group first" 
                      : "Select a user type"
                  } />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {(filteredUserTypes || []).map((type) => (
                  <SelectItem key={type.name} value={type.name || ""}>
                    {type.name}{" "}
                    {type.description ? `- ${type.description}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
