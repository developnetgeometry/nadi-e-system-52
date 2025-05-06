
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
  }
};
