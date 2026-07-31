"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FontSelector } from "@/components/editor/FontSelector";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { resumeSchema } from "@/lib/resume/validation";
import type { ResumeValues } from "@/lib/resume/validation";

interface ResumeFormProps {
  defaultValues?: Partial<ResumeValues>;
  onSubmit: (values: ResumeValues) => Promise<void>;
}

export default function ResumeForm({
  defaultValues,
  onSubmit,
}: ResumeFormProps) {
  const form = useForm<ResumeValues>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      fontFamily: "Arial",
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          void form.handleSubmit(onSubmit)(event);
        }}
        className="space-y-8"
      >
        {/* Font Selector */}
        <FormField
          control={form.control}
          name="fontFamily"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Font Style</FormLabel>
              <FormControl>
                <FontSelector
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Add other form fields here */}

        <Button type="submit">Save Resume</Button>
      </form>
    </Form>
  );
}
