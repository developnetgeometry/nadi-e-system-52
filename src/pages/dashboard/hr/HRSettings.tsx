
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { EntitlementSettings } from "@/components/hr/settings/EntitlementSettings";
import { OffDaysSettings } from "@/components/hr/settings/OffDaysSettings";
import { WorkHoursSettings } from "@/components/hr/settings/WorkHoursSettings";
import { PageHeader } from "@/components/layout/PageHeader";
import { SiteSelector } from "@/components/hr/settings/SiteSelector";

export default function HRSettings() {
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <PageHeader 
          title="HR Settings"
          description="Manage leave entitlement, off days, and work hours for your sites"
        />
        
        <div className="mb-6">
          <SiteSelector onSiteChange={setSelectedSiteId} selectedSiteId={selectedSiteId} />
        </div>
        
        {selectedSiteId ? (
          <Tabs defaultValue="entitlement" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="entitlement">Leave Entitlement</TabsTrigger>
              <TabsTrigger value="offdays">Off Days</TabsTrigger>
              <TabsTrigger value="workhours">Work Hours</TabsTrigger>
            </TabsList>
            <TabsContent value="entitlement" className="mt-6">
              <EntitlementSettings siteId={selectedSiteId} />
            </TabsContent>
            <TabsContent value="offdays" className="mt-6">
              <OffDaysSettings siteId={selectedSiteId} />
            </TabsContent>
            <TabsContent value="workhours" className="mt-6">
              <WorkHoursSettings siteId={selectedSiteId} />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex justify-center items-center h-64 bg-muted/20 rounded-lg border border-dashed">
            <p className="text-muted-foreground">Select a site to manage HR settings</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
