
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Edit, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTakwimEvents } from "@/hooks/use-takwim-events";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TakwimEventListProps {
  selectedDate?: Date;
}

export function TakwimEventList({ selectedDate }: TakwimEventListProps) {
  const { events, isLoading, deleteEvent } = useTakwimEvents();
  const [filteredEvents, setFilteredEvents] = useState(events);
  
  // Filter events when selected date changes
  useEffect(() => {
    if (selectedDate) {
      const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd');
      const filtered = events.filter(event => {
        const eventStartDate = format(new Date(event.start_datetime), 'yyyy-MM-dd');
        const eventEndDate = event.end_datetime ? format(new Date(event.end_datetime), 'yyyy-MM-dd') : eventStartDate;
        
        // Check if selected date falls within the event date range
        return formattedSelectedDate >= eventStartDate && formattedSelectedDate <= eventEndDate;
      });
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events);
    }
  }, [selectedDate, events]);

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      await deleteEvent(id);
    }
  };

  const formatDateTime = (datetime: string) => {
    return format(new Date(datetime), "PPP p");
  };

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {selectedDate ? `Events for ${format(selectedDate, 'PPP')}` : 'All Events'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">Loading events...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            No events {selectedDate ? 'for this date' : 'found'}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.program_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {event.category?.name || "Uncategorized"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDateTime(event.start_datetime)}
                      {event.end_datetime && (
                        <> - {formatDateTime(event.end_datetime)}</>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                        >
                          <a href={`/admin/takwim/edit/${event.id}`}>
                            <Edit className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
