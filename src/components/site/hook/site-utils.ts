
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
