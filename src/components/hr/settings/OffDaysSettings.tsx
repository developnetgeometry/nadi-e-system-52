
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Plus, Trash } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { format, isWithinInterval, parse } from "date-fns";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface OffDay {
  id: string;
  site_id: string;
  title: string;
  start_date: string;
  end_date: string;
  is_recurring: boolean;
  recurrence_pattern?: string;
  description?: string;
}

interface OffDaysSettingsProps {
  siteId: string;
}

export function OffDaysSettings({ siteId }: OffDaysSettingsProps) {
  const [offDays, setOffDays] = useState<OffDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [newOffDay, setNewOffDay] = useState<Partial<OffDay>>({
    site_id: siteId,
    title: "",
    start_date: format(new Date(), "yyyy-MM-dd"),
    end_date: format(new Date(), "yyyy-MM-dd"),
    is_recurring: false,
    description: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    async function fetchOffDays() {
      if (!siteId) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("nd_off_days")
          .select("*")
          .eq("site_id", siteId);
        
        if (error) throw error;
        
        setOffDays(data || []);
      } catch (error) {
        console.error("Error fetching off days:", error);
        toast({
          title: "Error loading off days",
          description: "Could not load off days for this site.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchOffDays();
  }, [siteId, toast]);

  const handleAddOffDay = async () => {
    if (!newOffDay.title || !newOffDay.start_date || !newOffDay.end_date) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from("nd_off_days")
        .insert({
          site_id: siteId,
          title: newOffDay.title,
          start_date: newOffDay.start_date,
          end_date: newOffDay.end_date,
          is_recurring: newOffDay.is_recurring || false,
          recurrence_pattern: newOffDay.recurrence_pattern,
          description: newOffDay.description
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setOffDays([...offDays, data]);
      
      setIsAddDialogOpen(false);
      setNewOffDay({
        site_id: siteId,
        title: "",
        start_date: format(new Date(), "yyyy-MM-dd"),
        end_date: format(new Date(), "yyyy-MM-dd"),
        is_recurring: false,
        description: ""
      });
      
      toast({
        title: "Off day added",
        description: "Off day has been added successfully."
      });
    } catch (error: any) {
      console.error("Error adding off day:", error);
      toast({
        title: "Error adding off day",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteOffDay = async (id: string) => {
    try {
      const { error } = await supabase
        .from("nd_off_days")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      setOffDays(offDays.filter(day => day.id !== id));
      
      toast({
        title: "Off day deleted",
        description: "Off day has been deleted successfully."
      });
    } catch (error: any) {
      console.error("Error deleting off day:", error);
      toast({
        title: "Error deleting off day",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const isDayOff = (date: Date) => {
    return offDays.some(offDay => {
      const startDate = parse(offDay.start_date, "yyyy-MM-dd", new Date());
      const endDate = parse(offDay.end_date, "yyyy-MM-dd", new Date());
      
      return isWithinInterval(date, { start: startDate, end: endDate });
    });
  };

  if (!siteId) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-yellow-500 mb-4" />
          <CardTitle className="mb-2">No Site Selected</CardTitle>
          <CardDescription>
            Please select a site to manage off days.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Off Days Calendar</CardTitle>
            <CardDescription>
              View and select off days for this site
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                offDay: (date) => isDayOff(date)
              }}
              modifiersStyles={{
                offDay: { 
                  backgroundColor: "rgb(220, 53, 69, 0.1)",
                  color: "rgb(220, 53, 69)",
                  fontWeight: "bold"
                }
              }}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Off Days List</CardTitle>
              <CardDescription>
                Manage holidays and other off days
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Add Off Day
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Off Day</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newOffDay.title || ""}
                      onChange={(e) => setNewOffDay({
                        ...newOffDay,
                        title: e.target.value
                      })}
                      placeholder="e.g., National Holiday, Company Closure"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={newOffDay.start_date}
                        onChange={(e) => setNewOffDay({
                          ...newOffDay,
                          start_date: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-date">End Date</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={newOffDay.end_date}
                        onChange={(e) => setNewOffDay({
                          ...newOffDay,
                          end_date: e.target.value
                        })}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="recurring"
                      checked={newOffDay.is_recurring}
                      onCheckedChange={(checked) => setNewOffDay({
                        ...newOffDay,
                        is_recurring: checked
                      })}
                    />
                    <Label htmlFor="recurring">Recurring yearly</Label>
                  </div>
                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                      id="description"
                      value={newOffDay.description || ""}
                      onChange={(e) => setNewOffDay({
                        ...newOffDay,
                        description: e.target.value
                      })}
                      placeholder="Additional information about this off day"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddOffDay}>
                    Add Off Day
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-6 text-center">
                <p className="text-muted-foreground">Loading off days...</p>
              </div>
            ) : offDays.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Recurring</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offDays.map((offDay) => (
                    <TableRow key={offDay.id}>
                      <TableCell className="font-medium">{offDay.title}</TableCell>
                      <TableCell>
                        {offDay.start_date === offDay.end_date
                          ? format(parse(offDay.start_date, "yyyy-MM-dd", new Date()), "MMM d, yyyy")
                          : `${format(parse(offDay.start_date, "yyyy-MM-dd", new Date()), "MMM d")} - ${format(parse(offDay.end_date, "yyyy-MM-dd", new Date()), "MMM d, yyyy")}`
                        }
                      </TableCell>
                      <TableCell>
                        {offDay.is_recurring ? "Yes" : "No"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteOffDay(offDay.id)}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-6 text-center">
                <p className="text-muted-foreground">No off days configured for this site.</p>
                <p className="text-muted-foreground">Click "Add Off Day" to create one.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
