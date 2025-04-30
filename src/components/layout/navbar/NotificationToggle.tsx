
import { Bell, CheckCircle, Mail, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationList } from "@/components/notifications/NotificationList";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export const NotificationToggle = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Fetch initial unread count
    const fetchUnreadCount = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      
      if (!userId) return;

      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", userId)
        .eq("read", false);
        
      if (error) {
        console.error("Error fetching unread notifications:", error);
        return;
      }
      
      setUnreadCount(count || 0);
    };

    fetchUnreadCount();

    // Subscribe to real-time notifications
    const setupRealtimeSubscription = async () => {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;
      
      if (!userId) return;

      const channel = supabase
        .channel('notification_changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`
          },
          () => {
            setUnreadCount(prevCount => prevCount + 1);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId} AND read=eq.true`
          },
          () => {
            setUnreadCount(prevCount => Math.max(0, prevCount - 1));
          }
        )
        .subscribe();

      return channel;
    };

    const channel = setupRealtimeSubscription();
    
    // Cleanup subscription on unmount
    return () => {
      channel.then(channel => {
        if (channel) supabase.removeChannel(channel);
      });
    };
  }, []);

  const handleMarkAllAsRead = async () => {
    // Implementation would go here
    console.log("Mark all as read");
    setUnreadCount(0);
  };

  const demoNotifications = [
    {
      id: '1', 
      title: 'New user registered',
      icon: <Mail className="h-6 w-6" />,
      time: '2 min ago',
      read: false
    },
    {
      id: '2', 
      title: 'Server update completed',
      icon: <Server className="h-6 w-6" />,
      time: '1 hour ago',
      read: false
    },
    {
      id: '3', 
      title: 'Server down',
      icon: <Server className="h-6 w-6" />,
      time: '3 hours ago',
      read: false
    },
    {
      id: '4', 
      title: 'System maintenance',
      icon: <CheckCircle className="h-6 w-6" />,
      time: 'Yesterday',
      read: true
    }
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-100 relative dark:text-gray-200 dark:hover:bg-gray-800">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications ({unreadCount} unread)</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        align="end" 
        className="w-[380px] p-0 rounded-md overflow-hidden"
        sideOffset={20}
      >
        <div className="bg-white dark:bg-gray-900 shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              className="text-sm font-medium text-primary"
            >
              Mark all as read
            </Button>
          </div>
          
          {/* Demo notifications list */}
          <div className="max-h-[400px] overflow-y-auto">
            {demoNotifications.map((notification) => (
              <div 
                key={notification.id}
                className={cn(
                  "flex items-start p-4 border-b hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer",
                  notification.read ? "opacity-70" : ""
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full mr-3",
                  "bg-purple-100 dark:bg-purple-900/20"
                )}>
                  {notification.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm",
                    !notification.read && "font-medium"
                  )}>
                    {notification.title}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {notification.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 text-center border-t">
            <Button 
              variant="ghost" 
              className="w-full text-primary"
              onClick={() => setOpen(false)}
              asChild
            >
              <a href="/dashboard/notifications">View all notifications</a>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
