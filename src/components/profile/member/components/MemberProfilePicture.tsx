
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/ui/icons";
import { ProfilePictureUploadDialog } from "./ProfilePictureUploadDialog";

interface MemberProfilePictureProps {
  memberId: string;
  userId: string;
  profilePictureUrl?: string;
  onProfilePictureChange?: (url: string) => void;
}

export function MemberProfilePicture({
  memberId,
  userId,
  profilePictureUrl,
  onProfilePictureChange
}: MemberProfilePictureProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPictureUrl, setCurrentPictureUrl] = useState(profilePictureUrl);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      // In a real implementation, this would upload to your backend or storage service
      // For now, we'll simulate it with a timeout and use a local URL
      const file = files[0];
      const url = URL.createObjectURL(file);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentPictureUrl(url);
      if (onProfilePictureChange) {
        onProfilePictureChange(url);
      }
      
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 flex flex-col items-center">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4 relative">
          {currentPictureUrl ? (
            <img
              src={currentPictureUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icons.user className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => setIsDialogOpen(true)}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Icons.upload className="mr-2 h-4 w-4" />
              Change Picture
            </>
          )}
        </Button>
        
        <ProfilePictureUploadDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onFilesSelected={handleFilesSelected}
          memberId={memberId}
          userId={userId}
        />
      </CardContent>
    </Card>
  );
}
