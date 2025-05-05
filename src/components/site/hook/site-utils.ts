import { supabase } from "@/lib/supabase";
import { Organization } from "@/types/organization";

import {
  Bandwidth,
  BuildingLevel,
  BuildingType,
  CategoryArea,
  District,
  Dun,
  Mukim,
  Parliament,
  Phase,
  Region,
  Site,
  SiteStatus,
  Socioeconomic,
  Space,
  State,
  Technology,
  Zone,
} from "@/types/site";

// Export all required functions that are being imported elsewhere
export {
  fetchSites,
  fetchSiteBySiteId,
  fetchSiteBySiteProfileId,
  fetchSiteStatus,
  fetchPhase,
  fetchRegion,
  fetchDistrict,
  fetchParliament,
  fetchMukim,
  fetchState,
  fetchDun,
  fetchTechnology,
  fetchBandwidth,
  fetchBuildingType,
  fetchZone,
  fetchCategoryArea,
  fetchBuildingLevel,
  toggleSiteActiveStatus,
  fetchSocioecomic,
  fetchSiteSpace,
  deleteSite,
  fetchOrganization,
  Site,
};

export const fetchSites = async (
  organizationId: string | null,
  isTPUser: boolean = false,
  isDUSPUser: boolean = false
): Promise<Site[]> => {
  try {
    let query = supabase
      .from("nd_site_profile")
      .select(
        `
        *,
        nd_site_status:nd_site_status(eng),
        nd_site:nd_site(id,standard_code,refid_tp,refid_mcmc),
        nd_site_socioeconomic:nd_site_socioeconomic(nd_socioeconomics:nd_socioeconomics(id,eng)),
        nd_site_space:nd_site_space(nd_space:nd_space(id,eng)),
        nd_phases:nd_phases(name),
        nd_region:nd_region(eng),
        nd_site_address:nd_site_address(address1, address2, postcode, city, district_id, state_id),
        nd_parliament:nd_parliaments(id),
        nd_dun:nd_duns(id),
        nd_mukim:nd_mukims(id),
        dusp_tp:organizations!dusp_tp_id(id, name, parent:parent_id(id,name))
      `
      )
      .order("created_at", { ascending: false });

    if (organizationId) {
      if (isTPUser) {
        // Directly filter by TP organization ID
        query = query.eq("dusp_tp_id", organizationId);
      } else if (isDUSPUser) {
        // Fetch all TP organizations under the given DUSP organization
        const { data: childOrganizations, error: childError } = await supabase
          .from("organizations")
          .select("id")
          .eq("parent_id", organizationId);

        if (childError) throw childError;

        const childOrganizationIds = childOrganizations.map((org) => org.id);

        query = query.in("dusp_tp_id", [
          organizationId,
          ...childOrganizationIds,
        ]);
      }
    }

    const { data, error } = await query;
    if (error) throw error;

    // Cast as unknown first and then as Site[] to satisfy TypeScript
    return (data.map((site) => ({
      ...site,
      operate_date: site.operate_date ? site.operate_date.split("T")[0] : null,
      dusp_tp_id_display: site.dusp_tp?.parent?.name
        ? `${site.dusp_tp.name} (${site.dusp_tp.parent.name})`
        : site.dusp_tp?.name || "N/A", // Ensure dusp_tp_id_display is always set
    })) as unknown) as Site[];
  } catch (error) {
    console.error("Error fetching site profile:", error);
    throw error;
  }
};

export const fetchSiteBySiteId = async (
  siteId: string
): Promise<Site | null> => {
  if (!siteId || String(siteId).trim() === "" || siteId === "null") {
    return null;
  }
  try {
    const { data: site } = await supabase
      .from("nd_site")
      .select("site_profile_id")
      .eq("id", siteId)
      .single();

    if (!site) {
      return null;
    }
    const siteProfileId = site.site_profile_id;

    const { data, error } = await supabase
      .from("nd_site_profile")
      .select(
        `
        *,
        nd_site_status:nd_site_status(eng),
        nd_site:nd_site(id,standard_code,refid_tp,refid_mcmc),
        nd_site_socioeconomic:nd_site_socioeconomic(nd_socioeconomics:nd_socioeconomics(id,eng)),
        nd_site_space:nd_site_space(nd_space:nd_space(id,eng)),
        nd_phases:nd_phases(name),
        nd_region:nd_region(eng),
        nd_site_address:nd_site_address(address1, address2, postcode, city, district_id, state_id),
        nd_parliament:nd_parliaments(id),
        nd_dun:nd_duns(id),
        nd_mukim:nd_mukims(id),
        dusp_tp:organizations!dusp_tp_id(id, name, parent:parent_id(id,name))
      `
      )
      .eq("id", siteProfileId)
      .single();

    if (error) throw error;
    return data as Site | null;
  } catch (error) {
    console.error("Error fetching site profile by site ID:", error);
    throw error;
  }
};

export const fetchSiteBySiteProfileId = async (
  siteProfileId: string
): Promise<Site | null> => {
  const { data: site, error } = await supabase
    .from("nd_site_profile")
    .select(
      `
      id,
      sitename,
      is_active,
      dusp_tp_id,
      dusp_dusp_id,
      nd_site (standard_code),
      nd_phases (name),
      nd_region (eng),
      nd_site_status (eng)
    `
    )
    .eq("id", siteProfileId)
    .single();

  if (error) {
    console.error("Error fetching site by site profile ID:", error);
    throw error;
  }

  return site;
};

export const fetchSiteStatus = async (): Promise<SiteStatus[]> => {
  const { data: statuses, error } = await supabase
    .from('nd_site_status')
    .select('*');

  if (error) {
    console.error("Error fetching site statuses:", error);
    throw error;
  }

  return statuses;
};

export const fetchPhase = async (): Promise<Phase[]> => {
  const { data: phases, error } = await supabase
    .from('nd_phases')
    .select('*');

  if (error) {
    console.error("Error fetching phases:", error);
    throw error;
  }

  return phases;
};

export const fetchRegion = async (): Promise<Region[]> => {
  const { data: regions, error } = await supabase
    .from('nd_region')
    .select('*');

  if (error) {
    console.error("Error fetching regions:", error);
    throw error;
  }

  return regions;
};

export const fetchDistrict = async (stateId: string): Promise<District[]> => {
  const { data: districts, error } = await supabase
    .from('nd_district')
    .select('*')
    .eq('state_id', stateId);

  if (error) {
    console.error("Error fetching districts:", error);
    throw error;
  }

  return districts;
};

export const fetchParliament = async (
  stateId: string
): Promise<Parliament[]> => {
  const { data: parliaments, error } = await supabase
    .from('nd_parliaments')
    .select('*')
    .eq('state_id', stateId);

  if (error) {
    console.error("Error fetching parliaments:", error);
    throw error;
  }

  return parliaments;
};

export const fetchDun = async (parliamentid: string): Promise<Dun[]> => {
  const { data: duns, error } = await supabase
    .from('nd_duns')
    .select('*')
    .eq('parliament_id', parliamentid);

  if (error) {
    console.error("Error fetching duns:", error);
    throw error;
  }

  return duns;
};

export const fetchMukim = async (districtId: string): Promise<Mukim[]> => {
  const { data: mukims, error } = await supabase
    .from('nd_mukims')
    .select('*')
    .eq('district_id', districtId);

  if (error) {
    console.error("Error fetching mukims:", error);
    throw error;
  }

  return mukims;
};

export const fetchState = async (regionId: string): Promise<State[]> => {
  const { data: states, error } = await supabase
    .from('nd_states')
    .select('*')
    .eq('region_id', regionId);

  if (error) {
    console.error("Error fetching states:", error);
    throw error;
  }

  return states;
};

export const fetchTechnology = async (): Promise<Technology[]> => {
  const { data: technologies, error } = await supabase
    .from('nd_technologies')
    .select('*');

  if (error) {
    console.error("Error fetching technologies:", error);
    throw error;
  }

  return technologies;
};

export const fetchBandwidth = async (): Promise<Bandwidth[]> => {
  const { data: bandwidths, error } = await supabase
    .from('nd_bandwidths')
    .select('*');

  if (error) {
    console.error("Error fetching bandwidths:", error);
    throw error;
  }

  return bandwidths;
};

export const fetchBuildingType = async (): Promise<BuildingType[]> => {
  const { data: buildingTypes, error } = await supabase
    .from('nd_building_types')
    .select('*');

  if (error) {
    console.error("Error fetching building types:", error);
    throw error;
  }

  return buildingTypes;
};

export const fetchZone = async (): Promise<Zone[]> => {
  const { data: zones, error } = await supabase
    .from('nd_zones')
    .select('*');

  if (error) {
    console.error("Error fetching zones:", error);
    throw error;
  }

  return zones;
};

export const fetchCategoryArea = async (): Promise<CategoryArea[]> => {
  const { data: categoryAreas, error } = await supabase
    .from('nd_category_areas')
    .select('*');

  if (error) {
    console.error("Error fetching category areas:", error);
    throw error;
  }

  return categoryAreas;
};

export const fetchBuildingLevel = async (): Promise<BuildingLevel[]> => {
  const { data: buildingLevels, error } = await supabase
    .from('nd_building_levels')
    .select('*');

  if (error) {
    console.error("Error fetching building levels:", error);
    throw error;
  }

  return buildingLevels;
};

export const toggleSiteActiveStatus = async (
  siteId: string,
  currentStatus: boolean
): Promise<void> => {
  const { error } = await supabase
    .from('nd_site_profile')
    .update({ is_active: !currentStatus })
    .eq('id', siteId);

  if (error) {
    console.error("Error toggling site active status:", error);
    throw error;
  }
};

export const fetchSocioecomic = async (): Promise<Socioeconomic[]> => {
  const { data: socioeconomics, error } = await supabase
    .from('nd_socioeconomics')
    .select('*');

  if (error) {
    console.error("Error fetching socioeconomics:", error);
    throw error;
  }

  return socioeconomics;
};

export const fetchSiteSpace = async (): Promise<Space[]> => {
  const { data: spaces, error } = await supabase
    .from('nd_site_space')
    .select('*');

  if (error) {
    console.error("Error fetching site spaces:", error);
    throw error;
  }

  return spaces;
};

export const deleteSite = async (siteId: string): Promise<void> => {
  const { error } = await supabase
    .from('nd_site_profile')
    .delete()
    .eq('id', siteId);

  if (error) {
    console.error("Error deleting site:", error);
    throw error;
  }
};

export const fetchOrganization = async (): Promise<Organization[]> => {
  const { data: organizations, error } = await supabase
    .from('organizations')
    .select('*');

  if (error) {
    console.error("Error fetching organizations:", error);
    throw error;
  }

  return organizations;
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
