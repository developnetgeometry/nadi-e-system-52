
import { supabase } from "@/lib/supabase";

export const inventoryClient = {
  async toggleInventoryActiveStatus(inventoryId: string, isActive: boolean) {
    // Toggle the inventory's active status
    const { data, error } = await supabase
      .from("nd_inventory")
      .update({ is_active: !isActive })
      .eq("id", inventoryId);

    if (error) {
      throw error;
    }

    return data;
  },

  async fetchInventories(organizationId?: string | null, site_id?: string | null) {
    // Mock implementation for now
    console.log("Fetching inventories with:", { organizationId, site_id });
    return [];
  },

  async fetchInventoryById(id: string) {
    // Mock implementation for now
    console.log("Fetching inventory by ID:", id);
    return null;
  },

  async fetchInventoryTypes() {
    // Mock implementation for now
    console.log("Fetching inventory types");
    return [];
  }
};
