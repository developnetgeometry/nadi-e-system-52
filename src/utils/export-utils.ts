
// Import Site as a type
import { type Site } from "@/components/site/hook/site-utils";

export const exportSitesAsCSV = (sites: Site[]) => {
  if (!sites || sites.length === 0) {
    return "";
  }

  const headers = [
    "No.",
    "Site Code",
    "Site Name",
    "Phase",
    "Region", 
    "State",
    "Status"
  ];

  // Convert sites to rows
  const rows = sites.map((site, index) => [
    index + 1,
    site?.nd_site?.[0]?.standard_code || "",
    site?.sitename || "",
    site?.nd_phases?.name || "",
    site?.nd_region?.eng || "",
    site?.nd_site_address?.[0]?.state_id || "",
    site?.nd_site_status?.eng || ""
  ]);

  const csvContent = [headers, ...rows]
    .map(e => e.map(x => `"${String(x).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  return csvContent;
};
