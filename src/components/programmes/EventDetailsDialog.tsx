import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/date-utils";
import { EventQRCodeGenerator } from "./EventQRCodeGenerator";

interface EventDetailsDialogProps {
  eventId: string | null;
  open: boolean;
  onClose: () => void;
}

export default function EventDetailsDialog({ eventId, open, onClose }: EventDetailsDialogProps) {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId || !open) return;

    const fetchEventDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("nd_event")
          .select(`
            id,
            program_name,
            description,
            location_event,
            start_datetime,
            end_datetime,
            duration,
            trainer_name,
            category_id,
            subcategory_id,
            program_id,
            module_id,
            program_mode,
            is_group_event,
            total_participant,
            status_id,
            nd_event_status:status_id(id, name),
            nd_event_category:category_id(id, name),
            nd_event_subcategory:subcategory_id(id, name),
            nd_event_program:program_id(id, name),
            nd_event_module:module_id(id, name)
          `)
          .eq("id", eventId)
          .single();

        if (error) throw error;
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event details:", error);
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, open]);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "registered":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
            Registered
          </Badge>
        );
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Active
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            Cancelled
          </Badge>
        );
      case "postponed":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            Postponed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            Draft
          </Badge>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Event Details</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading event details...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        ) : event ? (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold">{event.program_name}</h2>
              {event.nd_event_status && getStatusBadge(event.nd_event_status.name)}
            </div>

            {event.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                <p>{event.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Event Details</h3>
                <div className="space-y-2">
                  {event.location_event && (
                    <div>
                      <span className="font-medium">Location:</span> {event.location_event}
                    </div>
                  )}
                  {event.start_datetime && (
                    <div>
                      <span className="font-medium">Start Date:</span> {formatDate(event.start_datetime)}
                    </div>
                  )}
                  {event.end_datetime && (
                    <div>
                      <span className="font-medium">End Date:</span> {formatDate(event.end_datetime)}
                    </div>
                  )}
                  {event.duration && (
                    <div>
                      <span className="font-medium">Duration:</span> {event.duration} hours
                    </div>
                  )}
                  {event.trainer_name && (
                    <div>
                      <span className="font-medium">Trainer:</span> {event.trainer_name}
                    </div>
                  )}
                  {event.program_mode && (
                    <div>
                      <span className="font-medium">Mode:</span> {event.program_mode}
                    </div>
                  )}
                  {event.is_group_event !== undefined && (
                    <div>
                      <span className="font-medium">Group Event:</span> {event.is_group_event ? "Yes" : "No"}
                    </div>
                  )}
                  {event.total_participant && (
                    <div>
                      <span className="font-medium">Total Participants:</span> {event.total_participant}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Classification</h3>
                <div className="space-y-2">
                  {event.nd_event_category && (
                    <div>
                      <span className="font-medium">Category:</span> {event.nd_event_category.name}
                    </div>
                  )}
                  {event.nd_event_subcategory && (
                    <div>
                      <span className="font-medium">Subcategory:</span> {event.nd_event_subcategory.name}
                    </div>
                  )}
                  {event.nd_event_program && (
                    <div>
                      <span className="font-medium">Program:</span> {event.nd_event_program.name}
                    </div>
                  )}
                  {event.nd_event_module && (
                    <div>
                      <span className="font-medium">Module:</span> {event.nd_event_module.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Add QR Code Generator section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Registration QR Code</h3>
              <EventQRCodeGenerator 
                eventId={eventId!} 
                eventTitle={event.program_name} 
              />
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
