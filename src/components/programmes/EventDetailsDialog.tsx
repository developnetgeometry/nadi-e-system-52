
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/date-utils";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EventDetailsDialogProps {
  eventId: string | null;
  open: boolean;
  onClose: () => void;
}

export const EventDetailsDialog = ({
  eventId,
  open,
  onClose,
}: EventDetailsDialogProps) => {
  const [event, setEvent] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) return;
      
      setLoading(true);
      try {
        // Fetch event details
        const { data: eventData, error: eventError } = await supabase
          .from('nd_event')
          .select(`
            *,
            nd_event_status:status_id(id, name)
          `)
          .eq('id', eventId)
          .single();
          
        if (eventError) throw eventError;
        setEvent(eventData);

        // Fetch participants
        const { data: participantData, error: participantError } = await supabase
          .from('nd_event_participant')
          .select(`
            id,
            member_id,
            attendance,
            acceptance,
            created_at,
            nd_member_profile:member_id(fullname, email, mobile_no)
          `)
          .eq('event_id', eventId);

        if (participantError) throw participantError;
        setParticipants(participantData);
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchEventDetails();
    }
  }, [eventId, open]);

  const handleEditClick = () => {
    if (event) {
      // Navigate to edit page with event ID
      // This is just a placeholder, implement actual navigation as needed
      navigate(`/programmes/edit/${event.id}`);
      onClose();
    }
  };

  // Function to determine if edit button should be visible
  const showEditButton = () => {
    if (!event || !event.nd_event_status) return false;
    
    const status = event.nd_event_status.name?.toLowerCase();
    return status === 'draft' || status === 'postponed';
  };

  // Function to get badge variant based on status
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
      <DialogContent className="w-full max-w-4xl">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading event details...</span>
          </div>
        ) : !event ? (
          <div className="py-8 text-center">
            <p>Event not found or an error occurred.</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle className="text-xl">{event.program_name}</DialogTitle>
                {showEditButton() && (
                  <Button 
                    onClick={handleEditClick} 
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>
              <DialogDescription>
                {getStatusBadge(event.nd_event_status?.name || 'Draft')}
                <span className="ml-2">
                  {event.location_event ? `at ${event.location_event}` : 'No location specified'}
                </span>
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Event Details</TabsTrigger>
                <TabsTrigger value="participants">Participants ({participants?.length || 0})</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-500">Program Name</h4>
                    <p>{event.program_name || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-500">Location</h4>
                    <p>{event.location_event || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-500">Start Date & Time</h4>
                    <p>{event.start_datetime ? formatDate(event.start_datetime) : "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-500">End Date & Time</h4>
                    <p>{event.end_datetime ? formatDate(event.end_datetime) : "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-500">Duration (hours)</h4>
                    <p>{event.duration || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-500">Trainer</h4>
                    <p>{event.trainer_name || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-500">Total Participants</h4>
                    <p>{event.total_participant || 0}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-500">Total New Members</h4>
                    <p>{event.total_new_member || 0}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-sm text-gray-500">Description</h4>
                    <p>{event.description || "No description available."}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="participants" className="pt-4">
                {participants.length === 0 ? (
                  <div className="py-8 text-center">
                    <p>No participants found for this event.</p>
                  </div>
                ) : (
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Registration Date</TableHead>
                          <TableHead>Attendance</TableHead>
                          <TableHead>Acceptance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {participants.map((participant) => (
                          <TableRow key={participant.id}>
                            <TableCell className="font-medium">
                              {participant.nd_member_profile?.fullname || "Unknown"}
                            </TableCell>
                            <TableCell>{participant.nd_member_profile?.email || "N/A"}</TableCell>
                            <TableCell>{participant.nd_member_profile?.mobile_no || "N/A"}</TableCell>
                            <TableCell>{formatDate(participant.created_at)}</TableCell>
                            <TableCell>
                              {participant.attendance ? (
                                <Badge className="bg-green-100 text-green-800">Present</Badge>
                              ) : (
                                <Badge className="bg-gray-100 text-gray-800">Absent</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {participant.acceptance ? (
                                <Badge className="bg-blue-100 text-blue-800">Accepted</Badge>
                              ) : (
                                <Badge className="bg-gray-100 text-gray-800">Not Confirmed</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsDialog;
