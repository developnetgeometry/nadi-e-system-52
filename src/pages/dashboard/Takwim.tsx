
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TakwimCalendar } from "@/components/takwim/TakwimCalendar";
import { TakwimEventList } from "@/components/takwim/TakwimEventList";

const Takwim = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold">Takwim Calendar</h1>
          <Button onClick={() => navigate("/admin/takwim/create")} className="gap-2">
            <Plus className="h-4 w-4" /> Create Event
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <TakwimCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          <TakwimEventList selectedDate={selectedDate} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Takwim;
