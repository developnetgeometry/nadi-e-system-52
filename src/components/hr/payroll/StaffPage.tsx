
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from './StatCard';
import { Clipboard, Clock, DollarSign, Users } from 'lucide-react';

export const StaffPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Staff Payroll Dashboard</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Hours"
          value="160"
          icon={<Clock className="h-4 w-4" />}
        />
        <StatCard
          title="Base Salary"
          value="$2,400"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          title="Upcoming Payments"
          value="2"
          icon={<Clipboard className="h-4 w-4" />}
        />
        <StatCard
          title="Team Members"
          value="8"
          icon={<Users className="h-4 w-4" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payroll Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please contact your supervisor for more information about your payroll details.
            Your payment is processed on the 1st and 15th of each month.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffPage;
