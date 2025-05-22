
import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../schemas/programme-schema";

interface ProgrammeFormFieldsProps {
  form: UseFormReturn<FormValues>;
}

export const ProgrammeFormFields: React.FC<ProgrammeFormFieldsProps> = ({ form }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="program_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Programme Name*</FormLabel>
              <FormControl>
                <Input placeholder="Enter programme name" {...field} />
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
              <FormLabel>Location*</FormLabel>
              <FormControl>
                <Input placeholder="Enter location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="start_datetime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date and Time*</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="datetime-local"
                    {...field}
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
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
              <FormLabel>End Date and Time*</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="datetime-local"
                    {...field}
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="target_participant"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Participants</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter target number of participants"
                  {...field}
                />
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
                  placeholder="Enter total number of participants"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter programme description"
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
