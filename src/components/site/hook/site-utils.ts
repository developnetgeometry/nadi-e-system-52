export interface Site {
  id: string;
  sitename: string;
  is_active: boolean;
  nd_site: Array<{ standard_code: string }>;
  nd_phases?: { name: string };
  nd_region?: { eng: string };
  nd_site_status?: { eng: string };
  dusp_tp_id_display?: string;
}

import { supabase } from "@/lib/supabase";

export const fetchSites = async (organizationId: string | null, isTPUser: boolean, isDUSPUser: boolean): Promise<Site[]> => {
  let query = supabase
    .from('nd_site_profile')
    .select(`
      id,
      sitename,
      is_active,
      nd_site (standard_code),
      nd_phases (name),
      nd_region (eng),
      nd_site_status (eng),
      dusp_tp_id_display
    `);

  if (organizationId) {
    if (isTPUser) {
      query = query.eq('dusp_tp_id', organizationId);
    } else if (isDUSPUser) {
      query = query.eq('dusp_dusp_id', organizationId);
    }
  }

  const { data: sites, error } = await query;

  if (error) {
    console.error("Error fetching sites:", error);
    throw error;
  }

  return sites as Site[];
};

export const fetchSite = async (siteId: string) => {
  const { data: site, error } = await supabase
    .from('nd_site_profile')
    .select(`
      id,
      sitename,
      is_active,
      dusp_tp_id,
      dusp_dusp_id,
      nd_site (standard_code),
      nd_phases (name),
      nd_region (eng),
      nd_site_status (eng)
    `)
    .eq('id', siteId)
    .single();

  if (error) {
    console.error("Error fetching site:", error);
    throw error;
  }

  return site;
};

export const fetchPhase = async () => {
  const { data: phases, error } = await supabase
    .from('nd_phases')
    .select('*');

  if (error) {
    console.error("Error fetching phases:", error);
    throw error;
  }

  return phases;
};

export const fetchRegion = async () => {
  const { data: regions, error } = await supabase
    .from('nd_region')
    .select('*');

  if (error) {
    console.error("Error fetching regions:", error);
    throw error;
  }

  return regions;
};

export const fetchSiteStatus = async () => {
  const { data: statuses, error } = await supabase
    .from('nd_site_status')
    .select('*');

  if (error) {
    console.error("Error fetching site statuses:", error);
    throw error;
  }

  return statuses;
};

export const toggleSiteActiveStatus = async (siteId: string, currentStatus: boolean) => {
  const { error } = await supabase
    .from('nd_site_profile')
    .update({ is_active: !currentStatus })
    .eq('id', siteId);

  if (error) {
    console.error("Error toggling site active status:", error);
    throw error;
  }
};

export const deleteSite = async (siteId: string) => {
  const { error } = await supabase
    .from('nd_site_profile')
    .delete()
    .eq('id', siteId);

  if (error) {
    console.error("Error deleting site:", error);
    throw error;
  }
};

export const updateSite = async (siteId: string, updates: any) => {
  const { data, error } = await supabase
    .from('nd_site_profile')
    .update(updates)
    .eq('id', siteId)
    .select()

  if (error) {
    console.error("Error updating site:", error);
    throw error;
  }

  return data;
};

export const createSite = async (siteData: any) => {
  const { data, error } = await supabase
    .from('nd_site_profile')
    .insert([siteData])
    .select()

  if (error) {
    console.error("Error creating site:", error);
    throw error;
  }

  return data;
};
