
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { toast } from "sonner";
import { CalendarIcon, Plus, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

interface OffDaysSettingsProps {
  siteId: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  description: z.string().optional(),
  isRecurring: z.boolean().default(false),
  recurrencePattern: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface OffDay {
  id: string;
  site_id: string;
  title: string;
  start_date: string;
  end_date: string;
  description: string | null;
  is_recurring: boolean;
  recurrence_pattern: string | null;
}

export function OffDaysSettings({ siteId }: OffDaysSettingsProps) {
  const [loading, setLoading] = useState(true);
  const [offDays, setOffDays] = useState<OffDay[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState<"month" | "year">("month");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      startDate: new Date(),
      endDate: new Date(),
      description: "",
      isRecurring: false,
      recurrencePattern: "yearly",
    },
  });

  // Generate highlight dates for the calendar
  const getHighlightedDates = () => {
    const dates: Date[] = [];
    
    offDays.forEach(offDay => {
      const start = new Date(offDay.start_date);
      const end = new Date(offDay.end_date);
      
      // Add all dates between start and end (inclusive)
      const current = new Date(start);
      while (current <= end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    });
    
    return dates;
  };
  
  // Calculate if a date should be highlighted
  const isOffDay = (date: Date) => {
    return offDays.some(offDay => {
      const start = new Date(offDay.start_date);
      const end = new Date(offDay.end_date);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      
      const checkDate = new Date(date);
      checkDate.setHours(12, 0, 0, 0);
      
      return checkDate >= start && checkDate <= end;
    });
  };

  useEffect(() => {
    async function fetchOffDays() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("nd_off_days")
          .select("*")
          .eq("site_id", siteId)
          .order("start_date", { ascending: false });

        if (error) throw error;
        setOffDays(data || []);
      } catch (error) {
        console.error("Error fetching off days:", error);
        toast.error("Failed to load off days");
      } finally {
        setLoading(false);
      }
    }

    if (siteId) {
      fetchOffDays();
    }
  }, [siteId]);

  const handleEdit = (offDay: OffDay) => {
    setEditId(offDay.id);
    form.reset({
      title: offDay.title,
      startDate: new Date(offDay.start_date),
      endDate: new Date(offDay.end_date),
      description: offDay.description || "",
      isRecurring: offDay.is_recurring,
      recurrencePattern: offDay.recurrence_pattern || "yearly",
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("nd_off_days")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setOffDays(offDays.filter(day => day.id !== id));
      toast.success("Off day deleted successfully");
    } catch (error) {
      console.error("Error deleting off day:", error);
      toast.error("Failed to delete off day");
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const {
        title,
        startDate,
        endDate,
        description,
        isRecurring,
        recurrencePattern,
      } = values;

      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;

      if (endDate < startDate) {
        form.setError("endDate", { 
          type: "manual", 
          message: "End date cannot be before start date" 
        });
        return;
      }

      if (editId) {
        // Update existing off day
        const { error } = await supabase
          .from("nd_off_days")
          .update({
            title,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            description: description || null,
            is_recurring: isRecurring,
            recurrence_pattern: isRecurring ? recurrencePattern : null,
            updated_by: userId,
          })
          .eq("id", editId);

        if (error) throw error;
        toast.success("Off day updated successfully");
      } else {
        // Create new off day
        const { error } = await supabase
          .from("nd_off_days")
          .insert({
            site_id: siteId,
            title,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            description: description || null,
            is_recurring: isRecurring,
            recurrence_pattern: isRecurring ? recurrencePattern : null,
            created_by: userId,
          });

        if (error) throw error;
        toast.success("Off day added successfully");
      }

      // Reset form and refresh data
      form.reset({
        title: "",
        startDate: new Date(),
        endDate: new Date(),
        description: "",
        isRecurring: false,
        recurrencePattern: "yearly",
      });
      setEditId(null);
      
      // Refresh the off days list
      const { data, error } = await supabase
        .from("nd_off_days")
        .select("*")
        .eq("site_id", siteId)
        .order("start_date", { ascending: false });
      
      if (error) throw error;
      setOffDays(data || []);

    } catch (error) {
      console.error("Error saving off day:", error);
      toast.error("Failed to save off day");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="lg:col-span-1 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{editId ? "Edit Off Day" : "Add New Off Day"}</CardTitle>
            <CardDescription>
              Configure holidays and special closure days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., New Year's Day" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="isRecurring"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Recurring Event</FormLabel>
                        <FormDescription>
                          Should this event repeat yearly?
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
                
                {form.watch("isRecurring") && (
                  <FormField
                    control={form.control}
                    name="recurrencePattern"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recurrence Pattern</FormLabel>
                        <FormControl>
                          <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="yearly">Yearly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Additional information about this off day"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-2">
                  {editId && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setEditId(null);
                        form.reset({
                          title: "",
                          startDate: new Date(),
                          endDate: new Date(),
                          description: "",
                          isRecurring: false,
                          recurrencePattern: "yearly",
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button type="submit">
                    {editId ? "Update Off Day" : "Add Off Day"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Off Days List</CardTitle>
            <CardDescription>
              All configured holidays and special closure days
            </CardDescription>
          </CardHeader>
          <CardContent>
            {offDays.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Recurring</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offDays.map((offDay) => (
                    <TableRow key={offDay.id}>
                      <TableCell className="font-medium">{offDay.title}</TableCell>
                      <TableCell>
                        {format(new Date(offDay.start_date), "MMM d, yyyy")}
                        {offDay.start_date !== offDay.end_date && (
                          <> - {format(new Date(offDay.end_date), "MMM d, yyyy")}</>
                        )}
                      </TableCell>
                      <TableCell>
                        {offDay.is_recurring ? (
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            {offDay.recurrence_pattern}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                            No
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEdit(offDay)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(offDay.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex justify-center items-center h-32 bg-muted/20 rounded-lg border border-dashed">
                <p className="text-muted-foreground">No off days configured yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-1">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>Off Days Calendar</CardTitle>
            <CardDescription>
              Visual overview of all off days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-3 border rounded-md">
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm font-medium">
                  {calendarView === "month" 
                    ? format(calendarDate, "MMMM yyyy") 
                    : format(calendarDate, "yyyy")}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCalendarView(calendarView === "month" ? "year" : "month")}
                  >
                    {calendarView === "month" ? "Year View" : "Month View"}
                  </Button>
                </div>
              </div>
              
              <Calendar
                mode="single"
                selected={calendarDate}
                onSelect={(date) => date && setCalendarDate(date)}
                className="pointer-events-auto"
                modifiers={{
                  offDay: (date) => isOffDay(date),
                }}
                modifiersClassNames={{
                  offDay: "bg-red-100 text-red-800 font-bold hover:bg-red-200",
                }}
                captionLayout={calendarView === "year" ? "dropdown-buttons" : "buttons"}
                fromYear={2020}
                toYear={2030}
                defaultMonth={calendarDate}
                ISOWeek
              />
              
              <div className="mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 rounded-sm"></div>
                  <span>Off Days</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
