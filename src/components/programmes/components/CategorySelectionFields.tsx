
import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../schemas/programme-schema";
import { Category, Subcategory, Program, Module } from "../hooks/useProgrammeForm";

interface CategorySelectionFieldsProps {
  form: UseFormReturn<FormValues>;
  categories?: Category[];
  subcategories?: Subcategory[];
  programs?: Program[];
  modules?: Module[];
  selectedCategory: string | null;
  setSelectedCategory: (value: string | null) => void;
  selectedSubcategory: string | null;
  setSelectedSubcategory: (value: string | null) => void;
  selectedProgram: string | null;
  setSelectedProgram: (value: string | null) => void;
}

export const CategorySelectionFields: React.FC<CategorySelectionFieldsProps> = ({
  form,
  categories,
  subcategories,
  programs,
  modules,
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  selectedProgram,
  setSelectedProgram,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="category_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category*</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                setSelectedCategory(value);
              }}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
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
            <FormLabel>Pillar (Sub-category)*</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                setSelectedSubcategory(value);
              }}
              value={field.value}
              disabled={!selectedCategory}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select pillar" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {subcategories?.map((subcategory) => (
                  <SelectItem key={subcategory.id} value={String(subcategory.id)}>
                    {subcategory.name}
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
        name="program_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Programme*</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                setSelectedProgram(value);
              }}
              value={field.value}
              disabled={!selectedSubcategory}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select programme" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {programs?.map((program) => (
                  <SelectItem key={program.id} value={String(program.id)}>
                    {program.name}
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
        name="module_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Module*</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={!selectedProgram}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select module" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {modules?.map((module) => (
                  <SelectItem key={module.id} value={String(module.id)}>
                    {module.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
