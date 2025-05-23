
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
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

// Form validation schema
const formSchema = z.object({
  title: z.string().min(1, { message: "Programme name is required" }),
  description: z.string().optional(),
  location: z.string().optional(),
  start_date: z.string().min(1, { message: "Start date is required" }),
  end_date: z.string().min(1, { message: "End date is required" }),
  trainer_name: z.string().optional(),
  files: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const RegisterProgrammeForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isUploading, uploadFile } = useFileUpload();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // 1. Save the programme details to nd_event table
      const eventData = {
        program_name: data.title,
        description: data.description || "",
        location_event: data.location || "",
        start_datetime: new Date(data.start_date).toISOString(),
        end_datetime: new Date(data.end_date).toISOString(),
        trainer_name: data.trainer_name || "",
        created_by: user?.id,
        requester_id: user?.id,
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter programme description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <FormField
            control={form.control}
            name="trainer_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trainer</FormLabel>
                <FormControl>
                  <Input placeholder="Trainer name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date*</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date*</FormLabel>
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
