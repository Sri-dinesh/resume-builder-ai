// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Textarea } from "@/components/ui/textarea";
// import { EditorFormProps } from "@/lib/types";
// import { summarySchema, SummaryValues } from "@/lib/validation";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import GenerateSummaryButton from "./GenerateSummaryButton";

// export default function SummaryForm({
//   resumeData,
//   setResumeData,
// }: EditorFormProps) {
//   const form = useForm<SummaryValues>({
//     resolver: zodResolver(summarySchema),
//     defaultValues: {
//       summary: resumeData.summary || "",
//     },
//   });

//   useEffect(() => {
//     const { unsubscribe } = form.watch(async (values) => {
//       const isValid = await form.trigger();
//       if (!isValid) return;
//       setResumeData({ ...resumeData, ...values });
//     });
//     return unsubscribe;
//   }, [form, resumeData, setResumeData]);

//   return (
//     <div className="mx-auto max-w-xl space-y-6">
//       <div className="space-y-1.5 text-center">
//         <h2 className="text-2xl font-semibold">Professional summary</h2>
//         <p className="text-sm text-muted-foreground">
//           Write a short introduction for your resume or let the AI generate one
//           from your entered data.
//         </p>
//       </div>
//       <Form {...form}>
//         <form className="space-y-3">
//           <FormField
//             control={form.control}
//             name="summary"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="sr-only">Professional summary</FormLabel>
//                 <FormControl>
//                   <Textarea
//                     {...field}
//                     placeholder="A brief, engaging text about yourself"
//                   />
//                 </FormControl>
//                 <FormMessage />
//                 <GenerateSummaryButton
//                   resumeData={resumeData}
//                   onSummaryGenerated={(summary) =>
//                     form.setValue("summary", summary)
//                   }
//                 />
//               </FormItem>
//             )}
//           />
//         </form>
//       </Form>
//     </div>
//   );
// }

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/lib/types";
import { summarySchema, SummaryValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

export default function SummaryForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const form = useForm<SummaryValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      summary: resumeData.summary || "",
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setResumeData({ ...resumeData, ...values });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

  // Function to generate dynamic summary suggestions
  const generateSummarySuggestions = () => {
    const { jobTitle, workExperiences, projects, skills } = resumeData;

    // Helper function to extract key details
    const getWorkExperienceDetails = () => {
      if (!workExperiences?.length) return "";
      const latestExperience = workExperiences[0];
      return `${latestExperience.position} at ${latestExperience.company}`;
    };

    const getProjectDetails = () => {
      if (!projects?.length) return "";
      const latestProject = projects[0];
      return `${latestProject.ProjectName}: ${latestProject.description}`;
    };

    const getSkillDetails = () => {
      if (!skills?.length) return "";
      return skills.slice(0, 3).join(", ");
    };

    // still need to work on this feature
    // Generate three dynamic suggestions
    const suggestion1 = `Results-driven ${jobTitle || "professional"} with expertise in ${
      skills?.length ? getSkillDetails() : "various technologies"
    }. Proven track record of delivering impactful solutions, including ${getWorkExperienceDetails()}.`;

    const suggestion2 = `Detail-oriented ${jobTitle || "professional"} skilled in ${
      skills?.length ? getSkillDetails() : "key areas"
    }. Passionate about driving innovation, as demonstrated in projects like ${getProjectDetails()}.`;

    const suggestion3 = `Adaptable ${jobTitle || "professional"} with a strong foundation in ${
      skills?.length ? getSkillDetails() : "relevant domains"
    }. Adept at collaborating with teams to achieve goals, such as ${getWorkExperienceDetails()}.`;

    return [suggestion1, suggestion2, suggestion3];
  };

  const summarySuggestions = generateSummarySuggestions();

  // State to manage expanded suggestion
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Function to handle selecting a suggestion
  const handleSuggestionClick = (suggestion: string) => {
    form.setValue("summary", suggestion);
    setExpandedIndex(null); // Collapse after selection
  };

  // Reference to the textarea element
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Function to auto-resize the textarea
  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height to recalculate
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height to scrollHeight
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Professional summary</h2>
        <p className="text-sm text-muted-foreground">
          Choose one of the suggested summaries or write your own.
        </p>
      </div>

      {/* Suggested Summaries */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Suggestions:</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {summarySuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="relative cursor-pointer rounded-md border p-4 shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              {/* Preview of the suggestion */}
              <p
                className={`text-left text-sm text-gray-700 dark:text-gray-300 ${
                  expandedIndex === index ? "line-clamp-none" : "line-clamp-3"
                }`}
              >
                {suggestion}
              </p>

              {/* Expand/Collapse Button */}
              <button
                onClick={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
                className="mt-2 text-xs font-medium text-primary hover:underline"
              >
                {expandedIndex === index ? "Show Less" : "Show More"}
              </button>

              {/* Select Button */}
              {expandedIndex === index && (
                <button
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="absolute bottom-2 right-2 rounded-md bg-primary px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-primary/90"
                >
                  Use This
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Professional summary</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    ref={(el) => {
                      textareaRef.current = el; // Assign ref
                      autoResizeTextarea(); // Resize on initial render
                    }}
                    placeholder="A brief, engaging text about yourself"
                    className="transition-height resize-none overflow-hidden duration-200"
                    onChange={(e) => {
                      field.onChange(e); // Update form state
                      autoResizeTextarea(); // Resize on input change
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
