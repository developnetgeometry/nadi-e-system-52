import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Site {
  id: string;
  sitename: string;
  latitude: string;
  longtitude: string;
  refid_mcmc: string;
  state_id: number;
}

export function LocationMap() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const { data, error } = await supabase
          .from("nd_site_profile")
          .select("id, sitename, latitude, longtitude, refid_mcmc, state_id")
          .not("latitude", "is", null)
          .not("longtitude", "is", null);

        if (error) throw error;
        setSites(data || []);
      } catch (error) {
        console.error("Error fetching sites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
  }, []);

  if (loading) {
    return <div>Loading map...</div>;
  }

  return (
    <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2">Site Locations</h3>
        <p className="text-sm text-gray-600 mb-4">
          Found {sites.length} sites with coordinates
        </p>
        {sites.slice(0, 5).map((site) => (
          <div key={site.id} className="text-xs text-left mb-1">
            {site.sitename}: {parseFloat(site.latitude).toFixed(6)}, {parseFloat(site.longtitude).toFixed(6)}
          </div>
        ))}
        {sites.length > 5 && (
          <p className="text-xs text-gray-500">...and {sites.length - 5} more</p>
        )}
      </div>
    </div>
  );
}
