
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Info, ArrowRight } from "lucide-react";
import { formatDate } from "@/utils/date-utils";
import { UserTypeChips } from "@/components/user-groups/UserTypeChips";
import { AttachmentFile } from "./AnnouncementAttachment";
import { AnnouncementViewModal } from "./AnnouncementViewModal";
import { Link } from 'react-router-dom';

interface Announcement {
  id: string;
  title: string;
  message: string;
  status: "active" | "inactive";
  user_types: string[];
  created_at: string;
  start_date: string;
  end_date: string;
  attachments: AttachmentFile[] | null;
}

interface DashboardAnnouncementListProps {
  announcements: Announcement[];
  loading: boolean;
}

export const DashboardAnnouncementList: React.FC<DashboardAnnouncementListProps> = ({
  announcements,
  loading
}) => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const viewAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="py-4 text-center text-muted-foreground">
        Loading announcements...
      </div>
    );
  }

  if (announcements.length === 0) {
    return null;
  }

  const isAnnouncementExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          Announcements
        </h2>
        
        <Button variant="outline" size="sm" asChild>
          <Link to="/announcements/list">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {announcements.slice(0, 3).map((announcement) => (
        <Alert
          key={announcement.id}
          className="bg-primary/5 border-primary/20 cursor-pointer hover:bg-primary/10 transition-colors"
          onClick={() => viewAnnouncement(announcement)}
        >
          <div className="flex justify-between items-start">
            <AlertTitle className="text-base font-medium">
              {announcement.title}
            </AlertTitle>
            <div className="flex gap-2">
              {announcement.user_types && announcement.user_types.length > 0 && (
                <UserTypeChips userTypes={announcement.user_types} />
              )}
              {announcement.end_date && isAnnouncementExpired(announcement.end_date) && (
                <Badge
                  variant="outline"
                  className="bg-amber-100 text-amber-800 border-amber-200"
                >
                  Expired
                </Badge>
              )}
              {announcement.attachments && announcement.attachments.length > 0 && (
                <Badge
                  variant="outline"
                  className="bg-blue-100 text-blue-800 border-blue-200"
                >
                  {announcement.attachments.length} {announcement.attachments.length === 1 ? 'Attachment' : 'Attachments'}
                </Badge>
              )}
            </div>
          </div>
          <AlertDescription className="mt-2 line-clamp-2">
            {announcement.message}
          </AlertDescription>
        </Alert>
      ))}
      
      <AnnouncementViewModal 
        announcement={selectedAnnouncement} 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
      />
    </div>
  );
};
