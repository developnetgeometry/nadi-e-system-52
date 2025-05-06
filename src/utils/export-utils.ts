
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

// Alias the function for backward compatibility
export const exportSitesToCSV = exportSitesAsCSV;

// Helper function to convert data to CSV format
const convertToCSV = (data: any[], headers: string[]) => {
  if (!data || data.length === 0) {
    return "";
  }

  // Convert data to rows based on headers
  const rows = data.map((item, index) => [
    index + 1,
    ...headers.slice(1).map(header => item[header.toLowerCase().replace(/ /g, '_')] || "")
  ]);

  const csvContent = [headers, ...rows]
    .map(e => e.map(x => `"${String(x).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  return csvContent;
};

// Mock implementation for exporting members to PDF
export const exportMembersToPDF = (data: any[], title: string) => {
  console.log(`Exporting ${title} to PDF with ${data.length} records`);
  // Implementation would go here
};

// Mock implementation for exporting members to CSV
export const exportMembersToCSV = (data: any[], title: string) => {
  console.log(`Exporting ${title} to CSV with ${data.length} records`);
  
  const headers = [
    "No.",
    "Member Name",
    "ID",
    "Phone",
    "Email",
    "Status"
  ];
  
  const csvContent = convertToCSV(data, headers);
  
  // In a real implementation, we would download this as a file
  // For now, just returning the content
  return csvContent;
};
