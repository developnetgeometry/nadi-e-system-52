
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  CalendarIcon, 
  Clock, 
  Users, 
  FileText, 
  Bookmark,
  MapPin
} from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

// Form schema for validation
const formSchema = z.object({
  program_name: z.string().min(1, "Programme name is required"),
  description: z.string().min(1, "Description is required"),
  category_id: z.coerce.number(),
  subcategory_id: z.coerce.number().optional(),
  program_id: z.coerce.number().optional(),
  module_id: z.coerce.number().optional(),
  start_datetime: z.date(),
  end_datetime: z.date().optional(),
  location_event: z.string().min(1, "Location is required"),
  trainer_name: z.string().min(1, "Trainer name is required"),
  program_mode: z.coerce.number(),
  is_group_event: z.boolean().optional(),
  total_participant: z.coerce.number().min(1, "Maximum participants is required"),
  target_participant: z.coerce.number().optional(),
  status_id: z.coerce.number().default(1),
});

type ProgrammeFormData = z.infer<typeof formSchema>;

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
  const { toast } = useToast();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [modules, setModules] = useState([]);
  const [programModes, setProgramModes] = useState([]);
  const [targetParticipants, setTargetParticipants] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(defaultCategoryId || null);

  const defaultValues = {
    program_name: programmeData?.program_name || "",
    description: programmeData?.description || "",
    category_id: programmeData?.category_id || defaultCategoryId || "",
    subcategory_id: programmeData?.subcategory_id || "",
    program_id: programmeData?.program_id || "",
    module_id: programmeData?.module_id || "",
    start_datetime: programmeData?.start_datetime ? new Date(programmeData.start_datetime) : new Date(),
    end_datetime: programmeData?.end_datetime ? new Date(programmeData.end_datetime) : undefined,
    location_event: programmeData?.location_event || "",
    trainer_name: programmeData?.trainer_name || "",
    program_mode: programmeData?.program_mode || "",
    is_group_event: programmeData?.is_group_event || false,
    total_participant: programmeData?.total_participant || "",
    target_participant: programmeData?.target_participant || "",
    status_id: programmeData?.status_id || 1,
  };

  const form = useForm<ProgrammeFormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Fetch options data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const { data: categoriesData } = await supabase
          .from("nd_event_category")
          .select("id, name")
          .filter("is_active", "eq", true)
          .order("id");
        setCategories(categoriesData || []);

        // Fetch program modes
        const { data: modesData } = await supabase
          .from("nd_program_mode")
          .select("id, name")
          .filter("is_active", "eq", true)
          .order("id");
        setProgramModes(modesData || []);

        // Fetch target participants
        const { data: targetData } = await supabase
          .from("nd_target_participant")
          .select("id, name")
          .filter("is_active", "eq", true)
          .order("id");
        setTargetParticipants(targetData || []);

        // Fetch statuses
        const { data: statusesData } = await supabase
          .from("nd_event_status")
          .select("id, name")
          .filter("is_active", "eq", true)
          .order("id");
        setStatuses(statusesData || []);

        // If editing or defaultCategoryId is provided, load subcategories
        if ((isEditMode && programmeData?.category_id) || defaultCategoryId) {
          const categoryToUse = isEditMode ? programmeData?.category_id : defaultCategoryId;
          setSelectedCategory(categoryToUse);
          await loadSubcategories(categoryToUse);
        }

        // If editing and has subcategory, load programs
        if (isEditMode && programmeData?.subcategory_id) {
          await loadPrograms(programmeData.subcategory_id);
        }

        // If editing and has program_id, load modules
        if (isEditMode && programmeData?.program_id) {
          await loadModules(programmeData.program_id);
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load form data. Please try again.",
        });
      }
    };

    fetchData();
  }, [isEditMode, programmeData, defaultCategoryId, toast]);

  // Load subcategories when category changes
  const loadSubcategories = async (categoryId: number) => {
    try {
      const { data } = await supabase
        .from("nd_event_subcategory")
        .select("id, name")
        .eq("category_id", categoryId)
        .filter("is_active", "eq", true)
        .order("id");
      setSubcategories(data || []);
    } catch (error) {
      console.error("Error loading subcategories:", error);
    }
  };

  // Load programs when subcategory changes
  const loadPrograms = async (subcategoryId: number) => {
    try {
      const { data } = await supabase
        .from("nd_event_program")
        .select("id, name")
        .eq("subcategory_id", subcategoryId)
        .filter("is_active", "eq", true)
        .order("id");
      setPrograms(data || []);
    } catch (error) {
      console.error("Error loading programs:", error);
    }
  };

  // Load modules when program changes
  const loadModules = async (programId: number) => {
    try {
      const { data } = await supabase
        .from("nd_event_module")
        .select("id, name")
        .eq("program_id", programId)
        .filter("is_active", "eq", true)
        .order("id");
      setModules(data || []);
    } catch (error) {
      console.error("Error loading modules:", error);
    }
  };

  // Handle form submission
  const onSubmit = async (values: ProgrammeFormData) => {
    setLoading(true);
    try {
      // Combine date and time for start and end datetime
      let startDateTime = values.start_datetime;
      let endDateTime = values.end_datetime || values.start_datetime;
      
      if (selectedStartTime) {
        const [startHours, startMinutes] = selectedStartTime.split(':').map(Number);
        startDateTime = new Date(startDateTime.setHours(startHours, startMinutes));
      }
      
      if (selectedEndTime) {
        const [endHours, endMinutes] = selectedEndTime.split(':').map(Number);
        endDateTime = new Date(endDateTime.setHours(endHours, endMinutes));
      }
      
      // Calculate duration in hours
      const duration = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
      
      const programmeDataToSave = {
        ...values,
        start_datetime: startDateTime.toISOString(),
        end_datetime: endDateTime.toISOString(),
        duration: duration,
      };
      
      // Add or update the programme
      let result;
      
      if (isEditMode && programmeData?.id) {
        result = await supabase
          .from('nd_event')
          .update(programmeDataToSave)
          .eq('id', programmeData.id)
          .select();
      } else {
        result = await supabase
          .from('nd_event')
          .insert([programmeDataToSave])
          .select();
      }
      
      if (result.error) {
        throw result.error;
      }
      
      toast({
        title: isEditMode ? "Programme Updated" : "Programme Created",
        description: isEditMode 
          ? "The programme has been successfully updated." 
          : "The programme has been successfully created.",
      });
      
      navigate("/programmes");
    } catch (error) {
      console.error("Error saving programme:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isEditMode ? "update" : "create"} programme. Please try again.`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
        {/* Basic Information */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-6">
              <Bookmark className="h-5 w-5 mr-2 text-primary" />
              <h2 className="text-xl font-semibold">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="program_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Programme Name<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter programme name" {...field} />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      The name of the programme as it will appear to users.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Right side placeholder for future fields if needed */}
            </div>
            
            {/* Categorization */}
            <div className="mt-8 mb-4">
              <div className="flex items-center mb-6">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                <h2 className="text-lg font-medium">Categorization</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Category<span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          const categoryId = parseInt(value);
                          setSelectedCategory(categoryId);
                          loadSubcategories(categoryId);
                          // Clear dependent fields
                          form.setValue("subcategory_id", undefined);
                          form.setValue("program_id", undefined);
                          form.setValue("module_id", undefined);
                        }}
                        defaultValue={field.value?.toString()}
                        value={field.value?.toString()}
                        disabled={!!defaultCategoryId || (isEditMode && !!programmeData?.category_id)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        The main category of the programme.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subcategory_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Pillar (Sub-category)<span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          loadPrograms(parseInt(value));
                          // Clear dependent fields
                          form.setValue("program_id", undefined);
                          form.setValue("module_id", undefined);
                        }}
                        defaultValue={field.value?.toString()}
                        value={field.value?.toString()}
                        disabled={!selectedCategory}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a pillar" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subcategories.map((subcategory) => (
                            <SelectItem
                              key={subcategory.id}
                              value={subcategory.id.toString()}
                            >
                              {subcategory.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        The pillar/sub-category of the programme.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="program_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Programme<span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          loadModules(parseInt(value));
                          form.setValue("module_id", undefined);
                        }}
                        defaultValue={field.value?.toString()}
                        value={field.value?.toString()}
                        disabled={subcategories.length === 0 || !form.getValues("subcategory_id")}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a programme" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {programs.map((program) => (
                            <SelectItem
                              key={program.id}
                              value={program.id.toString()}
                            >
                              {program.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        The specific programme.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="module_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Module</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value?.toString()}
                        value={field.value?.toString()}
                        disabled={programs.length === 0 || !form.getValues("program_id")}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a module" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {modules.map((module) => (
                            <SelectItem
                              key={module.id}
                              value={module.id.toString()}
                            >
                              {module.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        Optional: The specific module within the programme.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date & Time */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-6">
              <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
              <h2 className="text-xl font-semibold">Date & Time</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="start_datetime"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        Start Date<span className="text-red-500">*</span>
                      </FormLabel>
                      <Popover>
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
                                format(field.value, "PPP")
                              ) : (
                                <span>Select date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <p className="text-sm text-muted-foreground">
                        The date when the programme starts.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormItem>
                  <FormLabel>
                    Start Time<span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Input
                      className="col-span-11"
                      type="time"
                      value={selectedStartTime}
                      onChange={(e) => setSelectedStartTime(e.target.value)}
                    />
                    <Clock className="h-4 w-4 text-muted-foreground col-span-1" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The time when the programme starts.
                  </p>
                </FormItem>
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="end_datetime"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
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
                                format(field.value, "PPP")
                              ) : (
                                <span>Select date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <p className="text-sm text-muted-foreground">
                        Optional: The date when the programme ends.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <Input
                      className="col-span-11"
                      type="time"
                      value={selectedEndTime}
                      onChange={(e) => setSelectedEndTime(e.target.value)}
                    />
                    <Clock className="h-4 w-4 text-muted-foreground col-span-1" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The time when the programme ends.
                  </p>
                </FormItem>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Event Details */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-6">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              <h2 className="text-xl font-semibold">Event Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormField
                control={form.control}
                name="program_mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Mode<span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="space-y-2">
                      {programModes.map((mode) => (
                        <div key={mode.id} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`mode-${mode.id}`}
                            checked={field.value === mode.id}
                            onChange={() => field.onChange(mode.id)}
                            className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                          />
                          <label htmlFor={`mode-${mode.id}`} className="text-sm font-medium">
                            {mode.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Is this programme conducted physically or online?
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location_event"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Location<span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input placeholder="e.g. Kuala Lumpur" {...field} />
                      </FormControl>
                      <MapPin className="h-4 w-4 absolute right-3 top-3 text-gray-400" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Where the programme will take place.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_group_event"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-6">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Group Event</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Is this a group event?
                    </p>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Participants & Instructor */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-6">
              <Users className="h-5 w-5 mr-2 text-primary" />
              <h2 className="text-xl font-semibold">Participants & Instructor</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="total_participant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Maximum Participants<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 50"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value === "" ? "" : parseInt(e.target.value))}
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      The maximum number of participants allowed.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="target_participant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Participant</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString()}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select target participants" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {targetParticipants.map((target) => (
                          <SelectItem
                            key={target.id}
                            value={target.id.toString()}
                          >
                            {target.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      The target audience for this programme.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="trainer_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Trainer / Organization Name<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter trainer name" {...field} />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      Name of the trainer or organization running this programme.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-6">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              <h2 className="text-xl font-semibold">Description</h2>
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter programme description"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    Detailed description of the programme.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* File Attachments - For future implementation */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-6">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              <h2 className="text-xl font-semibold">File Attachments</h2>
            </div>
            
            <div className="border-2 border-dashed rounded-lg p-10 text-center">
              <div className="flex justify-center mb-4">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-muted-foreground mb-2">
                Drop files here or click to upload
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                PDF, DOCX, XLSX, JPG, PNG up to 10MB each
              </p>
              <Button variant="outline" disabled className="cursor-not-allowed">Choose Files</Button>
              <p className="text-xs text-muted-foreground mt-4">
                (File upload functionality will be available soon)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Programme Status */}
        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="status_id"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="active-status"
                      checked={field.value === 1}
                      onCheckedChange={(checked) => {
                        field.onChange(checked ? 1 : 2); // 1 for active, 2 for inactive
                      }}
                    />
                    <label
                      htmlFor="active-status"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Active
                    </label>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    This programme will be visible and open for registration.
                  </p>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={() => navigate("/programmes")}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? "Updating..." : "Registering..."}
              </>
            ) : (
              <>{isEditMode ? "Update Programme" : "Register Programme"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RegisterProgrammeForm;
