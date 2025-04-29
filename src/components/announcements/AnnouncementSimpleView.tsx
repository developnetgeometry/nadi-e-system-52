
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  message: string;
  status: 'active' | 'inactive';
  created_at: string;
  start_date: string;
  end_date: string;
}

export function AnnouncementSimpleView() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        
        // Fetch active announcements that are valid for current date
        const { data, error } = await supabase
          .from('announcements')
          .select('id, title, message, status, created_at, start_date, end_date')
          .eq('status', 'active')
          .lte('start_date', new Date().toISOString())
          .or(`end_date.gt.${new Date().toISOString()},end_date.is.null`)
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (error) {
          console.error("Error fetching announcements:", error);
          return;
        }
        
        setAnnouncements(data || []);
      } catch (error) {
        console.error("Error in announcements fetch:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnnouncements();
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (announcements.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <Card key={announcement.id} className="overflow-hidden border border-primary/20">
          <CardHeader className="bg-primary/5 pb-2">
            <CardTitle className="text-lg">{announcement.title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-gray-700 dark:text-gray-300">{announcement.message}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
