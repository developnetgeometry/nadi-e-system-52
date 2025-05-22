
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "lucide-react";

// Define types for data from database tables
interface Category {
  id: number;
  name: string;
  is_active: boolean;
}

interface Subcategory {
  id: number;
  name: string;
  category_id: number;
  is_active: boolean;
}

interface Program {
  id: number;
  name: string;
  subcategory_id: number;
  is_active: boolean;
}

interface Module {
  id: number;
  name: string;
  program_id: number;
  is_active: boolean;
}

// Form schema with validations
const formSchema = z.object({
  program_name: z.string().min(3, "Programme name must be at least 3 characters"),
  category_id: z.string().min(1, "Category is required"),
  subcategory_id: z.string().min(1, "Subcategory/Pillar is required"),
  program_id: z.string().min(1, "Program is required"),
  module_id: z.string().min(1, "Module is required"),
  description: z.string().optional(),
  location_event: z.string().min(3, "Location is required"),
  start_datetime: z.string().min(1, "Start date and time is required"),
  end_datetime: z.string().min(1, "End date and time is required"),
  target_participant: z.string().optional(),
  total_participant: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const RegisterProgrammeForm: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  // Create form instance
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      program_name: "",
      category_id: "",
      subcategory_id: "",
      program_id: "",
      module_id: "",
      description: "",
      location_event: "",
      start_datetime: "",
      end_datetime: "",
      target_participant: "",
      total_participant: "",
    },
  });

  // Query to fetch categories from nd_event_category table
  const { data: categories } = useQuery({
    queryKey: ["eventCategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nd_event_category")
        .select("id, name, is_active")
        .eq("is_active", true);

      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
      return data as Category[];
    },
  });

  // Query to fetch subcategories based on selected category
  const { data: subcategories } = useQuery({
    queryKey: ["eventSubcategories", selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return [];

      const { data, error } = await supabase
        .from("nd_event_subcategory")
        .select("id, name, category_id, is_active")
        .eq("category_id", selectedCategory)
        .eq("is_active", true);

      if (error) {
        console.error("Error fetching subcategories:", error);
        throw error;
      }
      return data as Subcategory[];
    },
    enabled: !!selectedCategory,
  });

  // Query to fetch programs based on selected subcategory
  const { data: programs } = useQuery({
    queryKey: ["eventPrograms", selectedSubcategory],
    queryFn: async () => {
      if (!selectedSubcategory) return [];

      const { data, error } = await supabase
        .from("nd_event_program")
        .select("id, name, subcategory_id, is_active")
        .eq("subcategory_id", selectedSubcategory)
        .eq("is_active", true);

      if (error) {
        console.error("Error fetching programs:", error);
        throw error;
      }
      return data as Program[];
    },
    enabled: !!selectedSubcategory,
  });

  // Query to fetch modules based on selected program
  const { data: modules } = useQuery({
    queryKey: ["eventModules", selectedProgram],
    queryFn: async () => {
      if (!selectedProgram) return [];

      const { data, error } = await supabase
        .from("nd_event_module")
        .select("id, name, program_id, is_active")
        .eq("program_id", selectedProgram)
        .eq("is_active", true);

      if (error) {
        console.error("Error fetching modules:", error);
        throw error;
      }
      return data as Module[];
    },
    enabled: !!selectedProgram,
  });

  // Reset dependent fields when parent field changes
  useEffect(() => {
    if (selectedCategory) {
      form.setValue("subcategory_id", "");
      form.setValue("program_id", "");
      form.setValue("module_id", "");
      setSelectedSubcategory(null);
      setSelectedProgram(null);
    }
  }, [selectedCategory, form]);

  useEffect(() => {
    if (selectedSubcategory) {
      form.setValue("program_id", "");
      form.setValue("module_id", "");
      setSelectedProgram(null);
    }
  }, [selectedSubcategory, form]);

  useEffect(() => {
    if (selectedProgram) {
      form.setValue("module_id", "");
    }
  }, [selectedProgram, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      console.log("Form values:", values);

      // Calculate duration based on start and end dates
      const startDate = new Date(values.start_datetime);
      const endDate = new Date(values.end_datetime);
      const durationHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

      // Convert participant counts to numbers if provided
      const targetParticipant = values.target_participant ? parseInt(values.target_participant) : null;
      const totalParticipant = values.total_participant ? parseInt(values.total_participant) : null;

      // Prepare data for insertion
      const eventData = {
        program_name: values.program_name,
        category_id: parseInt(values.category_id),
        subcategory_id: parseInt(values.subcategory_id),
        program_id: parseInt(values.program_id),
        module_id: parseInt(values.module_id),
        description: values.description,
        location_event: values.location_event,
        start_datetime: values.start_datetime,
        end_datetime: values.end_datetime,
        duration: durationHours,
        target_participant: targetParticipant,
        total_participant: totalParticipant,
        requester_id: await getCurrentUserId(),
        created_by: await getCurrentUserId(),
      };

      // Insert into nd_event table
      const { data, error } = await supabase
        .from("nd_event")
        .insert(eventData)
        .select();

      if (error) {
        console.error("Error registering programme:", error);
        toast({
          title: "Error",
          description: "Failed to register the programme. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Programme registered successfully",
      });

      // Navigate back to programmes list
      navigate("/programmes");
    } catch (error) {
      console.error("Error in form submission:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Helper function to get current user ID
  const getCurrentUserId = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.user.id;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="program_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Programme Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter programme name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category*</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedCategory(value);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.name}
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
            name="subcategory_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pillar (Sub-category)*</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedSubcategory(value);
                  }}
                  value={field.value}
                  disabled={!selectedCategory}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pillar" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subcategories?.map((subcategory) => (
                      <SelectItem key={subcategory.id} value={String(subcategory.id)}>
                        {subcategory.name}
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
            name="program_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Programme*</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedProgram(value);
                  }}
                  value={field.value}
                  disabled={!selectedSubcategory}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select programme" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {programs?.map((program) => (
                      <SelectItem key={program.id} value={String(program.id)}>
                        {program.name}
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
            name="module_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Module*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!selectedProgram}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select module" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {modules?.map((module) => (
                      <SelectItem key={module.id} value={String(module.id)}>
                        {module.name}
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
            name="location_event"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="start_datetime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date and Time*</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="datetime-local"
                      {...field}
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_datetime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date and Time*</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="datetime-local"
                      {...field}
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="target_participant"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Participants</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter target number of participants"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="total_participant"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Participants</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter total number of participants"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter programme description"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/programmes")}
          >
            Cancel
          </Button>
          <Button type="submit">Register Programme</Button>
        </div>
      </form>
    </Form>
  );
};

export default RegisterProgrammeForm;
