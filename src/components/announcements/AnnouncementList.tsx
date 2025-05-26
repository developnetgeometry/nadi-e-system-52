
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AttachmentFile {
  name: string;
  url: string;
  size?: number;
  type?: string;
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  status: "active" | "inactive";
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  user_types: string[];
  attachments: AttachmentFile[];
}

export function AnnouncementList() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform the data to match our interface
      const transformedData = data?.map(item => ({
        ...item,
        attachments: Array.isArray(item.attachments) ? item.attachments : []
      })) || [];

      setAnnouncements(transformedData);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast({
        title: "Error",
        description: "Failed to fetch announcements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      try {
        const { error } = await supabase
          .from("announcements")
          .delete()
          .eq("id", id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Announcement deleted successfully",
        });
        
        fetchAnnouncements();
      } catch (error) {
        console.error("Error deleting announcement:", error);
        toast({
          title: "Error",
          description: "Failed to delete announcement",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return <div>Loading announcements...</div>;
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <Card key={announcement.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{announcement.title}</CardTitle>
              <div className="flex gap-2">
                <Badge variant={announcement.status === "active" ? "default" : "secondary"}>
                  {announcement.status}
                </Badge>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(announcement.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">{announcement.message}</p>
            <div className="text-xs text-gray-500">
              <p>Start: {new Date(announcement.start_date).toLocaleDateString()}</p>
              <p>End: {new Date(announcement.end_date).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
