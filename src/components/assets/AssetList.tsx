import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AssetFormDialog } from "./AssetFormDialog";

interface Asset {
  id: string;
  name: string;
  category?: string;
  status?: string;
  purchase_cost?: number;
  purchase_date?: string;
  location?: string;
  description?: string;
  assigned_to?: string;
  brand_name?: string;
}

export function AssetList() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>();
  const { toast } = useToast();

  const fetchAssets = async () => {
    try {
      const { data, error } = await supabase
        .from("nd_asset")
        .select(`
          id,
          name,
          remark,
          serial_number,
          nd_brand(name)
        `)
        .order("name");

      if (error) throw error;

      const transformedAssets = data?.map(asset => ({
        id: asset.id.toString(),
        name: asset.name || '',
        description: asset.remark || '',
        brand_name: asset.nd_brand?.name || '',
        category: "Equipment", // Default category
        status: "Active", // Default status
      })) || [];

      setAssets(transformedAssets);
    } catch (error) {
      console.error("Error fetching assets:", error);
      toast({
        title: "Error",
        description: "Failed to fetch assets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleEdit = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this asset?")) {
      try {
        const { error } = await supabase
          .from("nd_asset")
          .delete()
          .eq("id", id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Asset deleted successfully",
        });
        
        fetchAssets();
      } catch (error) {
        console.error("Error deleting asset:", error);
        toast({
          title: "Error",
          description: "Failed to delete asset",
          variant: "destructive",
        });
      }
    }
  };

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div>Loading assets...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Asset Management</h2>
        <Button onClick={() => {
          setSelectedAsset(undefined);
          setIsDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Asset
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell>{asset.brand_name}</TableCell>
                  <TableCell>{asset.category}</TableCell>
                  <TableCell>
                    <Badge variant="default">{asset.status}</Badge>
                  </TableCell>
                  <TableCell>{asset.description}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(asset)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(asset.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AssetFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        asset={selectedAsset}
        onSave={fetchAssets}
      />
    </div>
  );
}
