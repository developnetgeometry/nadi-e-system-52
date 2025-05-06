
import { supabase } from "@/lib/supabase";

export const assetClient = {
  async toggleAssetActiveStatus(assetId: string, isActive: boolean) {
    // Toggle the asset's active status
    const { data, error } = await supabase
      .from("nd_asset")
      .update({ is_active: !isActive })
      .eq("id", assetId);

    if (error) {
      throw error;
    }

    return data;
  }
};
