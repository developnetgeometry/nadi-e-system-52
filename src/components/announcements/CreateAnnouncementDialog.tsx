
// Import correct types for attachments
import { AttachmentFile } from "./AnnouncementAttachment";
import { Json } from "@/types/supabase";

// Inside the component where attachments are being uploaded:
// Convert attachment files to JSON before storing in the database
const finalAttachments = uploadedFiles?.map(file => ({
  name: file.name,
  path: file.path,
  size: file.size,
  type: file.type
})) || [];

// When inserting into the database:
const { error: insertError } = await supabase
  .from("announcements")
  .insert({
    title: formData.get("title") as string,
    message: formData.get("message") as string,
    status: formData.get("status") as "active" | "inactive",
    user_types: targetUsers || [],
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") as string,
    attachments: finalAttachments as unknown as Json,
    created_by: user?.id
  });
