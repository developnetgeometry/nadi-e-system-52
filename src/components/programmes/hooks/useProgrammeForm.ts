
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FormValues, formSchema } from "../schemas/programme-schema";
import { getCurrentUserId, calculateDurationHours } from "../utils/form-helpers";

// Define types for data from database tables
export interface Category {
  id: number;
  name: string;
  is_active: boolean;
}

export interface Subcategory {
  id: number;
  name: string;
  category_id: number;
  is_active: boolean;
}

export interface Program {
  id: number;
  name: string;
  subcategory_id: number;
  is_active: boolean;
}

export interface Module {
  id: number;
  name: string;
  program_id: number;
  is_active: boolean;
}

export const useProgrammeForm = () => {
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

  // Query to fetch categories (only active ones)
  const { data: categories } = useQuery({
    queryKey: ["eventCategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nd_event_category")
        .select("*")
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
        .select("*")
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
        .select("*")
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
        .select("*")
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
      const durationHours = calculateDurationHours(startDate, endDate);

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

  return {
    form,
    categories,
    subcategories,
    programs,
    modules,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    selectedProgram,
    setSelectedProgram,
    onSubmit,
  };
};
