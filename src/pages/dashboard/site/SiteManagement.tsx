
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { SiteFormDialog } from "@/components/site/SiteFormDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Copy, Edit, Trash2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useSites,
  useToggleSiteActiveStatus,
  useDeleteSite,
} from "@/components/site/queries/use-sites";
import {
  toggleSiteActiveStatus,
  deleteSite,
  Site,
} from "@/components/site/hook/site-utils";
import { useDebounce } from "@/hooks/use-debounce";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { exportSitesAsCSV } from "@/utils/export-utils";
import ClosurePage from "@/components/site/component/ClosurePage";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

interface SiteManagementProps { }

const SiteManagement: React.FC<SiteManagementProps> = () => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editDialogData, setEditDialogData] = useState<Site | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const {
    data: sites = [],
    isLoading,
    isError,
    error,
    refetch: refetchData,
  } = useSites(debouncedSearch);

  const {
    mutate: toggleActiveStatus,
    isPending: isToggleLoading,
    isError: isToggleError,
    error: toggleError,
  } = useToggleSiteActiveStatus();

  const {
    mutate: deleteSiteMutation,
    isPending: isDeleteLoading,
    isError: isDeleteError,
    error: deleteError,
  } = useDeleteSite();

  const clearEditData = () => {
    setEditDialogData(null);
  };

  const handleEdit = (site: Site) => {
    setEditDialogData(site);
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (siteId: string) => {
    try {
      await deleteSiteMutation(siteId);
      toast({
        title: "Success",
        description: "Site deleted successfully.",
      });
      refetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete site. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (siteId: string, active: boolean) => {
    try {
      await toggleActiveStatus({ siteId, active });
      toast({
        title: "Success",
        description: `Site ${active ? "deactivated" : "activated"} successfully.`,
      });
      refetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle active status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<Site>[] = [
    {
      accessorKey: "sitename",
      header: "Site Name",
    },
    {
      accessorKey: "nd_site.standard_code",
      header: "Site Code",
      cell: ({ row }) => row.original.nd_site?.[0]?.standard_code,
    },
    {
      accessorKey: "nd_phases.name",
      header: "Phase",
      cell: ({ row }) => row.original.nd_phases?.name,
    },
    {
      accessorKey: "nd_region.eng",
      header: "Region",
      cell: ({ row }) => row.original.nd_region?.eng,
    },
    {
      accessorKey: "nd_site_address.state_id",
      header: "State",
      cell: ({ row }) => row.original.nd_site_address?.[0]?.state_id,
    },
    {
      accessorKey: "nd_site_status.eng",
      header: "Status",
      cell: ({ row }) => row.original.nd_site_status?.eng,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const site = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleEdit(site)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleToggleActive(site.id, site.active_status === 1)
                }
              >
                {site.active_status === 1 ? (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" /> Deactivate
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" /> Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem>
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete
                        the site from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(site.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Find the problematic export function call and update it
  const handleExportCSV = () => {
    const csvContent = exportSitesAsCSV(sites || []);

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "sites.csv");
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <Card className="overflow-hidden border-none shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Site Management</CardTitle>
          <div className="flex space-x-2">
            <Input
              placeholder="Search sites..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Site
            </Button>
            <Button onClick={handleExportCSV}>Export CSV</Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-4">
              <Skeleton className="h-8 w-[200px]" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : isError ? (
            <p className="text-red-500">Error: {error?.message}</p>
          ) : (
            <DataTable columns={columns} data={sites || []} />
          )}
        </CardContent>
      </Card>

      <SiteFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        site={editDialogData}
      />
      <ClosurePage siteId={""} />
    </DashboardLayout>
  );
};

export default SiteManagement;
