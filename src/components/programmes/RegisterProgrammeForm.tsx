
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

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
import { useFileUpload } from "@/hooks/use-file-upload";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const formSchema = z.object({
  title: z.string().min(1, "Programme name is required"),
  description: z.string().optional(),
  location: z.string().optional(),
  start_datetime: z.string().min(1, "Start date is required"),
  end_datetime: z.string().min(1, "End date is required"),
  trainer_name: z.string().optional(),
  target_participant: z.string().optional(),
  program_mode: z.string().optional(),
  program_method: z.string().optional(),
  duration: z.string().optional(),
  total_participant: z.string().optional().transform(val => val ? parseInt(val) : undefined),
});

type FormValues = z.infer<typeof formSchema>;

const RegisterProgrammeForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { uploadFile, isUploading } = useFileUpload();
  
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      start_datetime: "",
      end_datetime: "",
      trainer_name: "",
      target_participant: "",
      program_mode: "",
      program_method: "",
      duration: "",
      total_participant: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to register a programme",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Convert date strings to proper Date objects
      const startDate = new Date(values.start_datetime);
      const endDate = new Date(values.end_datetime);

      if (startDate > endDate) {
        toast({
          title: "Validation Error",
          description: "End date cannot be before start date",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Insert into nd_event table
      const { data: eventData, error: eventError } = await supabase
        .from("nd_event")
        .insert({
          title: values.title,
          description: values.description,
          location_event: values.location,
          start_datetime: values.start_datetime,
          end_datetime: values.end_datetime,
          trainer_name: values.trainer_name,
          target_participant: values.target_participant,
          program_mode: values.program_mode,
          program_method: values.program_method,
          duration: values.duration || "0",
          total_participant: values.total_participant || 0,
          created_by: user.id,
        })
        .select("id")
        .single();

      if (eventError) {
        console.error("Error creating event:", eventError);
        toast({
          title: "Error",
          description: "Failed to register programme. Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Handle file uploads if there are any
      if (files.length > 0) {
        const programmeId = eventData.id;

        // Upload each file and save reference in nd_event_attachment
        for (const file of files) {
          // Upload file to storage
          const fileUrl = await uploadFile(
            file,
            "programme-attachments",
            `programme_${programmeId}`
          );

          if (fileUrl) {
            // Save attachment reference in nd_event_attachment
            const { error: attachmentError } = await supabase
              .from("nd_event_attachment")
              .insert({
                event_id: programmeId,
                file_path: fileUrl,
                created_by: user.id,
              });

            if (attachmentError) {
              console.error("Error saving attachment reference:", attachmentError);
            }
          }
        }
      }

      // Show success message and redirect
      toast({
        title: "Success",
        description: "Programme registered successfully",
      });

      // Redirect back to programmes page
      navigate("/programmes");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
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
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="start_datetime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date & Time*</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
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
                  <FormLabel>End Date & Time*</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
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

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="trainer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trainer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter trainer name" {...field} />
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
                  <FormLabel>Target Participant</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter target participant" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="program_mode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Programme Mode</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select programme mode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="Physical">Physical</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="program_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Programme Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select programme method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Workshop">Workshop</SelectItem>
                      <SelectItem value="Seminar">Seminar</SelectItem>
                      <SelectItem value="Course">Course</SelectItem>
                      <SelectItem value="Training">Training</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (hours)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="0.5" {...field} />
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
                  <FormLabel>Maximum Participants</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div>
              <FormLabel>Attachments</FormLabel>
              <div className="mt-1">
                <Input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
              </div>
            </div>

            {files.length > 0 && (
              <div className="border rounded-md p-4">
                <h4 className="text-sm font-medium mb-2">Selected Files:</h4>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center justify-between text-sm">
                      <span className="truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[150px]"
            >
              {isSubmitting ? "Registering..." : "Register Programme"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegisterProgrammeForm;
