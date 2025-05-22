
import React from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useProgrammeForm } from "./hooks/useProgrammeForm";
import { CategorySelectionFields } from "./components/CategorySelectionFields";
import { ProgrammeFormFields } from "./components/ProgrammeFormFields";

const RegisterProgrammeForm: React.FC = () => {
  const {
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
    onSubmit,
  } = useProgrammeForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <CategorySelectionFields
          form={form}
          categories={categories}
          subcategories={subcategories}
          programs={programs}
          modules={modules}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSubcategory={selectedSubcategory}
          setSelectedSubcategory={setSelectedSubcategory}
          selectedProgram={selectedProgram}
          setSelectedProgram={setSelectedProgram}
        />
        
        <ProgrammeFormFields form={form} />

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button type="submit">Register Programme</Button>
        </div>
      </form>
    </Form>
  );
};

export default RegisterProgrammeForm;
