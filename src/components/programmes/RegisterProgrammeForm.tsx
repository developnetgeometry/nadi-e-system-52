
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, Save, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProgrammeFormData {
  program_name: string;
  description: string;
  location_event: string;
  start_datetime: string;
  end_datetime: string;
  duration: number;
  trainer_name: string;
  category_id: number;
  subcategory_id?: number;
  program_id?: number;
  module_id?: number;
  program_mode?: number;
  is_group_event: boolean;
  total_participant: number;
  status_id: number;
}

interface RegisterProgrammeFormProps {
  programmeData?: any;
  isEditMode?: boolean;
  defaultCategoryId?: number;
}

const RegisterProgrammeForm: React.FC<RegisterProgrammeFormProps> = ({
  programmeData,
  isEditMode = false,
  defaultCategoryId
}) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [modules, setModules] = useState([]);
  const [modes, setModes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(defaultCategoryId || null);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<ProgrammeFormData>({
    defaultValues: {
      program_name: programmeData?.program_name || "",
      description: programmeData?.description || "",
      location_event: programmeData?.location_event || "",
      start_datetime: programmeData?.start_datetime || "",
      end_datetime: programmeData?.end_datetime || "",
      duration: programmeData?.duration || 0,
      trainer_name: programmeData?.trainer_name || "",
      category_id: defaultCategoryId || programmeData?.category_id || 0,
      subcategory_id: programmeData?.subcategory_id || 0,
      program_id: programmeData?.program_id || 0,
      module_id: programmeData?.module_id || 0,
      program_mode: programmeData?.program_mode || 0,
      is_group_event: programmeData?.is_group_event || false,
      total_participant: programmeData?.total_participant || 0,
      status_id: programmeData?.status_id || 1
    }
  });

  // Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const { data: categoriesData } = await supabase
          .from('nd_event_category')
          .select('*')
          .eq('is_active', true);
        setCategories(categoriesData || []);

        // Fetch statuses
        const { data: statusesData } = await supabase
          .from('nd_event_status')
          .select('*')
          .eq('is_active', true);
        setStatuses(statusesData || []);

        // Fetch program modes
        const { data: modesData } = await supabase
          .from('nd_program_mode')
          .select('*')
          .eq('is_active', true);
        setModes(modesData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (selectedCategory) {
        const { data } = await supabase
          .from('nd_event_subcategory')
          .select('*')
          .eq('category_id', selectedCategory)
          .eq('is_active', true);
        setSubcategories(data || []);
      }
    };

    fetchSubcategories();
  }, [selectedCategory]);

  const onSubmit = async (data: ProgrammeFormData) => {
    setLoading(true);
    try {
      console.log("Submitting programme data:", data);
      
      if (isEditMode && programmeData?.id) {
        const { error } = await supabase
          .from('nd_event')
          .update(data)
          .eq('id', programmeData.id);

        if (error) throw error;
        toast({ title: "Success", description: "Programme updated successfully" });
      } else {
        const { error } = await supabase
          .from('nd_event')
          .insert(data);

        if (error) throw error;
        toast({ title: "Success", description: "Programme created successfully" });
      }

      navigate('/programmes');
    } catch (error) {
      console.error("Error saving programme:", error);
      toast({
        title: "Error",
        description: "Failed to save programme",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading...</span>
      </div>
    );
  }

  const isCategoryDisabled = !!defaultCategoryId;

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information Section */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="program_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Programme Name *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter programme name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location_event"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter event location" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Categorization Section */}
          <Card>
            <CardHeader>
              <CardTitle>Categorization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(parseInt(value));
                        setSelectedCategory(parseInt(value));
                      }}
                      defaultValue={field.value?.toString()}
                      disabled={isCategoryDisabled}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category: any) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subcategory_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategory</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subcategories.map((subcategory: any) => (
                          <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Date & Time Section */}
          <Card>
            <CardHeader>
              <CardTitle>Date & Time</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_datetime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date & Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_datetime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date & Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (hours)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.5"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Participants & Instructor Section */}
          <Card>
            <CardHeader>
              <CardTitle>Participants & Instructor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="trainer_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trainer Name *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter trainer name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="total_participant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Participants</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Description Section */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Programme Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter programme description"
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Programme Status Section */}
          <Card>
            <CardHeader>
              <CardTitle>Programme Status</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="status_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statuses.map((status: any) => (
                          <SelectItem key={status.id} value={status.id.toString()}>
                            {status.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/programmes')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {isEditMode ? 'Update Programme' : 'Save Programme'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegisterProgrammeForm;
