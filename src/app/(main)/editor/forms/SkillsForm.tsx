// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Textarea } from "@/components/ui/textarea";
// import { EditorFormProps } from "@/lib/types";
// import { skillsSchema, SkillsValues } from "@/lib/validation";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useEffect } from "react";
// import { useForm } from "react-hook-form";

// export default function SkillsForm({
//   resumeData,
//   setResumeData,
// }: EditorFormProps) {
//   const form = useForm<SkillsValues>({
//     resolver: zodResolver(skillsSchema),
//     defaultValues: {
//       skills: resumeData.skills || [],
//     },
//   });

//   useEffect(() => {
//     const { unsubscribe } = form.watch(async (values) => {
//       const isValid = await form.trigger();
//       if (!isValid) return;
//       setResumeData({
//         ...resumeData,
//         skills:
//           values.skills
//             ?.filter((skill) => skill !== undefined)
//             .map((skill) => skill.trim())
//             .filter((skill) => skill !== "") || [],
//       });
//     });
//     return unsubscribe;
//   }, [form, resumeData, setResumeData]);

//   return (
//     <div className="mx-auto max-w-xl space-y-6">
//       <div className="space-y-1.5 text-center">
//         <h2 className="text-2xl font-semibold">Skills</h2>
//         <p className="text-sm text-muted-foreground">What are you good at?</p>
//       </div>
//       <Form {...form}>
//         <form className="space-y-3">
//           <FormField
//             control={form.control}
//             name="skills"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="sr-only">Skills</FormLabel>
//                 <FormControl>
//                   <Textarea
//                     {...field}
//                     placeholder="e.g. React.js, Node.js, graphic design, ..."
//                     onChange={(e) => {
//                       const skills = e.target.value.split(",");
//                       field.onChange(skills);
//                     }}
//                   />
//                 </FormControl>
//                 <FormDescription>
//                   Separate each skill with a comma.
//                 </FormDescription>
//                 <FormMessage />
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/lib/types";
import { skillsSchema, SkillsValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

export default function SkillsForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const form = useForm<SkillsValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: resumeData.skills || [],
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setResumeData({
        ...resumeData,
        skills:
          values.skills
            ?.filter((skill) => skill !== undefined)
            .map((skill) => skill.trim())
            .filter((skill) => skill !== "") || [],
      });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

  // List of predefined programming languages
  const predefinedSkills = [
    "JavaScript",
    "Python",
    "Java",
    "C#",
    "C++",
    "TypeScript",
    "Go",
    "Swift",
    "Kotlin",
    "PHP",
    "Ruby",
    "Rust",
    "Dart",
    "SQL",
    "C",
    "Objective-C",
    "R",
    "Haskell",
    "Elixir",
    "Assembly",
  ];

  // Function to handle button clicks
  const handleSkillButtonClick = (skill: string) => {
    const currentSkills = form.getValues("skills") || [];
    const updatedSkills = [...currentSkills, skill].filter(
      (item) => item.trim() !== "",
    );
    form.setValue("skills", updatedSkills);
    autoResizeTextarea(); // Resize textarea after adding a skill
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
    <div
      className="mx-auto max-w-xl space-y-6"
      style={{
        backgroundColor: `hsl(var(--background))`,
        color: `hsl(var(--foreground))`,
      }}
    >
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Skills</h2>
        <p
          className="text-sm text-muted-foreground"
          style={{ color: `hsl(var(--muted-foreground))` }}
        >
          What are you good at?
        </p>
      </div>

      {/* Predefined Skills Buttons */}
      <div className="flex flex-wrap justify-center gap-2 text-sm">
        {predefinedSkills.map((skill, index) => (
          <button
            key={index}
            onClick={() => handleSkillButtonClick(skill)}
            className="rounded-md px-3 py-1 transition-colors"
            style={{
              backgroundColor: `hsl(var(--secondary))`,
              color: `hsl(var(--secondary-foreground))`,
              border: `1px solid hsl(var(--border))`,
            }}
          >
            {skill}
          </button>
        ))}
      </div>

      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Skills</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    ref={(el) => {
                      textareaRef.current = el; // Assign ref
                      autoResizeTextarea(); // Resize on initial render
                    }}
                    placeholder="e.g. React.js, Node.js, graphic design, ..."
                    value={field.value?.join(", ") || ""}
                    onChange={(e) => {
                      const skills = e.target.value
                        .split(",")
                        .map((s) => s.trim());
                      field.onChange(skills);
                      autoResizeTextarea(); // Resize on input change
                    }}
                    style={{
                      borderColor: `hsl(var(--border))`,
                      color: `hsl(var(--foreground))`,
                    }}
                    className="transition-height resize-none overflow-hidden duration-200"
                  />
                </FormControl>
                <FormDescription
                  style={{ color: `hsl(var(--muted-foreground))` }}
                >
                  Separate each skill with a comma.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
