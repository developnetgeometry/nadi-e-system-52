import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Asset {
  id?: string;
  name: string;
  category: string;
  status: string;
  purchase_cost: number;
  purchase_date: string;
  location?: string;
  description?: string;
  assigned_to?: string;
}

interface AssetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset?: Asset;
  onSave: () => void;
}

export function AssetFormDialog({ open, onOpenChange, asset, onSave }: AssetFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [sites, setSites] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sitesRes, brandsRes] = await Promise.all([
          supabase.from("nd_site_profile").select("id, sitename"),
          supabase.from("nd_brand").select("id, name")
        ]);

        if (sitesRes.data) setSites(sitesRes.data);
        if (brandsRes.data) setBrands(brandsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      const assetData = {
        name: formData.get("name") as string,
        type_id: parseInt(formData.get("type_id") as string),
        brand_id: parseInt(formData.get("brand_id") as string),
        remark: formData.get("remark") as string,
        serial_number: formData.get("serial_number") as string,
        retail_type: parseInt(formData.get("retail_type") as string),
        qty_unit: parseInt(formData.get("qty_unit") as string),
        location_id: parseInt(formData.get("location_id") as string),
        site_id: parseInt(formData.get("site_id") as string),
        updated_at: new Date().toISOString(),
      };

      if (asset?.id) {
        const { error } = await supabase
          .from("nd_asset")
          .update(assetData)
          .eq("id", asset.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("nd_asset")
          .insert([assetData]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Asset ${asset ? "updated" : "created"} successfully`,
      });

      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving asset:", error);
      toast({
        title: "Error",
        description: "Failed to save asset",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{asset ? "Edit Asset" : "Add New Asset"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Asset Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={asset?.name}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="site_id">Site</Label>
              <Select name="site_id" defaultValue={asset?.location}>
                <SelectTrigger>
                  <SelectValue placeholder="Select site" />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id.toString()}>
                      {site.sitename}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="brand_id">Brand</Label>
              <Select name="brand_id">
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id.toString()}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="serial_number">Serial Number</Label>
              <Input
                id="serial_number"
                name="serial_number"
                defaultValue=""
              />
            </div>

            <div>
              <Label htmlFor="qty_unit">Quantity</Label>
              <Input
                id="qty_unit"
                name="qty_unit"
                type="number"
                defaultValue="1"
              />
            </div>

            <div>
              <Label htmlFor="type_id">Type ID</Label>
              <Input
                id="type_id"
                name="type_id"
                type="number"
                defaultValue="1"
              />
            </div>

            <div>
              <Label htmlFor="retail_type">Retail Type</Label>
              <Input
                id="retail_type"
                name="retail_type"
                type="number"
                defaultValue="1"
              />
            </div>

            <div>
              <Label htmlFor="location_id">Location ID</Label>
              <Input
                id="location_id"
                name="location_id"
                type="number"
                defaultValue="1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="remark">Remarks</Label>
            <Textarea
              id="remark"
              name="remark"
              defaultValue={asset?.description}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
