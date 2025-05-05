
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfilePictureUploadDialog from "../../components/MemberPictureUploadDialog";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// Define the props
interface MemberProfilePictureProps {
  avatarUrl?: string;
  memberId: string;
  onAvatarChange?: (url: string) => void;
}

const MemberProfilePicture: React.FC<MemberProfilePictureProps> = ({ 
  avatarUrl, 
  memberId,
  onAvatarChange
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [avatar, setAvatar] = useState<string | undefined>(avatarUrl);
  const { user } = useAuth();
  const userId = user?.id || '';
  
  const handleFilesSelected = async (files: File[]) => {
    if (files.length > 0) {
      try {
        // Update profile picture logic here
        const file = files[0];
        const fileName = `profile-${memberId}-${Date.now()}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('avatars')
          .upload(fileName, file, {
            upsert: true,
          });

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data: urlData } = await supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        if (urlData?.publicUrl) {
          setAvatar(urlData.publicUrl);
          // Update member profile with new avatar URL
          const { error: updateError } = await supabase
            .from('member_profiles')
            .update({ avatar_url: urlData.publicUrl })
            .eq('id', memberId);

          if (updateError) throw updateError;

          if (onAvatarChange) {
            onAvatarChange(urlData.publicUrl);
          }

          toast.success("Profile picture updated successfully");
          setIsDialogOpen(false);
        }
      } catch (error) {
        console.error("Error updating profile picture:", error);
        toast.error("Failed to update profile picture");
      }
    }
  };

  const handleAvatarClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <Avatar className="w-24 h-24 border cursor-pointer" onClick={handleAvatarClick}>
        <AvatarImage src={avatar} alt="Profile" />
        <AvatarFallback className="text-2xl">
          {/* Extract first letter from user name/email for fallback */}
          {user?.email?.charAt(0).toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
      
      <button 
        type="button"
        onClick={handleAvatarClick}
        className="text-sm text-blue-600 hover:text-blue-800"
      >
        Change Picture
      </button>

      <ProfilePictureUploadDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onFilesSelected={handleFilesSelected}
        memberId={memberId}
        userId={userId}
      />
    </div>
  );
};

export default MemberProfilePicture;
