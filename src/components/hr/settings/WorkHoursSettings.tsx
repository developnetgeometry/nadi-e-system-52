
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Clock, Edit, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface WorkHoursSettingsProps {
  siteId: string;
}

const formSchema = z.object({
  dayOfWeek: z.string().min(1, "Day is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface WorkHourConfig {
  id: string;
  site_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

const DAYS_OF_WEEK = [
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
];

export function WorkHoursSettings({ siteId }: WorkHoursSettingsProps) {
  const [loading, setLoading] = useState(true);
  const [workHours, setWorkHours] = useState<WorkHourConfig[]>([]);
  const [editDialog, setEditDialog] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dayOfWeek: "",
      startTime: "09:00",
      endTime: "17:00",
      isActive: true,
    },
  });

  useEffect(() => {
    async function fetchWorkHours() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("nd_work_hour_config")
          .select("*")
          .eq("site_id", siteId)
          .order("day_of_week");

        if (error) throw error;
        setWorkHours(data || []);
      } catch (error) {
        console.error("Error fetching work hours:", error);
        toast.error("Failed to load work hours");
      } finally {
        setLoading(false);
      }
    }

    if (siteId) {
      fetchWorkHours();
    }
  }, [siteId]);

  const handleSetupDefault = async () => {
    try {
      // First check if we already have any configurations
      if (workHours.length > 0) {
        const confirm = window.confirm(
          "This will overwrite any existing work hour configurations. Continue?"
        );
        if (!confirm) return;
        
        // Delete existing configurations
        const { error: deleteError } = await supabase
          .from("nd_work_hour_config")
          .delete()
          .eq("site_id", siteId);
          
        if (deleteError) throw deleteError;
      }
      
      // Set up default work hours (Mon-Fri 9AM-5PM)
      const defaultHours = DAYS_OF_WEEK.map(day => ({
        site_id: siteId,
        day_of_week: day,
        start_time: day === "saturday" || day === "sunday" ? null : "09:00",
        end_time: day === "saturday" || day === "sunday" ? null : "17:00",
        is_active: !(day === "saturday" || day === "sunday"),
        created_by: (await supabase.auth.getUser()).data.user?.id,
      }));
      
      const { error } = await supabase
        .from("nd_work_hour_config")
        .insert(defaultHours);
        
      if (error) throw error;
      
      // Refresh the work hours list
      const { data, error: fetchError } = await supabase
        .from("nd_work_hour_config")
        .select("*")
        .eq("site_id", siteId)
        .order("day_of_week");
      
      if (fetchError) throw fetchError;
      setWorkHours(data || []);
      
      toast.success("Default work hours set up successfully");
    } catch (error) {
      console.error("Error setting up default work hours:", error);
      toast.error("Failed to set up default work hours");
    }
  };

  const handleEdit = (config: WorkHourConfig) => {
    setEditId(config.id);
    form.reset({
      dayOfWeek: config.day_of_week,
      startTime: config.start_time,
      endTime: config.end_time,
      isActive: config.is_active,
    });
    setEditDialog(true);
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("nd_work_hour_config")
        .update({
          is_active: !currentStatus,
          updated_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq("id", id);

      if (error) throw error;
      
      // Update local state
      setWorkHours(workHours.map(item => 
        item.id === id ? { ...item, is_active: !currentStatus } : item
      ));
      
      toast.success(`${currentStatus ? "Disabled" : "Enabled"} work hours successfully`);
    } catch (error) {
      console.error("Error toggling work hour status:", error);
      toast.error("Failed to update work hour status");
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const { dayOfWeek, startTime, endTime, isActive } = values;
      
      // Validate time format
      if (!startTime.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
        form.setError("startTime", { 
          type: "manual", 
          message: "Invalid time format. Use HH:MM (24-hour format)" 
        });
        return;
      }
      
      if (!endTime.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
        form.setError("endTime", { 
          type: "manual", 
          message: "Invalid time format. Use HH:MM (24-hour format)" 
        });
        return;
      }

      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;

      if (editId) {
        // Update existing work hours
        const { error } = await supabase
          .from("nd_work_hour_config")
          .update({
            day_of_week: dayOfWeek,
            start_time: startTime,
            end_time: endTime,
            is_active: isActive,
            updated_by: userId,
          })
          .eq("id", editId);

        if (error) throw error;
        toast.success("Work hours updated successfully");
      } else {
        // Check if this day already has a configuration
        const existingConfig = workHours.find(config => config.day_of_week === dayOfWeek);
        
        if (existingConfig) {
          const { error } = await supabase
            .from("nd_work_hour_config")
            .update({
              start_time: startTime,
              end_time: endTime,
              is_active: isActive,
              updated_by: userId,
            })
            .eq("id", existingConfig.id);
  
          if (error) throw error;
          toast.success("Work hours updated successfully");
        } else {
          // Create new work hour config
          const { error } = await supabase
            .from("nd_work_hour_config")
            .insert({
              site_id: siteId,
              day_of_week: dayOfWeek,
              start_time: startTime,
              end_time: endTime,
              is_active: isActive,
              created_by: userId,
            });
  
          if (error) throw error;
          toast.success("Work hours added successfully");
        }
      }

      // Reset form and close dialog
      form.reset({
        dayOfWeek: "",
        startTime: "09:00",
        endTime: "17:00",
        isActive: true,
      });
      setEditId(null);
      setEditDialog(false);
      
      // Refresh the work hours list
      const { data, error } = await supabase
        .from("nd_work_hour_config")
        .select("*")
        .eq("site_id", siteId)
        .order("day_of_week");
      
      if (error) throw error;
      setWorkHours(data || []);

    } catch (error) {
      console.error("Error saving work hours:", error);
      toast.error("Failed to save work hours");
    }
  };

  const formatDayName = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Work Hours Configuration</CardTitle>
            <CardDescription>
              Set daily work hours for this site
            </CardDescription>
          </div>
          <Button onClick={handleSetupDefault}>
            Set Default Hours
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Open Time</TableHead>
                  <TableHead>Close Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DAYS_OF_WEEK.map((day) => {
                  const config = workHours.find(config => config.day_of_week === day);
                  return (
                    <TableRow key={day}>
                      <TableCell className="font-medium">{formatDayName(day)}</TableCell>
                      <TableCell>
                        {config?.is_active 
                          ? config.start_time || "Closed" 
                          : "Closed"}
                      </TableCell>
                      <TableCell>
                        {config?.is_active 
                          ? config.end_time || "Closed" 
                          : "Closed"}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={config?.is_active || false}
                          onCheckedChange={() => config && handleToggleActive(config.id, config.is_active)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (config) {
                              handleEdit(config);
                            } else {
                              setEditId(null);
                              form.reset({
                                dayOfWeek: day,
                                startTime: "09:00",
                                endTime: "17:00",
                                isActive: true,
                              });
                              setEditDialog(true);
                            }
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          {config ? "Edit" : "Set Hours"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Work Hours Overview</CardTitle>
          <CardDescription>
            Visual representation of site operational hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-7">
            {DAYS_OF_WEEK.map((day) => {
              const config = workHours.find(config => config.day_of_week === day);
              const isActive = config?.is_active || false;
              return (
                <div 
                  key={day} 
                  className={`rounded-lg border p-4 flex flex-col items-center ${
                    isActive ? 'bg-primary/5' : 'bg-muted/20'
                  }`}
                >
                  <div className="text-sm font-medium mb-2">{formatDayName(day)}</div>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background border mb-3">
                    <Clock className={`h-6 w-6 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  {isActive ? (
                    <div className="text-center">
                      <div className="text-sm">{config?.start_time || "N/A"}</div>
                      <div className="text-xs text-muted-foreground">to</div>
                      <div className="text-sm">{config?.end_time || "N/A"}</div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">Closed</div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Work Hours" : "Set Work Hours"}</DialogTitle>
            <DialogDescription>
              Configure working hours for this day. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="dayOfWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                        disabled={!!editId}
                      >
                        <option value="">Select day</option>
                        {DAYS_OF_WEEK.map(day => (
                          <option key={day} value={day}>{formatDayName(day)}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Open Time</FormLabel>
                      <FormControl>
                        <input 
                          type="time"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Close Time</FormLabel>
                      <FormControl>
                        <input 
                          type="time"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Active Status</FormLabel>
                      <FormDescription>
                        Enable or disable these work hours
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setEditDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
