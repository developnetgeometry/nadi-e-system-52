
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface Announcement {
  id: string;
  title: string;
  message: string;
  created_at: string;
}

export function AnnouncementList() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const { toast } = useToast();

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

  if (announcements.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No announcements available
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {announcements.map((announcement) => (
        <Card key={announcement.id}>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">{announcement.title}</h3>
            <p className="text-muted-foreground">{announcement.message}</p>
            <div className="text-sm text-muted-foreground mt-2">
              {new Date(announcement.created_at).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
