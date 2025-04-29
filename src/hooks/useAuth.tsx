
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useAppSettings } from "@/hooks/use-app-settings";
import { useSessionTracking } from "@/hooks/use-session-tracking";
import { useSessionTimeout } from "@/hooks/use-session-timeout";

export const useAuth = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { settings } = useAppSettings();

  // Get session configuration from settings
  const sessionTimeout = settings.find(s => s.key === 'session_timeout')?.value || '3600'; // Default 1 hour in seconds
  const sessionInactivityTimeout = settings.find(s => s.key === 'session_inactivity_timeout')?.value || '1800'; // Default 30 minutes
  const enableInactivityTracking = settings.find(s => s.key === 'enable_inactivity_tracking')?.value === 'true';

  // Modified logout function that accepts an event parameter to handle click events
  const logout = async () => {
    try {
      console.log("Logging out user...");
      
      // End session tracking before logout
      await endSessionTracking();
      
      // Get the user type before logging out
      let finalRedirectPath = "/login"; // Default redirect path
      
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();
          
        // If user is a member, redirect to member login
        if (profileData && profileData.user_type === 'member') {
          finalRedirectPath = "/member-login";
        }
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear all session data
      localStorage.clear();
      setUser(null);
      
      console.log(`User logged out successfully, ready to redirect to ${finalRedirectPath}`);
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });

      // Return the path we determined for redirection
      return finalRedirectPath;
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
      return "/login"; // Default fallback
    }
  };

  // Initialize session tracking hooks
  const {
    currentSessionId,
    startSessionTracking,
    endSessionTracking,
    logInactivityEvent,
    logSessionRefreshEvent
  } = useSessionTracking(user);

  // Initialize session timeout hooks with the updated logout function
  useSessionTimeout(
    user,
    async () => {
      const path = await logout();
      return path;
    },
    logInactivityEvent,
    sessionInactivityTimeout,
    enableInactivityTracking,
    logSessionRefreshEvent,
    sessionTimeout
  );

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        startSessionTracking(currentUser.id);
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      // Handle session start/end based on auth state
      if (currentUser && !user) {
        startSessionTracking(currentUser.id);
      } else if (!currentUser && user) {
        await endSessionTracking();
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      // End session when component unmounts
      if (currentSessionId) {
        endSessionTracking();
      }
    };
  }, []);

  return {
    user,
    loading,
    logout,
  };
};
