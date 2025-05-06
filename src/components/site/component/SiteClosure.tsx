
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { useStaffSites } from '@/hooks/use-staff-sites';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface SiteClosureProps {
  // Add any props you need
}

export const SiteClosure: React.FC<SiteClosureProps> = () => {
  const { toast } = useToast();
  const { staffSites, isLoading: sitesLoading } = useStaffSites();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Fetch site closure data
  const { data: closures, isLoading: closuresLoading } = useQuery({
    queryKey: ['site-closures', selectedSite],
    queryFn: async () => {
      if (!selectedSite) return [];
      
      const { data, error } = await supabase
        .from('nd_site_closure')
        .select(`
          id,
          site_id,
          close_start,
          close_end,
          remark,
          category_id,
          subcategory_id,
          status
        `)
        .eq('site_id', selectedSite);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedSite
  });
  
  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['closure-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nd_closure_categories')
        .select('*');
      
      if (error) throw error;
      return data || [];
    }
  });
  
  // Fetch subcategories
  const { data: subcategories, isLoading: subcategoriesLoading } = useQuery({
    queryKey: ['closure-subcategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nd_closure_subcategories')
        .select(`
          id, 
          category_id,
          eng,
          bm
        `);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Handle form submission for new site closure
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      // Process and submit the form data
      toast({
        title: "Success",
        description: "Site closure has been successfully scheduled.",
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to schedule site closure. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (sitesLoading) {
    return <div>Loading sites...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Site Closures</h2>
        <Button onClick={() => setIsDialogOpen(true)}>Schedule Closure</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Select Site</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedSite || ""} onValueChange={setSelectedSite}>
              <SelectTrigger>
                <SelectValue placeholder="Select a site" />
              </SelectTrigger>
              <SelectContent>
                {staffSites && staffSites.map((site) => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.sitename}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>
      
      {selectedSite && (
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Closures</CardTitle>
          </CardHeader>
          <CardContent>
            {closuresLoading ? (
              <p>Loading closures...</p>
            ) : closures && closures.length > 0 ? (
              <div className="space-y-2">
                {closures.map((closure) => (
                  <div key={closure.id} className="p-4 border rounded-md">
                    <p><strong>Start:</strong> {new Date(closure.close_start).toLocaleDateString()}</p>
                    <p><strong>End:</strong> {new Date(closure.close_end).toLocaleDateString()}</p>
                    <p><strong>Reason:</strong> {closure.remark}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No closures scheduled for this site.</p>
            )}
          </CardContent>
        </Card>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Site Closure</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="site">Site</label>
              <Select name="site" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a site" />
                </SelectTrigger>
                <SelectContent>
                  {staffSites && staffSites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.sitename}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category">Category</label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {!categoriesLoading && categories && categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.eng}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="start_date">Start Date</label>
                <Input name="start_date" type="date" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="end_date">End Date</label>
                <Input name="end_date" type="date" required />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="remark">Reason</label>
              <Textarea name="remark" required />
            </div>
            
            <DialogFooter>
              <Button type="submit">Schedule Closure</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SiteClosure;
