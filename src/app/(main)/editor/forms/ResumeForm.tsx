"use client";

import { FontSelector } from "@/components/FontSelector";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ResumeValues, resumeSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
