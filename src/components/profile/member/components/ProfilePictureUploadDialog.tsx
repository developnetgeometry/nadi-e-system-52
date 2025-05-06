
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/ui/icons";

export interface ProfilePictureUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFilesSelected: (files: File[]) => void;
  memberId: string;
  userId: string;
}

export function ProfilePictureUploadDialog({
  open,
  onOpenChange,
  onFilesSelected,
  memberId,
  userId
}: ProfilePictureUploadDialogProps) {
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => file.type.startsWith('image/'));

    if (validFiles.length !== fileArray.length) {
      toast({
        title: "Invalid file type",
        description: "Only image files are allowed",
        variant: "destructive"
      });
      return;
    }

    onFilesSelected(validFiles);
    onOpenChange(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Profile Picture</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button 
            onClick={triggerFileInput}
            className="flex items-center justify-center gap-2"
          >
            <Icons.upload className="h-4 w-4" />
            Select Image
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Supported formats: JPG, PNG, GIF. Max size: 5MB.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
