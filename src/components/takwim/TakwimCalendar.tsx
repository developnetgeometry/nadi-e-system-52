
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useHolidays } from "@/hooks/use-holidays";
import { useTakwimEvents } from "@/hooks/use-takwim-events";

interface TakwimCalendarProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
}

export function TakwimCalendar({ selectedDate, onSelectDate }: TakwimCalendarProps) {
  const { holidays } = useHolidays();
  const { events } = useTakwimEvents();

  // Combine holiday and event data for calendar display
  const isSpecialDay = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    // Check if it's a holiday
    const isHoliday = holidays.some(holiday => holiday.date === formattedDate);
    
    // Check if there's an event on this day
    const hasEvent = events.some(event => {
      const eventDate = new Date(event.start_datetime);
      return format(eventDate, 'yyyy-MM-dd') === formattedDate;
    });
    
    return { isHoliday, hasEvent };
  };

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Takwim Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-red-100 text-red-600 border-red-200">Holiday</Badge>
            <Badge variant="outline" className="bg-blue-100 text-blue-600 border-blue-200">Event</Badge>
          </div>
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          className="rounded-md border bg-white pointer-events-auto"
          modifiers={{
            holiday: (date) => isSpecialDay(date).isHoliday,
            event: (date) => isSpecialDay(date).hasEvent
          }}
          modifiersClassNames={{
            holiday: "bg-red-100 text-red-600 font-bold",
            event: "bg-blue-100 text-blue-600 font-bold"
          }}
        />
      </CardContent>
    </Card>
  );
}
