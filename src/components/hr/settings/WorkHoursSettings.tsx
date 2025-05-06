
import { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TimePickerInput } from "@/components/ui/time-picker-input";
import { AlertCircle, Edit, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface WorkHour {
  id: string;
  site_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

interface WorkHoursSettingsProps {
  siteId: string;
}

export function WorkHoursSettings({ siteId }: WorkHoursSettingsProps) {
  const [workHours, setWorkHours] = useState<WorkHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [tempWorkHours, setTempWorkHours] = useState<WorkHour[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchWorkHours() {
      if (!siteId) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("nd_work_hour_config")
          .select("*")
          .eq("site_id", siteId);
        
        if (error) throw error;
        
        // Initialize with default work hours if none exist
        if (!data || data.length === 0) {
          const defaultWorkHours = daysOfWeek.map(day => ({
            id: crypto.randomUUID(),
            site_id: siteId,
            day_of_week: day.toLowerCase(),
            start_time: day === "Saturday" || day === "Sunday" ? "" : "09:00:00",
            end_time: day === "Saturday" || day === "Sunday" ? "" : "17:00:00",
            is_active: !(day === "Saturday" || day === "Sunday")
          }));
          
          setWorkHours(defaultWorkHours);
          setTempWorkHours([...defaultWorkHours]);
        } else {
          // Ensure we have entries for all days of the week
          const existingDays = data.map(item => item.day_of_week.toLowerCase());
          const missingDays = daysOfWeek.filter(
            day => !existingDays.includes(day.toLowerCase())
          );
          
          const additionalEntries = missingDays.map(day => ({
            id: crypto.randomUUID(),
            site_id: siteId,
            day_of_week: day.toLowerCase(),
            start_time: "",
            end_time: "",
            is_active: false
          }));
          
          const allWorkHours = [...data, ...additionalEntries].sort((a, b) => {
            const dayOrder = {
              monday: 1,
              tuesday: 2,
              wednesday: 3,
              thursday: 4,
              friday: 5,
              saturday: 6,
              sunday: 7
            };
            return dayOrder[a.day_of_week.toLowerCase()] - dayOrder[b.day_of_week.toLowerCase()];
          });
          
          setWorkHours(allWorkHours);
          setTempWorkHours([...allWorkHours]);
        }
      } catch (error) {
        console.error("Error fetching work hours:", error);
        toast({
          title: "Error loading work hours",
          description: "Could not load work hours for this site.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchWorkHours();
  }, [siteId, toast]);

  const handleSaveWorkHours = async () => {
    if (!siteId) return;
    
    try {
      // Create batched upsert operations
      const upsertsArray = tempWorkHours.map(hour => ({
        site_id: siteId,
        day_of_week: hour.day_of_week,
        start_time: hour.start_time || null,
        end_time: hour.end_time || null,
        is_active: hour.is_active
      }));
      
      // We need to delete existing records first
      await supabase
        .from("nd_work_hour_config")
        .delete()
        .eq("site_id", siteId);
      
      // Then insert all new records
      const { error } = await supabase
        .from("nd_work_hour_config")
        .insert(upsertsArray);
      
      if (error) throw error;
      
      // Get the updated records with IDs
      const { data: updatedData } = await supabase
        .from("nd_work_hour_config")
        .select("*")
        .eq("site_id", siteId);
      
      setWorkHours(updatedData);
      setTempWorkHours([...updatedData]);
      setIsEditing(false);
      
      toast({
        title: "Work hours updated",
        description: "Work hours have been saved successfully."
      });
    } catch (error: any) {
      console.error("Error saving work hours:", error);
      toast({
        title: "Error saving work hours",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleTimeChange = (dayIndex: number, field: 'start_time' | 'end_time', value: string) => {
    const updatedHours = [...tempWorkHours];
    updatedHours[dayIndex][field] = value;
    setTempWorkHours(updatedHours);
  };

  const handleToggleActive = (dayIndex: number) => {
    const updatedHours = [...tempWorkHours];
    updatedHours[dayIndex].is_active = !updatedHours[dayIndex].is_active;
    
    // Clear times if deactivating
    if (!updatedHours[dayIndex].is_active) {
      updatedHours[dayIndex].start_time = "";
      updatedHours[dayIndex].end_time = "";
    } else if (!updatedHours[dayIndex].start_time && !updatedHours[dayIndex].end_time) {
      // Set default times if activating
      updatedHours[dayIndex].start_time = "09:00:00";
      updatedHours[dayIndex].end_time = "17:00:00";
    }
    
    setTempWorkHours(updatedHours);
  };

  if (!siteId) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-yellow-500 mb-4" />
          <CardTitle className="mb-2">No Site Selected</CardTitle>
          <CardDescription>
            Please select a site to manage work hours.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Work Hours</CardTitle>
            <CardDescription>
              Configure standard working hours for each day of the week
            </CardDescription>
          </div>
          {isEditing ? (
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setTempWorkHours([...workHours]);
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveWorkHours}>
                <Save className="h-4 w-4 mr-2" /> Save
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" /> Edit Hours
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-6 text-center">
              <p className="text-muted-foreground">Loading work hours...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tempWorkHours.map((workHour, index) => (
                  <TableRow key={workHour.day_of_week}>
                    <TableCell className="font-medium">
                      {workHour.day_of_week.charAt(0).toUpperCase() + workHour.day_of_week.slice(1)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={workHour.is_active ? "default" : "outline"}
                        size="sm"
                        onClick={() => isEditing && handleToggleActive(index)}
                        disabled={!isEditing}
                      >
                        {workHour.is_active ? "Active" : "Closed"}
                      </Button>
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <TimePickerInput
                          value={workHour.start_time}
                          onChange={(value) => handleTimeChange(index, 'start_time', value)}
                          disabled={!workHour.is_active}
                        />
                      ) : (
                        workHour.start_time || "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <TimePickerInput
                          value={workHour.end_time}
                          onChange={(value) => handleTimeChange(index, 'end_time', value)}
                          disabled={!workHour.is_active}
                        />
                      ) : (
                        workHour.end_time || "-"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
