
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { TakwimEventDialog } from "@/components/takwim/TakwimEventDialog";

export default function Takwim() {
  const [date, setDate] = useState<Date>(new Date());
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [view, setView] = useState<"calendar" | "list">("calendar");

  // Sample events - in a real app, these would come from a database
  const events = [
    {
      id: "1",
      title: "Strategic Planning Meeting",
      date: new Date(2024, 3, 20),
      startTime: "10:00",
      endTime: "12:00",
      type: "meeting",
      description: "Annual strategic planning session",
      location: "Conference Room A",
    },
    {
      id: "2",
      title: "Project Kickoff",
      date: new Date(2024, 3, 21),
      startTime: "14:00",
      endTime: "15:30",
      type: "project",
      description: "Kickoff for the new digital transformation project",
      location: "Meeting Room 3",
    },
  ];

  const eventsForSelectedDate = events.filter(
    (event) => event.date.toDateString() === date.toDateString()
  );

  const eventTypes = [
    { value: "meeting", label: "Meeting", color: "bg-blue-100 text-blue-800" },
    { value: "project", label: "Project", color: "bg-green-100 text-green-800" },
    { value: "training", label: "Training", color: "bg-amber-100 text-amber-800" },
    { value: "event", label: "Event", color: "bg-purple-100 text-purple-800" },
  ];

  const getEventTypeColor = (type: string) => {
    return eventTypes.find((t) => t.value === type)?.color || "bg-gray-100 text-gray-800";
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Takwim</h1>
            <p className="text-muted-foreground">
              Manage and schedule events for your organization
            </p>
          </div>
          <Button onClick={() => setIsEventDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Event
          </Button>
        </div>

        <Tabs
          defaultValue="calendar"
          value={view}
          onValueChange={(v) => setView(v as "calendar" | "list")}
          className="space-y-4"
        >
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{format(date, "MMMM yyyy")}</CardTitle>
                <CardDescription>
                  View and manage events for the selected date
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    className="rounded-md border w-full"
                  />

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Events for {format(date, "PPP")}
                    </h3>
                    {eventsForSelectedDate.length > 0 ? (
                      <div className="space-y-2">
                        {eventsForSelectedDate.map((event) => (
                          <div
                            key={event.id}
                            className="p-3 border rounded-md hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex justify-between">
                              <h4 className="font-medium">{event.title}</h4>
                              <span className={cn("px-2 py-1 rounded-full text-xs", getEventTypeColor(event.type))}>
                                {eventTypes.find((t) => t.value === event.type)?.label}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {event.startTime} - {event.endTime}
                            </div>
                            <div className="text-sm mt-1">{event.location}</div>
                            {event.description && (
                              <div className="text-sm text-gray-600 mt-2">
                                {event.description}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No events scheduled for this date
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Events</CardTitle>
                <CardDescription>View all scheduled events</CardDescription>
              </CardHeader>
              <CardContent>
                {events.length > 0 ? (
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="border rounded-md p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{event.title}</h3>
                            <p className="text-sm text-gray-500">
                              {format(event.date, "PPP")} | {event.startTime} - {event.endTime}
                            </p>
                            <p className="text-sm mt-1">{event.location}</p>
                            {event.description && (
                              <p className="text-sm text-gray-600 mt-2">
                                {event.description}
                              </p>
                            )}
                          </div>
                          <span className={cn("px-2 py-1 rounded-full text-xs", getEventTypeColor(event.type))}>
                            {eventTypes.find((t) => t.value === event.type)?.label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No events scheduled
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <TakwimEventDialog
        open={isEventDialogOpen}
        onOpenChange={setIsEventDialogOpen}
        eventTypes={eventTypes}
      />
    </DashboardLayout>
  );
}
