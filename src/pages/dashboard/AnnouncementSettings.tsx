
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function AnnouncementSettings() {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your announcement settings have been updated successfully.",
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Announcement Settings</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure how announcements are displayed and managed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Announcements</Label>
                  <div className="text-sm text-muted-foreground">
                    Turn on/off the announcement system
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="space-y-2">
                <Label>Default Announcement Duration (days)</Label>
                <Input type="number" defaultValue={7} />
              </div>

              <div className="space-y-2">
                <Label>Maximum Active Announcements</Label>
                <Input type="number" defaultValue={5} />
              </div>

              <Button onClick={handleSave}>Save Settings</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
