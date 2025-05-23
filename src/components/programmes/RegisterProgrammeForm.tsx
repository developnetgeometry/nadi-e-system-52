
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

// Define form schema
const formSchema = z.object({
  program_name: z.string().min(2, {
    message: "Program name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  location_event: z.string().optional(),
  start_datetime: z.date(),
  end_datetime: z.date(),
  duration: z.string().optional(),
  trainer_name: z.string().optional(),
  category_id: z.number(),
  subcategory_id: z.number(),
  program_id: z.string().optional(),
  module_id: z.string().optional(),
  program_mode: z.string().optional(),
  is_group_event: z.boolean().default(false),
  total_participant: z.number().optional(),
  status_id: z.number(),
});

// Define types for form
type ProgrammeFormValues = z.infer<typeof formSchema>;

// Define props interface to include defaultCategoryId
interface RegisterProgrammeFormProps {
  programmeData?: any;
  isEditMode?: boolean;
  defaultCategoryId?: number;
}

const RegisterProgrammeForm = ({ 
  programmeData, 
  isEditMode = false,
  defaultCategoryId
}: RegisterProgrammeFormProps) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);

  // Initialize form
  const form = useForm<ProgrammeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      program_name: programmeData?.program_name || "",
      description: programmeData?.description || "",
      location_event: programmeData?.location_event || "",
      start_datetime: programmeData?.start_datetime ? new Date(programmeData.start_datetime) : new Date(),
      end_datetime: programmeData?.end_datetime ? new Date(programmeData.end_datetime) : new Date(),
      duration: programmeData?.duration || "",
      trainer_name: programmeData?.trainer_name || "",
      category_id: programmeData?.category_id || defaultCategoryId || 0,
      subcategory_id: programmeData?.subcategory_id || 0,
      program_id: programmeData?.program_id || "",
      module_id: programmeData?.module_id || "",
      program_mode: programmeData?.program_mode || "",
      is_group_event: programmeData?.is_group_event || false,
      total_participant: programmeData?.total_participant || 0,
      status_id: programmeData?.status_id || 0,
    },
  });

  // Fetch categories, subcategories and statuses on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const { data: categoryData, error: categoryError } = await supabase
          .from('nd_event_category')
          .select('*')
          .eq('is_active', true);
        if (categoryError) throw categoryError;
        setCategories(categoryData || []);

        // Fetch subcategories (initially for the first category or the existing category)
        const initialCategoryId = programmeData?.category_id || defaultCategoryId || categoryData?.[0]?.id;
        if (initialCategoryId) {
          setSelectedCategory(initialCategoryId);
          const { data: subCategoryData, error: subCatError } = await supabase
            .from('nd_event_subcategory')
            .select('*')
            .eq('category_id', initialCategoryId)
            .eq('is_active', true);
          if (subCatError) throw subCatError;
          setSubCategories(subCategoryData || []);
        }

        // Fetch statuses
        const { data: statusData, error: statusError } = await supabase
          .from('nd_event_status')
          .select('*');
        if (statusError) throw statusError;
        setStatuses(statusData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [programmeData?.category_id, toast, defaultCategoryId]);

  // Handle category change
  const handleCategoryChange = async (categoryId: number) => {
    setSelectedCategory(categoryId);
    try {
      const { data: subCategories, error } = await supabase
        .from('nd_event_subcategory')
        .select('*')
        .eq('category_id', categoryId)
        .eq('is_active', true);
      if (error) throw error;
      setSubCategories(subCategories || []);
      form.setValue("subcategory_id", subCategories?.[0]?.id || 0);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast({
        title: "Error",
        description: "Failed to load subcategories. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle form submission
  const onSubmit = async (values: ProgrammeFormValues) => {
    setIsSubmitting(true);
    try {
      const dataToSubmit = {
        ...values,
        category_id: selectedCategory,
        start_datetime: format(values.start_datetime, 'yyyy-MM-dd HH:mm:ss'),
        end_datetime: format(values.end_datetime, 'yyyy-MM-dd HH:mm:ss'),
      };
      
      if (isEditMode && programmeData?.id) {
        const { error } = await supabase
          .from('nd_event')
          .update(dataToSubmit)
          .eq('id', programmeData.id);

        if (error) {
          console.error("Error updating programme:", error);
          toast({
            title: "Error",
            description: "Failed to update programme. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: "Programme updated successfully!",
          });
        }
      } else {
        const { error } = await supabase
          .from('nd_event')
          .insert([dataToSubmit]);

        if (error) {
          console.error("Error creating programme:", error);
          toast({
            title: "Error",
            description: "Failed to create programme. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: "Programme created successfully!",
          });
          form.reset();
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Initialize form with defaultCategoryId if it exists
  useEffect(() => {
    if (!isEditMode && defaultCategoryId) {
      const initializeForm = async () => {
        try {
          // Set the selected category and update form value
          setSelectedCategory(defaultCategoryId);
          form.setValue("category_id", defaultCategoryId);
          
          // Fetch subcategories for this category
          const { data: subCategories, error: subCatError } = await supabase
            .from('nd_event_subcategory')
            .select('*')
            .eq('category_id', defaultCategoryId)
            .eq('is_active', true);
            
          if (subCatError) throw subCatError;
          setSubCategories(subCategories || []);
          
          // Set first subcategory as default if available
          if (subCategories && subCategories.length > 0) {
            form.setValue("subcategory_id", subCategories[0].id);
          }
        } catch (error) {
          console.error("Error initializing form with default category:", error);
        }
      };
      
      initializeForm();
    }
  }, [isEditMode, defaultCategoryId, form]);
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-10">
        {/* Program Details Section */}
        <div className="border rounded-lg p-6 space-y-4 bg-white dark:bg-gray-950">
          <h2 className="text-xl font-semibold">Program Details</h2>
          
          {/* Category Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Category</FormLabel>
                  <Select
                    value={selectedCategory?.toString() || field.value?.toString()}
                    onValueChange={(value) => handleCategoryChange(parseInt(value))}
                    disabled={!!defaultCategoryId || isEditMode} // Disable if defaultCategoryId is provided
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Subcategory */}
            <FormField
              control={form.control}
              name="subcategory_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Subcategory</FormLabel>
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subCategories.map((subCat) => (
                        <SelectItem key={subCat.id} value={subCat.id.toString()}>
                          {subCat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Program Name */}
          <FormField
            control={form.control}
            name="program_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program Name</FormLabel>
                <FormControl>
                  <Input placeholder="Program name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Program description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Location */}
          <FormField
            control={form.control}
            name="location_event"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date and Time */}
            <FormField
              control={form.control}
              name="start_datetime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date and Time</FormLabel>
                  <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP p")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setIsStartDateOpen(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End Date and Time */}
            <FormField
              control={form.control}
              name="end_datetime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date and Time</FormLabel>
                  <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP p")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setIsEndDateOpen(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Duration */}
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input placeholder="Duration" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Trainer Name */}
          <FormField
            control={form.control}
            name="trainer_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trainer Name</FormLabel>
                <FormControl>
                  <Input placeholder="Trainer name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Additional Details Section */}
        <div className="border rounded-lg p-6 space-y-4 bg-white dark:bg-gray-950">
          <h2 className="text-xl font-semibold">Additional Details</h2>

          {/* Program ID and Module ID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Program ID */}
            <FormField
              control={form.control}
              name="program_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Program ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Module ID */}
            <FormField
              control={form.control}
              name="module_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Module ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Module ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Program Mode */}
          <FormField
            control={form.control}
            name="program_mode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program Mode</FormLabel>
                <FormControl>
                  <Input placeholder="Program mode" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Is Group Event and Total Participants */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Is Group Event */}
            <FormField
              control={form.control}
              name="is_group_event"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Is Group Event</FormLabel>
                    <FormDescription>
                      Check if this program is a group event.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="w-6 h-6"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Total Participants */}
            <FormField
              control={form.control}
              name="total_participant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Participants</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Total participants"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Status Section */}
        <div className="border rounded-lg p-6 space-y-4 bg-white dark:bg-gray-950">
          <h2 className="text-xl font-semibold">Status</h2>

          {/* Status ID */}
          <FormField
            control={form.control}
            name="status_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  value={field.value?.toString()}
                  onValueChange={(value) => field.onChange(parseInt(value))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.id} value={status.id.toString()}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : (
              isEditMode ? "Update Programme" : "Create Programme"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RegisterProgrammeForm;
