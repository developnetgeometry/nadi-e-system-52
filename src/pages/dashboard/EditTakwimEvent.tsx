
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DateInput } from "@/components/ui/date-input";
import { format } from "date-fns";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useTakwimEvents } from "@/hooks/use-takwim-events";
import { useTakwimCategories } from "@/hooks/use-takwim-categories";

const formSchema = z.object({
  programName: z.string().min(1, { message: "Program name is required" }),
  description: z.string().optional(),
  category: z.string(),
  subcategory: z.string().optional(),
  module: z.string().optional(),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().optional(),
  location: z.string().optional(),
  capacity: z.number().int().positive().optional(),
});

const EditTakwimEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { events, updateEvent } = useTakwimEvents();
  const { categories, subcategories, modules } = useTakwimCategories();
  const [event, setEvent] = useState<any>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Filter subcategories based on selected category
  const filteredSubcategories = subcategories.filter(
    subcategory => subcategory.category_id === parseInt(selectedCategoryId)
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      programName: "",
      description: "",
      category: "",
      subcategory: "",
      module: "",
      startDate: "",
      endDate: "",
      location: "",
      capacity: undefined,
    },
  });

  // Find and set event data
  useEffect(() => {
    if (events.length > 0 && id) {
      const foundEvent = events.find(e => e.id === id);
      if (foundEvent) {
        setEvent(foundEvent);
        setSelectedCategoryId(foundEvent.category_id?.toString() || "");
        
        form.reset({
          programName: foundEvent.program_name,
          description: foundEvent.description || "",
          category: foundEvent.category_id?.toString() || "",
          subcategory: foundEvent.subcategory_id?.toString() || "",
          module: foundEvent.module_id?.toString() || "",
          startDate: foundEvent.start_datetime ? format(new Date(foundEvent.start_datetime), "yyyy-MM-dd") : "",
          endDate: foundEvent.end_datetime ? format(new Date(foundEvent.end_datetime), "yyyy-MM-dd") : "",
          location: foundEvent.location_event || "",
          capacity: foundEvent.capacity,
        });
        
        setIsLoading(false);
      }
    }
  }, [events, id, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!id) return;

    try {
      await updateEvent(id, {
        program_name: data.programName,
        description: data.description || "",
        category_id: parseInt(data.category),
        subcategory_id: data.subcategory ? parseInt(data.subcategory) : null,
        module_id: data.module ? parseInt(data.module) : null,
        start_datetime: new Date(data.startDate).toISOString(),
        end_datetime: data.endDate ? new Date(data.endDate).toISOString() : null,
        location_event: data.location || "",
        capacity: data.capacity || null,
      });

      toast({
        title: "Success",
        description: "Event updated successfully",
      });
      
      navigate("/admin/takwim");
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto max-w-3xl">
          <Card>
            <CardContent className="flex justify-center items-center h-64">
              Loading event data...
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Event</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="programName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter program name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Program description"
                          className="h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedCategoryId(value);
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id.toString()}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subcategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subcategory</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!selectedCategoryId}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select subcategory" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              {filteredSubcategories.map((subcategory) => (
                                <SelectItem
                                  key={subcategory.id}
                                  value={subcategory.id.toString()}
                                >
                                  {subcategory.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="module"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Module</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select module" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {modules.map((module) => (
                              <SelectItem
                                key={module.id}
                                value={module.id.toString()}
                              >
                                {module.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <DateInput {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <DateInput {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Event location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Maximum participants" 
                          {...field} 
                          onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => navigate("/admin/takwim")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Update Event</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EditTakwimEvent;
