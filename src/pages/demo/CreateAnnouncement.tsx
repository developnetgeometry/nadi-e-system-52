
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { SelectMany } from "@/components/ui/SelectMany";
import { useUserTypes } from "@/components/user-groups/hooks/useUserTypes";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";

interface AnnouncementFormData {
  title: string;
  message: string;
  user_types: string[];
}

export default function CreateAnnouncement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<AnnouncementFormData>();
  const { userTypes } = useUserTypes();

  const userTypeOptions = userTypes.map(type => ({
    id: type,
    label: type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }));

  const onSubmit = async (data: AnnouncementFormData) => {
    const { error } = await supabase
      .from('announcements')
      .insert({
        title: data.title,
        message: data.message,
        user_types: data.user_types,
        status: 'active'
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create announcement",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Announcement created successfully",
    });
    
    navigate("/demo/announcements");
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create New Announcement</h1>
        </div>

        <div className="max-w-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Announcement title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter your announcement message" 
                        className="min-h-[150px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="user_types"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target User Types</FormLabel>
                    <FormControl>
                      <SelectMany
                        options={userTypeOptions}
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder="Select user types that can view this announcement"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button type="submit">Create Announcement</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/demo/announcements")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </DashboardLayout>
  );
}
