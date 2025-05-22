
import * as z from "zod";

// Form schema with validations
export const formSchema = z.object({
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

export type FormValues = z.infer<typeof formSchema>;
