import {
  fetchSiteBySiteId,
  fetchSites,
} from "@/components/site/hook/site-utils";
import { supabase } from "@/lib/supabase";
import { Inventory, InventoryType } from "@/types/inventory";
import { Site } from "@/types/site";

export const inventoryClient = {
  fetchInventories: async (
    organizationId: string | null,
    siteId: string | null
  ): Promise<Inventory[]> => {
    // Pass isTPUser and isDUSPUser as false by default
    const allSites = await fetchSites(organizationId, false, false);

    let query = supabase
      .from("nd_inventory")
      .select(
        `*,
        nd_inventory_type ( id, name ),
        site:nd_site (
          id,
          standard_code,
          site_profile_id
        )`
      )
      .is("deleted_at", null);

    if (siteId) {
      query = query.eq("site_id", siteId);
    }

    query = query.order("id");

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching inventories:", error);
      throw error;
    }

    const formatProfile = (profile: Site) => ({
      ...profile,
      dusp_tp_id_display: profile?.dusp_tp?.parent
        ? `${profile.dusp_tp.name} (${profile.dusp_tp.parent.name})`
        : profile?.dusp_tp?.name ?? "N/A",
    });

    const filteredData = await Promise.all(
      data.map(async (item) => {
        let profile = null;

        if (siteId) {
          profile = await fetchSiteBySiteId(siteId);
        } else {
          profile = allSites.find((s) => s.id === item.site?.site_profile_id);
          if (profile) profile = formatProfile(profile);
        }

        return {
          ...item,
          type: item.nd_inventory_type,
          site: profile ? { ...profile } : null,
        };
      })
    );

    return filteredData;
  },
  fetchInventoryById: async (id: string): Promise<Inventory> => {
    const { data, error } = await supabase
      .from("nd_inventory")
      .select(
        `*,
        nd_inventory_type ( id, name ),
        site:nd_site (
          id,
          standard_code
        )`
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching inventory:", error);
      throw error;
    }
    return {
      ...data,
      type: data.nd_inventory_type,
      site: data.site,
    };
  },

  fetchInventoryTypes: async (): Promise<InventoryType[]> => {
    const { data, error } = await supabase
      .from("nd_inventory_type")
      .select("*");

    if (error) {
      console.error("Error fetching inventory types:", error);
      throw error;
    }
    return data as InventoryType[];
  },
};
