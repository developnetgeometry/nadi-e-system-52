
import { Site } from "../types/site";

// Export the Site type
export type { Site };

// Your other existing functions and utilities
export const formatSiteData = (data: any[]): Site[] => {
  return data.map((site) => ({
    id: site.id,
    name: site.name || site.sitename,
    type: site.type,
    sitename: site.sitename,
    parent: site.parent
  }));
};

export const getSiteTypeLabel = (type: string): string => {
  const typeMap: Record<string, string> = {
    'hq': 'Headquarters',
    'branch': 'Branch',
    'satellite': 'Satellite Office',
    'virtual': 'Virtual Office',
    'warehouse': 'Warehouse',
    'retail': 'Retail Location'
  };
  
  return typeMap[type] || type;
};

// Add missing exported functions needed by SiteFormDialog.tsx
export const fetchSiteStatus = async () => {
  return [
    { id: 1, eng: 'Active' },
    { id: 2, eng: 'Inactive' },
    { id: 3, eng: 'Under Maintenance' },
    { id: 4, eng: 'Planned' }
  ];
};

export const fetchPhase = async () => {
  return [
    { id: 1, name: 'Phase 1' },
    { id: 2, name: 'Phase 2' },
    { id: 3, name: 'Phase 3' }
  ];
};

export const fetchRegion = async () => {
  return [
    { id: 1, eng: 'North' },
    { id: 2, eng: 'South' },
    { id: 3, eng: 'East' },
    { id: 4, eng: 'West' },
    { id: 5, eng: 'Central' }
  ];
};

export const fetchState = async (regionId: string) => {
  return [
    { id: 1, name: 'Selangor' },
    { id: 2, name: 'Kuala Lumpur' },
    { id: 3, name: 'Johor' },
    { id: 4, name: 'Penang' }
  ];
};

export const fetchDistrict = async (stateId: string) => {
  return [
    { id: 1, name: 'Petaling' },
    { id: 2, name: 'Klang' },
    { id: 3, name: 'Sepang' }
  ];
};

export const fetchParliament = async (stateId: string) => {
  return [
    { id: 1, fullname: 'Parliament A' },
    { id: 2, fullname: 'Parliament B' },
    { id: 3, fullname: 'Parliament C' }
  ];
};

export const fetchDun = async (parliamentId: string) => {
  return [
    { id: 1, full_name: 'DUN X' },
    { id: 2, full_name: 'DUN Y' },
    { id: 3, full_name: 'DUN Z' }
  ];
};

export const fetchMukim = async (districtId: string) => {
  return [
    { id: 1, name: 'Mukim 1' },
    { id: 2, name: 'Mukim 2' },
    { id: 3, name: 'Mukim 3' }
  ];
};

export const fetchTechnology = async () => {
  return [
    { id: 1, name: 'Fiber' },
    { id: 2, name: '5G' },
    { id: 3, name: '4G' },
    { id: 4, name: 'Satellite' }
  ];
};

export const fetchBandwidth = async () => {
  return [
    { id: 1, name: '100 Mbps' },
    { id: 2, name: '500 Mbps' },
    { id: 3, name: '1 Gbps' }
  ];
};

export const fetchBuildingType = async () => {
  return [
    { id: 1, eng: 'Commercial' },
    { id: 2, eng: 'Residential' },
    { id: 3, eng: 'Industrial' },
    { id: 4, eng: 'Government' }
  ];
};

export const fetchZone = async () => {
  return [
    { id: 1, area: 'Urban' },
    { id: 2, area: 'Suburban' },
    { id: 3, area: 'Rural' }
  ];
};

export const fetchCategoryArea = async () => {
  return [
    { id: 1, name: 'High Density' },
    { id: 2, name: 'Medium Density' },
    { id: 3, name: 'Low Density' }
  ];
};

export const fetchBuildingLevel = async () => {
  return [
    { id: 1, eng: 'Single Story' },
    { id: 2, eng: 'Multi-Story < 5 floors' },
    { id: 3, eng: 'High-Rise > 5 floors' }
  ];
};

export const fetchSocioecomic = async () => {
  return [
    { id: 1, eng: 'B40' },
    { id: 2, eng: 'M40' },
    { id: 3, eng: 'T20' }
  ];
};

export const fetchSiteSpace = async () => {
  return [
    { id: 1, eng: 'Indoor' },
    { id: 2, eng: 'Outdoor' },
    { id: 3, eng: 'Mixed' }
  ];
};

export const fetchOrganization = async () => {
  return [
    { id: 1, name: 'Organization A', displayName: 'Organization A (Parent A)' },
    { id: 2, name: 'Organization B', displayName: 'Organization B (Parent B)' },
    { id: 3, name: 'Organization C', displayName: 'Organization C (Parent C)' }
  ];
};

export const fetchAllStates = async () => {
  return [
    { id: 1, name: 'Selangor' },
    { id: 2, name: 'Kuala Lumpur' },
    { id: 3, name: 'Johor' },
    { id: 4, name: 'Penang' }
  ];
};

export const fetchAllDistricts = async () => {
  return [
    { id: 1, name: 'Petaling' },
    { id: 2, name: 'Klang' },
    { id: 3, name: 'Sepang' }
  ];
};

export const fetchAllMukims = async () => {
  return [
    { id: 1, name: 'Mukim 1' },
    { id: 2, name: 'Mukim 2' },
    { id: 3, name: 'Mukim 3' }
  ];
};

export const fetchAllParliaments = async () => {
  return [
    { id: 1, fullname: 'Parliament A' },
    { id: 2, fullname: 'Parliament B' },
    { id: 3, fullname: 'Parliament C' }
  ];
};

export const fetchAllDuns = async () => {
  return [
    { id: 1, full_name: 'DUN X' },
    { id: 2, full_name: 'DUN Y' },
    { id: 3, full_name: 'DUN Z' }
  ];
};

// Add missing site functions
export const fetchSites = async (
  organizationId: string | null,
  isTPUser: boolean = false,
  isDUSPUser: boolean = false
) => {
  return [
    { 
      id: '1', 
      sitename: 'Site A', 
      dusp_tp: { 
        name: 'TP A', 
        parent: { 
          id: 'parent1', 
          name: 'DUSP A' 
        } 
      },
      dusp_tp_id: 'tp1',
      dusp_tp_id_display: 'TP A (DUSP A)'
    },
    { 
      id: '2', 
      sitename: 'Site B', 
      dusp_tp: { 
        name: 'TP B', 
        parent: { 
          id: 'parent2', 
          name: 'DUSP B' 
        } 
      },
      dusp_tp_id: 'tp2',
      dusp_tp_id_display: 'TP B (DUSP B)'
    }
  ];
};

export const fetchSiteBySiteId = async (siteId: string) => {
  const sites = await fetchSites(null);
  return sites.find(site => site.id === siteId) || null;
};

export const fetchSiteBySiteProfileId = async (siteProfileId: string) => {
  const sites = await fetchSites(null);
  return sites.find(site => site.id === siteProfileId) || null;
};
