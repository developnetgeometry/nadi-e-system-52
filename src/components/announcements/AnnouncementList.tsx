
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Announcement {
  id: string;
  title: string;
  message: string;
  created_at: string;
}

export function AnnouncementList() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch announcements",
          variant: "destructive",
        });
        return;
      }

      setAnnouncements(data);
    };

    fetchAnnouncements();
  }, [toast]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Announcements</h2>
        <Button onClick={() => navigate("/demo/announcements/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Announcement
        </Button>
      </div>
      
      <div className="grid gap-4">
        {announcements.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No announcements available
          </div>
        ) : (
          announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{announcement.title}</h3>
                <p className="text-muted-foreground">{announcement.message}</p>
                <div className="text-sm text-muted-foreground mt-2">
                  {new Date(announcement.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
