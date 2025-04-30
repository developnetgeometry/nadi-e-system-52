
import React, { useState } from "react";
import { Code, Copy, Check, BookOpen, Bell, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CodeSnippet } from "@/components/ui-showcase/CodeSnippet";
import { NotificationType } from "@/types/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const NotificationUsageGuide = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("in-app");
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied({ ...copied, [id]: true });
    setTimeout(() => {
      setCopied({ ...copied, [id]: false });
    }, 2000);
  };

  const runNotificationDemo = async (type: "in-app" | "email" | "push") => {
    try {
      // Get current user for demo
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      
      if (!userId) {
        toast({
          title: "Error",
          description: "You need to be logged in to run this demo",
          variant: "destructive",
        });
        return;
      }
      
      // Get a template for demo
      const { data: templates } = await supabase
        .from("notification_templates")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);
      
      const templateId = templates?.[0]?.id;
      
      if (!templateId) {
        toast({
          title: "No templates found",
          description: "Please create a notification template first",
          variant: "destructive",
        });
        return;
      }

      let response;
      
      switch (type) {
        case "in-app":
          // Demo for in-app notification using template
          response = await supabase.rpc("create_notification_from_template", {
            p_template_id: templateId,
            p_user_id: userId,
            p_params: { name: "Demo User", service_name: "Notification Demo" }
          });
          break;
        
        case "email":
          // Call the email edge function
          response = await supabase.functions.invoke("send-test-email", {
            body: {
              email: userData.user.email,
              subject: "Template Demo Email",
              message: "This is a demonstration of using templates with email notifications.",
              template_id: templateId,
              params: { name: "Demo User", service_name: "Email Notification Demo" }
            }
          });
          break;
          
        case "push":
          // Call the push notification edge function
          response = await supabase.functions.invoke("send-test-push", {
            body: {
              userId: userId,
              title: "Push Notification Demo",
              body: "This is a demonstration of using templates with push notifications.",
              template_id: templateId,
              params: { name: "Demo User", service_name: "Push Notification Demo" }
            }
          });
          break;
      }

      if (response.error) throw response.error;
      
      toast({
        title: "Demo notification sent",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} notification was sent successfully`,
      });
    } catch (error) {
      console.error(`Error in ${type} notification demo:`, error);
      toast({
        title: "Error",
        description: `Failed to send ${type} notification: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const inAppCode = `
// Import the Supabase client
import { supabase } from "@/integrations/supabase/client";

// Function to send an in-app notification using a template
async function sendInAppNotification(userId, templateId, params) {
  try {
    const { data, error } = await supabase.rpc("create_notification_from_template", {
      p_template_id: templateId,
      p_user_id: userId,
      p_params: params
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error sending in-app notification:", error);
    throw error;
  }
}

// Example usage
sendInAppNotification(
  "user-uuid-here",
  "template-uuid-here",
  { 
    name: "User Name",
    service_name: "Your App Name"
  }
);
`;

  const emailCode = `
// Import the Supabase client
import { supabase } from "@/integrations/supabase/client";

// Function to send an email notification using a template
async function sendEmailNotification(email, subject, message, templateId, params) {
  try {
    const { data, error } = await supabase.functions.invoke("send-test-email", {
      body: {
        email,
        subject,
        message,
        template_id: templateId,
        params
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error sending email notification:", error);
    throw error;
  }
}

// Example usage
sendEmailNotification(
  "user@example.com",
  "Welcome to Our App",
  "Thank you for joining our platform!",
  "template-uuid-here",
  { 
    name: "User Name",
    service_name: "Your App Name"
  }
);
`;

  const pushCode = `
// Import the Supabase client
import { supabase } from "@/integrations/supabase/client";

// Function to send a push notification using a template
async function sendPushNotification(userId, title, body, templateId, params) {
  try {
    const { data, error } = await supabase.functions.invoke("send-test-push", {
      body: {
        userId,
        title,
        body,
        template_id: templateId,
        params
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error sending push notification:", error);
    throw error;
  }
}

// Example usage
sendPushNotification(
  "user-uuid-here",
  "New Feature Available",
  "Check out our latest update!",
  "template-uuid-here",
  { 
    name: "User Name",
    service_name: "Your App Name"
  }
);
`;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Notification Usage Guide</CardTitle>
        <CardDescription>
          Learn how to send notifications using templates across different channels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6 bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800">
          <BookOpen className="h-4 w-4" />
          <AlertTitle>About Notification Templates</AlertTitle>
          <AlertDescription>
            Notification templates allow you to create reusable notification content with placeholders 
            for dynamic data. Templates can be used across different notification channels for consistent 
            messaging.
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="in-app" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>In-App</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </TabsTrigger>
            <TabsTrigger value="push" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>Push</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="in-app" className="space-y-4">
            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-lg font-semibold">Sending In-App Notifications</h3>
              <p>
                In-app notifications appear within your application interface and are stored in the 
                database. They can be accessed through the notification center in your app.
              </p>
              
              <h4 className="text-md font-semibold mt-4">Implementation Steps:</h4>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Create a notification template with title and message placeholders</li>
                <li>Use the <code>create_notification_from_template</code> database function</li>
                <li>Pass the template ID, user ID, and parameter values</li>
                <li>The notification will appear in the user's notification center</li>
              </ol>
            </div>
            
            <div className="mt-6">
              <h4 className="text-md font-semibold mb-2">Code Example:</h4>
              <div className="relative">
                <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-x-auto text-sm">
                  <code>{inAppCode}</code>
                </pre>
                <Button 
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(inAppCode, "in-app")}
                >
                  {copied["in-app"] ? (
                    <>
                      <Check className="h-4 w-4 mr-1" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" /> Copy Code
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="mt-6">
              <Button 
                onClick={() => runNotificationDemo("in-app")}
                className="w-full sm:w-auto"
              >
                <Bell className="h-4 w-4 mr-2" />
                Send Test In-App Notification
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="email" className="space-y-4">
            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-lg font-semibold">Sending Email Notifications</h3>
              <p>
                Email notifications are sent directly to the user's email address. They can be 
                used for important notifications that require immediate attention.
              </p>
              
              <h4 className="text-md font-semibold mt-4">Implementation Steps:</h4>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Create a notification template with email-appropriate content</li>
                <li>Call the <code>send-test-email</code> edge function</li>
                <li>Pass the email address, subject, message, template ID, and parameters</li>
                <li>The email will be sent to the user's email address</li>
              </ol>
            </div>
            
            <div className="mt-6">
              <h4 className="text-md font-semibold mb-2">Code Example:</h4>
              <div className="relative">
                <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-x-auto text-sm">
                  <code>{emailCode}</code>
                </pre>
                <Button 
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(emailCode, "email")}
                >
                  {copied["email"] ? (
                    <>
                      <Check className="h-4 w-4 mr-1" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" /> Copy Code
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="mt-6">
              <Button 
                onClick={() => runNotificationDemo("email")}
                className="w-full sm:w-auto"
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Test Email Notification
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="push" className="space-y-4">
            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-lg font-semibold">Sending Push Notifications</h3>
              <p>
                Push notifications are sent to the user's device even when they're not actively 
                using your application. They're useful for time-sensitive information.
              </p>
              
              <h4 className="text-md font-semibold mt-4">Implementation Steps:</h4>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Set up device token registration for your users</li>
                <li>Create a notification template for push notifications</li>
                <li>Call the <code>send-test-push</code> edge function</li>
                <li>Pass the user ID, title, body, template ID, and parameters</li>
                <li>The notification will be delivered to the user's registered devices</li>
              </ol>
            </div>
            
            <div className="mt-6">
              <h4 className="text-md font-semibold mb-2">Code Example:</h4>
              <div className="relative">
                <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-x-auto text-sm">
                  <code>{pushCode}</code>
                </pre>
                <Button 
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(pushCode, "push")}
                >
                  {copied["push"] ? (
                    <>
                      <Check className="h-4 w-4 mr-1" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" /> Copy Code
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="mt-6">
              <Button 
                onClick={() => runNotificationDemo("push")}
                className="w-full sm:w-auto"
              >
                <Phone className="h-4 w-4 mr-2" />
                Send Test Push Notification
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col items-start border-t pt-6">
        <h4 className="font-semibold mb-4">Important Notes</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Templates should be created and managed in the Templates tab</li>
          <li>• Use consistent placeholders across different notification channels</li>
          <li>• For production use, implement proper error handling and retry logic</li>
          <li>• Monitor notification delivery rates and user engagement</li>
        </ul>
      </CardFooter>
    </Card>
  );
};
