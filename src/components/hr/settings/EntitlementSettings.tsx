
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface EntitlementSettingsProps {
  siteId: string;
}

const formSchema = z.object({
  contractType: z.string().min(1, "Contract type is required"),
  annualLeaveDays: z.coerce.number().min(0, "Days cannot be negative"),
  proRateFormula: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Entitlement {
  id: string;
  contract_type_id: string;
  annual_leave_day: number;
  pro_rate_formula: string | null;
  contract_type: {
    id: string;
    name: string;
  };
}

export function EntitlementSettings({ siteId }: EntitlementSettingsProps) {
  const [loading, setLoading] = useState(true);
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const [contractTypes, setContractTypes] = useState<{ id: string; name: string }[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contractType: "",
      annualLeaveDays: 0,
      proRateFormula: "",
    },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch contract types
        const { data: contractTypesData, error: contractTypesError } = await supabase
          .from("nd_contract_type")
          .select("id, name");

        if (contractTypesError) throw contractTypesError;
        setContractTypes(contractTypesData || []);

        // Fetch entitlements
        const { data: entitlementsData, error: entitlementsError } = await supabase
          .from("nd_leave_entitlement")
          .select(`
            id, 
            contract_type_id, 
            annual_leave_day, 
            pro_rate_formula,
            contract_type:contract_type_id (id, name)
          `);

        if (entitlementsError) throw entitlementsError;
        setEntitlements(entitlementsData || []);

      } catch (error) {
        console.error("Error fetching entitlement data:", error);
        toast.error("Failed to load entitlement data");
      } finally {
        setLoading(false);
      }
    }

    if (siteId) {
      fetchData();
    }
  }, [siteId]);

  const handleEdit = (entitlement: Entitlement) => {
    setEditId(entitlement.id);
    form.reset({
      contractType: entitlement.contract_type_id,
      annualLeaveDays: entitlement.annual_leave_day,
      proRateFormula: entitlement.pro_rate_formula || "",
    });
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const { contractType, annualLeaveDays, proRateFormula } = values;

      if (editId) {
        // Update existing entitlement
        const { error } = await supabase
          .from("nd_leave_entitlement")
          .update({
            contract_type_id: contractType,
            annual_leave_day: annualLeaveDays,
            pro_rate_formula: proRateFormula || null,
            updated_by: (await supabase.auth.getUser()).data.user?.id,
          })
          .eq("id", editId);

        if (error) throw error;
        toast.success("Entitlement updated successfully");
      } else {
        // Create new entitlement
        const { error } = await supabase
          .from("nd_leave_entitlement")
          .insert({
            contract_type_id: contractType,
            annual_leave_day: annualLeaveDays,
            pro_rate_formula: proRateFormula || null,
            created_by: (await supabase.auth.getUser()).data.user?.id,
          });

        if (error) throw error;
        toast.success("Entitlement added successfully");
      }

      // Reset form and refresh data
      form.reset({
        contractType: "",
        annualLeaveDays: 0,
        proRateFormula: "",
      });
      setEditId(null);
      
      // Refresh the entitlements list
      const { data, error } = await supabase
        .from("nd_leave_entitlement")
        .select(`
          id, 
          contract_type_id, 
          annual_leave_day, 
          pro_rate_formula,
          contract_type:contract_type_id (id, name)
        `);
      
      if (error) throw error;
      setEntitlements(data || []);

    } catch (error) {
      console.error("Error saving entitlement:", error);
      toast.error("Failed to save entitlement");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{editId ? "Edit Entitlement" : "Add New Entitlement"}</CardTitle>
          <CardDescription>
            Configure leave entitlement days for different contract types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="contractType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contract Type</FormLabel>
                      <FormControl>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="">Select contract type</option>
                          {contractTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="annualLeaveDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Leave Days</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="proRateFormula"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-2">
                      <FormLabel>Pro Rate Formula (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Formula used to calculate prorated leave for partial years (e.g., "days/12*months_worked")
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end gap-2">
                {editId && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setEditId(null);
                      form.reset({
                        contractType: "",
                        annualLeaveDays: 0,
                        proRateFormula: "",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                )}
                <Button type="submit">
                  {editId ? "Update Entitlement" : "Add Entitlement"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leave Entitlements</CardTitle>
          <CardDescription>
            Overview of leave entitlements by contract type
          </CardDescription>
        </CardHeader>
        <CardContent>
          {entitlements.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract Type</TableHead>
                  <TableHead>Annual Leave Days</TableHead>
                  <TableHead>Pro Rate Formula</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entitlements.map((entitlement) => (
                  <TableRow key={entitlement.id}>
                    <TableCell>{entitlement.contract_type?.name}</TableCell>
                    <TableCell>{entitlement.annual_leave_day}</TableCell>
                    <TableCell>{entitlement.pro_rate_formula || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEdit(entitlement)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex justify-center items-center h-32 bg-muted/20 rounded-lg border border-dashed">
              <p className="text-muted-foreground">No entitlements configured yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
