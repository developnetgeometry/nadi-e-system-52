
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { supabase, BUCKET_NAME_UTILITIES } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
import { useFileUpload } from "@/hooks/use-file-upload";
import { useAuth } from "@/hooks/useAuth";
import { Checkbox } from "@/components/ui/checkbox";
import TimeInput from "@/components/ui/TimePicker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatDuration } from "@/utils/date-utils";

// Form validation schema
const formSchema = z.object({
  title: z.string().min(1, { message: "Programme name is required" }),
  description: z.string().optional(),
  location: z.string().optional(),
  start_date: z.string().min(1, { message: "Start date is required" }),
  end_date: z.string().min(1, { message: "End date is required" }),
  trainer_name: z.string().optional(),
  files: z.any().optional(),
  category: z.string().min(1, { message: "Category is required" }),
  pillar: z.string().min(1, { message: "Pillar is required" }),
  programme: z.string().min(1, { message: "Programme is required" }),
  module: z.string().min(1, { message: "Module is required" }),
  start_time: z.string().min(1, { message: "Start time is required" }),
  end_time: z.string().min(1, { message: "End time is required" }),
  event_type: z.string().min(1, { message: "Event type is required" }),
  is_group_event: z.boolean().default(false),
  mode: z.enum(["Physical", "Online"]),
  max_participants: z.string().optional(),
  target_participant: z.string().min(1, { message: "Target participant is required" }),
  is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

const RegisterProgrammeForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isUploading, uploadFile } = useFileUpload();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duration, setDuration] = useState("");
  
  // Categories
  const eventCategories = [
    { value: "awareness", label: "Awareness" },
    { value: "training", label: "Training" },
    { value: "workshop", label: "Workshop" },
    { value: "seminar", label: "Seminar" }
  ];
  
  // Pillars
  const pillars = [
    { value: "digital-transformation", label: "Digital Transformation", categoryId: "training" },
    { value: "digital-skills", label: "Digital Skills", categoryId: "training" },
    { value: "digital-society", label: "Digital Society", categoryId: "awareness" },
    { value: "digital-economy", label: "Digital Economy", categoryId: "seminar" },
    { value: "digital-government", label: "Digital Government", categoryId: "workshop" }
  ];
  
  // Programmes
  const programmes = [
    { value: "data-science", label: "Data Science", pillarId: "digital-skills" },
    { value: "cybersecurity", label: "Cybersecurity", pillarId: "digital-skills" },
    { value: "cloud-computing", label: "Cloud Computing", pillarId: "digital-transformation" },
    { value: "ai", label: "Artificial Intelligence", pillarId: "digital-transformation" },
    { value: "e-commerce", label: "E-Commerce", pillarId: "digital-economy" },
    { value: "fintech", label: "Fintech", pillarId: "digital-economy" },
    { value: "e-governance", label: "E-Governance", pillarId: "digital-government" },
    { value: "community-outreach", label: "Community Outreach", pillarId: "digital-society" }
  ];
  
  // Modules
  const modules = [
    { value: "intro-python", label: "Introduction to Python", programmeId: "data-science" },
    { value: "data-visualization", label: "Data Visualization", programmeId: "data-science" },
    { value: "ml-basics", label: "Machine Learning Basics", programmeId: "data-science" },
    { value: "network-security", label: "Network Security", programmeId: "cybersecurity" },
    { value: "ethical-hacking", label: "Ethical Hacking", programmeId: "cybersecurity" },
    { value: "aws-essentials", label: "AWS Essentials", programmeId: "cloud-computing" },
    { value: "azure-fundamentals", label: "Azure Fundamentals", programmeId: "cloud-computing" },
    { value: "deep-learning", label: "Deep Learning", programmeId: "ai" },
    { value: "nlp", label: "Natural Language Processing", programmeId: "ai" },
    { value: "shopify", label: "Shopify", programmeId: "e-commerce" },
    { value: "digital-marketing", label: "Digital Marketing", programmeId: "e-commerce" },
    { value: "blockchain", label: "Blockchain", programmeId: "fintech" },
    { value: "digital-payments", label: "Digital Payments", programmeId: "fintech" },
    { value: "digital-services", label: "Digital Services", programmeId: "e-governance" },
    { value: "digital-literacy", label: "Digital Literacy", programmeId: "community-outreach" }
  ];
  
  // Event types
  const eventTypes = [
    { value: "webinar", label: "Webinar", color: "bg-blue-500" },
    { value: "workshop", label: "Workshop", color: "bg-green-500" },
    { value: "conference", label: "Conference", color: "bg-purple-500" },
    { value: "training", label: "Training", color: "bg-yellow-500" },
    { value: "meetup", label: "Meetup", color: "bg-red-500" }
  ];
  
  // Target participants
  const targetParticipants = [
    { value: "beginners", label: "Beginners" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "professionals", label: "Professionals" },
    { value: "students", label: "Students" },
    { value: "seniors", label: "Seniors" },
    { value: "entrepreneurs", label: "Entrepreneurs" },
    { value: "public-servants", label: "Public Servants" }
  ];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      start_date: "",
      end_date: "",
      trainer_name: "",
      files: undefined,
      category: "",
      pillar: "",
      programme: "",
      module: "",
      start_time: "",
      end_time: "",
      event_type: "",
      is_group_event: false,
      mode: "Physical",
      max_participants: "",
      target_participant: "",
      is_active: true,
    },
  });
  
  // Filtered options based on selections
  const [filteredPillars, setFilteredPillars] = useState(pillars);
  const [filteredProgrammes, setFilteredProgrammes] = useState(programmes);
  const [filteredModules, setFilteredModules] = useState(modules);
  
  // Watch form fields to calculate duration and filter options
  const watchCategory = form.watch("category");
  const watchPillar = form.watch("pillar");
  const watchProgramme = form.watch("programme");
  const watchStartDate = form.watch("start_date");
  const watchEndDate = form.watch("end_date");
  const watchStartTime = form.watch("start_time");
  const watchEndTime = form.watch("end_time");

  // Calculate duration when dates and times change
  useEffect(() => {
    if (watchStartDate && watchEndDate && watchStartTime && watchEndTime) {
      const startDateTime = new Date(`${watchStartDate}T${watchStartTime}`);
      const endDateTime = new Date(`${watchEndDate}T${watchEndTime}`);
      
      // Calculate duration in milliseconds
      const durationMs = endDateTime.getTime() - startDateTime.getTime();
      
      // Convert to hours
      const durationHours = durationMs / (1000 * 60 * 60);
      
      // Format the duration
      const formattedDuration = formatDuration(durationHours);
      setDuration(formattedDuration);
    } else {
      setDuration("");
    }
  }, [watchStartDate, watchEndDate, watchStartTime, watchEndTime]);

  // Filter pillars based on selected category
  useEffect(() => {
    if (watchCategory) {
      const filtered = pillars.filter(pillar => pillar.categoryId === watchCategory);
      setFilteredPillars(filtered);
      form.setValue("pillar", "");
      form.setValue("programme", "");
      form.setValue("module", "");
    } else {
      setFilteredPillars(pillars);
    }
  }, [watchCategory, form]);

  // Filter programmes based on selected pillar
  useEffect(() => {
    if (watchPillar) {
      const filtered = programmes.filter(programme => programme.pillarId === watchPillar);
      setFilteredProgrammes(filtered);
      form.setValue("programme", "");
      form.setValue("module", "");
    } else {
      setFilteredProgrammes(programmes);
    }
  }, [watchPillar, form]);

  // Filter modules based on selected programme
  useEffect(() => {
    if (watchProgramme) {
      const filtered = modules.filter(module => module.programmeId === watchProgramme);
      setFilteredModules(filtered);
      form.setValue("module", "");
    } else {
      setFilteredModules(modules);
    }
  }, [watchProgramme, form]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Calculate duration
      const startDateTime = new Date(`${data.start_date}T${data.start_time}`);
      const endDateTime = new Date(`${data.end_date}T${data.end_time}`);
      const durationHours = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
      
      // 1. Save the programme details to nd_event table
      const eventData = {
        program_name: data.title,
        description: data.description || "",
        location_event: data.location || "",
        start_datetime: new Date(`${data.start_date}T${data.start_time}`).toISOString(),
        end_datetime: new Date(`${data.end_date}T${data.end_time}`).toISOString(),
        duration: durationHours,
        trainer_name: data.trainer_name || "",
        created_by: user?.id,
        requester_id: user?.id,
        category_id: data.category,
        subcategory_id: data.pillar,
        program_id: data.programme,
        module_id: data.module,
        program_mode: data.mode === "Online" ? 1 : 2,  // Assuming 1=Online, 2=Physical
        target_participant: data.target_participant,
        total_participant: data.max_participants ? parseInt(data.max_participants) : null,
        status_id: data.is_active ? 1 : 2, // Assuming 1=Active, 2=Inactive
        is_group_event: data.is_group_event
      };

      const { data: eventResult, error: eventError } = await supabase
        .from("nd_event")
        .insert(eventData)
        .select();

      if (eventError) {
        throw eventError;
      }

      const eventId = eventResult?.[0]?.id;

      // 2. Handle file uploads if any files are present
      const fileInput = document.getElementById("files") as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        // Upload all files and track their paths
        const attachmentPromises = Array.from(fileInput.files).map(async (file) => {
          const filePath = await uploadFile(
            file,
            "utilities-attachment", // Using the bucket name from constants
            "program-attachments"
          );

          if (filePath) {
            // Save attachment reference in nd_event_attachment table
            return supabase.from("nd_event_attachment").insert({
              event_id: eventId,
              file_path: filePath,
              created_by: user?.id,
            });
          }
        });

        // Wait for all attachment uploads to complete
        await Promise.all(attachmentPromises);
      }

      toast({
        title: "Success",
        description: "Programme registered successfully",
        variant: "default",
      });

      // Redirect to programmes listing after successful submission
      navigate("/programmes");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to register programme. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
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
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category*</FormLabel>
                <FormControl>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    {...field}
                  >
                    <option value="">Select Category</option>
                    {eventCategories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="pillar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pillar (Sub-category)*</FormLabel>
                <FormControl>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    {...field}
                    disabled={!watchCategory}
                  >
                    <option value="">Select Pillar</option>
                    {filteredPillars.map(pillar => (
                      <option key={pillar.value} value={pillar.value}>
                        {pillar.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="programme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Programme*</FormLabel>
                <FormControl>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    {...field}
                    disabled={!watchPillar}
                  >
                    <option value="">Select Programme</option>
                    {filteredProgrammes.map(programme => (
                      <option key={programme.value} value={programme.value}>
                        {programme.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="module"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Module*</FormLabel>
                <FormControl>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    {...field}
                    disabled={!watchProgramme}
                  >
                    <option value="">Select Module</option>
                    {filteredModules.map(module => (
                      <option key={module.value} value={module.value}>
                        {module.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date*</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="start_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time*</FormLabel>
                  <FormControl>
                    <TimeInput 
                      id="start_time" 
                      value={field.value}
                      onChange={field.onChange}
                      disallowSameAsValue=""
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date*</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="end_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time*</FormLabel>
                  <FormControl>
                    <TimeInput 
                      id="end_time" 
                      value={field.value}
                      onChange={field.onChange}
                      disallowSameAsValue=""
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Duration (Calculated)
            </label>
            <div className="h-10 px-3 py-2 rounded-md border border-input bg-background text-sm text-gray-500 flex items-center">
              {duration || "Will be calculated"}
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="event_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Type*</FormLabel>
                <FormControl>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    {...field}
                  >
                    <option value="">Select Event Type</option>
                    {eventTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="is_group_event"
            render={({ field }) => (
              <FormItem className="flex flex-row items-end space-x-2 space-y-0 mt-8">
                <FormControl>
                  <Checkbox 
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">This is a group event</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="mode"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Mode*</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Physical" id="physical" />
                      <label htmlFor="physical" className="text-sm font-normal">Physical</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Online" id="online" />
                      <label htmlFor="online" className="text-sm font-normal">Online</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Programme location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="max_participants"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Participants</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Maximum number of participants"
                    min="1"
                    {...field} 
                  />
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
                <FormLabel>Target Participant*</FormLabel>
                <FormControl>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    {...field}
                  >
                    <option value="">Select Target Participant</option>
                    {targetParticipants.map(participant => (
                      <option key={participant.value} value={participant.value}>
                        {participant.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="trainer_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trainer/Organization Name</FormLabel>
              <FormControl>
                <Input placeholder="Trainer name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter programme description"
                  className="resize-none h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="files"
          render={({ field: { onChange, onBlur, name, ref } }) => (
            <FormItem>
              <FormLabel>Attachments</FormLabel>
              <FormControl>
                <Input
                  id="files"
                  type="file"
                  multiple
                  onChange={(e) => {
                    onChange(e.target.files);
                  }}
                  onBlur={onBlur}
                  name={name}
                  ref={ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
              <FormControl>
                <Checkbox 
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="font-normal">
                  This programme is active
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  Active programmes will be visible to users and can be registered for.
                </p>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="w-full md:w-auto"
          >
            {isSubmitting || isUploading ? "Submitting..." : "Register Programme"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RegisterProgrammeForm;
