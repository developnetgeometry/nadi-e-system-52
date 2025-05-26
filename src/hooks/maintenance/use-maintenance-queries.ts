import { useQuery } from "@tanstack/react-query";

import { MaintenanceStatus } from "@/types/maintenance";
import { useSiteId, useTpManagerSiteId } from "../use-site-id";
import { useSiteIdFromSiteProfile } from "../use-site-profile-site-id";
import { useUserMetadata } from "../use-user-metadata";
import { maintenanceClient } from "./maintenance-client";

export const useMaintenanceQueries = () => {
  const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const organizationId =
    parsedMetadata?.user_type !== "super_admin" &&
    parsedMetadata?.organization_id
      ? parsedMetadata.organization_id
      : null;
  const isStaffUser = parsedMetadata?.user_group_name === "Centre Staff";
  const isVendor = parsedMetadata?.user_group_name === "Vendor";
  const isTpSite = parsedMetadata?.user_group_name === "Site";

  const siteIdStaff = useSiteId(isStaffUser);
  const {
    siteId: siteProfileIdTpManager,
    isLoading: siteProfileIdTpManagerLoading,
  } = useTpManagerSiteId(isTpSite);
  const siteIdTpManager = useSiteIdFromSiteProfile(
    siteProfileIdTpManagerLoading ? null : siteProfileIdTpManager
  );

  let site_id: string | null = null;
  if (isStaffUser) {
    site_id = siteIdStaff;
  } else if (isTpSite) {
    site_id = siteIdTpManager;
  }

  let statuses = [] as MaintenanceStatus[];

  if (isVendor) {
    statuses = Object.values(MaintenanceStatus); // This wouldn't getting status == null
  }

  const useMaintenanceRequestsQuery = (requestsType?: string) =>
    useQuery({
      queryKey: [
        "maintenance-requests",
        requestsType,
        statuses,
        organizationId,
        site_id,
      ],
      queryFn: () =>
        maintenanceClient.fetchMaintenanceRequests(
          requestsType,
          statuses,
          organizationId,
          site_id
        ),
    });
  const useMaintenanceTypesQuery = () =>
    useQuery({
      queryKey: ["maintenance-types"],
      queryFn: () => maintenanceClient.fetchMaintenanceTypes(),
    });

  const useSLACategoriesQuery = () =>
    useQuery({
      queryKey: ["sla-categories"],
      queryFn: () => maintenanceClient.fetchSLACategories(),
    });

  return {
    useMaintenanceRequestsQuery,
    useMaintenanceTypesQuery,
    useSLACategoriesQuery,
  };
};
