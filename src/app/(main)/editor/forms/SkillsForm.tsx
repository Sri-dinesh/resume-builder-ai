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
import { useEffect, useMemo, useRef } from "react";
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
  // const predefinedSkills = [
  //   "JavaScript",
  //   "Python",
  //   "Java",
  //   "C#",
  //   "C++",
  //   "TypeScript",
  //   "Go",
  //   "Swift",
  //   "Kotlin",
  //   "PHP",
  //   "Ruby",
  //   "Rust",
  //   "Dart",
  //   "SQL",
  //   "C",
  //   "Objective-C",
  //   "R",
  //   "Haskell",
  //   "Elixir",
  //   "Assembly",
  // ];

  const predefinedSkills = useMemo(() => {
    const jobTitle = resumeData.jobTitle?.toLowerCase() || "";

    // Frontend Developer
    if (
      jobTitle.includes("frontend") ||
      jobTitle.includes("ui") ||
      jobTitle.includes("react") ||
      jobTitle.includes("front-end")
    ) {
      return [
        "React.js",
        "Vue.js",
        "Angular",
        "Next.js",
        "Svelte",
        "HTML5",
        "CSS3",
        "Tailwind CSS",
        "Bootstrap",
        "JavaScript",
        "TypeScript",
        "Redux",
        "GraphQL",
        "RESTful APIs",
        "Webpack",
        "Vite",
        "Figma",
        "Storybook",
        "Jest",
        "Cypress",
      ];
    }

    // Backend Developer
    if (
      jobTitle.includes("backend") ||
      jobTitle.includes("node") ||
      jobTitle.includes("api") ||
      jobTitle.includes("back-end")
    ) {
      return [
        "Node.js",
        "Express",
        "NestJS",
        "Django",
        "Flask",
        "Ruby on Rails",
        "Spring Boot",
        "MongoDB",
        "PostgreSQL",
        "MySQL",
        "Redis",
        "GraphQL",
        "RESTful APIs",
        "OAuth",
        "JWT",
        "Microservices",
        "Docker",
        "Kubernetes",
        "AWS",
        "Azure",
        "Google Cloud",
        "Python",
        "Java",
        "C#",
        "Go",
        "PHP",
      ];
    }

    // Fullstack Developer
    if (jobTitle.includes("fullstack") || jobTitle.includes("full-stack")) {
      return [
        "React.js",
        "Vue.js",
        "Angular",
        "Node.js",
        "Express",
        "NestJS",
        "MongoDB",
        "PostgreSQL",
        "MySQL",
        "GraphQL",
        "RESTful APIs",
        "JavaScript",
        "TypeScript",
        "Redux",
        "Tailwind CSS",
        "Bootstrap",
        "Docker",
        "Kubernetes",
        "AWS",
        "Git",
        "CI/CD",
        "Microservices",
      ];
    }

    // DevOps Engineer
    if (
      jobTitle.includes("devops") ||
      jobTitle.includes("site reliability") ||
      jobTitle.includes("sre")
    ) {
      return [
        "Docker",
        "Kubernetes",
        "Jenkins",
        "Terraform",
        "Ansible",
        "AWS",
        "Azure",
        "Google Cloud",
        "CI/CD",
        "Bash Scripting",
        "Linux",
        "Monitoring Tools",
        "Prometheus",
        "Grafana",
        "ELK Stack",
        "Infrastructure as Code",
        "Git",
        "Python",
        "Shell Scripting",
      ];
    }

    // Data Scientist / Machine Learning Engineer
    if (
      jobTitle.includes("data scientist") ||
      jobTitle.includes("machine learning") ||
      jobTitle.includes("ml engineer")
    ) {
      return [
        "Python",
        "R",
        "Pandas",
        "NumPy",
        "Scikit-learn",
        "TensorFlow",
        "PyTorch",
        "Keras",
        "Jupyter Notebook",
        "SQL",
        "Data Visualization",
        "Tableau",
        "Power BI",
        "Statistics",
        "Machine Learning Algorithms",
        "Deep Learning",
        "Natural Language Processing",
        "AWS SageMaker",
        "Azure ML",
      ];
    }

    // Mobile App Developer
    if (
      jobTitle.includes("mobile") ||
      jobTitle.includes("ios") ||
      jobTitle.includes("android") ||
      jobTitle.includes("flutter") ||
      jobTitle.includes("react native")
    ) {
      return [
        "Swift",
        "Kotlin",
        "Java",
        "Flutter",
        "React Native",
        "Xcode",
        "Android Studio",
        "Firebase",
        "UI/UX Design",
        "RESTful APIs",
        "GraphQL",
        "Dart",
        "Objective-C",
        "SQLite",
        "Mobile App Testing",
        "App Store Deployment",
        "Play Store Deployment",
      ];
    }

    // Marketing Specialist
    if (
      jobTitle.includes("marketing") ||
      jobTitle.includes("digital marketing") ||
      jobTitle.includes("content creator")
    ) {
      return [
        "SEO",
        "SEM",
        "Google Analytics",
        "Social Media Marketing",
        "Content Writing",
        "Copywriting",
        "Email Marketing",
        "CRM Tools",
        "HubSpot",
        "Hootsuite",
        "Facebook Ads",
        "Instagram Ads",
        "Google Ads",
        "A/B Testing",
        "Marketing Automation",
        "Brand Strategy",
        "Public Relations",
      ];
    }

    // Sales Representative
    if (
      jobTitle.includes("sales") ||
      jobTitle.includes("account executive") ||
      jobTitle.includes("business development")
    ) {
      return [
        "Salesforce",
        "Lead Generation",
        "Negotiation Skills",
        "Relationship Building",
        "Cold Calling",
        "CRM Tools",
        "Sales Pipeline Management",
        "Customer Retention",
        "Presentation Skills",
        "Proposal Writing",
        "Market Research",
        "Client Onboarding",
        "Upselling",
        "Cross-Selling",
        "Sales Forecasting",
      ];
    }

    // Human Resources (HR)
    if (
      jobTitle.includes("human resources") ||
      jobTitle.includes("hr") ||
      jobTitle.includes("recruiter")
    ) {
      return [
        "Talent Acquisition",
        "Onboarding Process",
        "Employee Engagement",
        "Performance Management",
        "Workplace Diversity",
        "HR Policies",
        "Conflict Resolution",
        "Recruitment Tools",
        "LinkedIn Recruiter",
        "Interviewing Skills",
        "Payroll Management",
        "Benefits Administration",
        "Compliance",
        "Training & Development",
        "Exit Interviews",
      ];
    }

    // Finance and Accounting
    if (
      jobTitle.includes("finance") ||
      jobTitle.includes("accountant") ||
      jobTitle.includes("financial analyst")
    ) {
      return [
        "Financial Reporting",
        "Budgeting",
        "Forecasting",
        "Tax Preparation",
        "Bookkeeping",
        "QuickBooks",
        "Excel",
        "Financial Analysis",
        "Cash Flow Management",
        "Risk Management",
        "Investment Analysis",
        "GAAP",
        "IFRS",
        "Auditing",
        "ERP Systems",
      ];
    }

    // Project Manager
    if (
      jobTitle.includes("project manager") ||
      jobTitle.includes("scrum master") ||
      jobTitle.includes("program manager")
    ) {
      return [
        "Agile Methodology",
        "Scrum Framework",
        "Kanban",
        "Jira",
        "Trello",
        "Project Planning",
        "Stakeholder Management",
        "Risk Management",
        "Resource Allocation",
        "Timeline Management",
        "Budgeting",
        "Communication Skills",
        "Leadership",
        "Team Coordination",
        "Problem Solving",
      ];
    }

    // Customer Support
    if (
      jobTitle.includes("customer support") ||
      jobTitle.includes("customer service") ||
      jobTitle.includes("support agent")
    ) {
      return [
        "Ticketing Systems",
        "Zendesk",
        "Intercom",
        "Live Chat Support",
        "Phone Support",
        "Email Support",
        "Troubleshooting",
        "Empathy",
        "Active Listening",
        "Problem Solving",
        "Conflict Resolution",
        "Product Knowledge",
        "Time Management",
        "Multitasking",
        "Feedback Collection",
      ];
    }

    // Operations Manager
    if (
      jobTitle.includes("operations manager") ||
      jobTitle.includes("operations coordinator")
    ) {
      return [
        "Process Optimization",
        "Supply Chain Management",
        "Logistics",
        "Inventory Management",
        "Vendor Management",
        "Quality Assurance",
        "Lean Six Sigma",
        "Operational Strategy",
        "Team Leadership",
        "Performance Metrics",
        "Problem Solving",
        "Decision Making",
        "ERP Systems",
        "Data Analysis",
        "Reporting",
      ];
    }

    // Default Skills List
    return [
      "Communication",
      "Problem Solving",
      "Teamwork",
      "Time Management",
      "Adaptability",
      "Leadership",
      "Attention to Detail",
      "Organization",
      "Creativity",
      "Critical Thinking",
      "Decision Making",
      "Negotiation",
      "Public Speaking",
      "Conflict Resolution",
      "Collaboration",
    ];
  }, [resumeData.jobTitle]);

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
                      field.onChange(
                        e.target.value
                          .replace(/[^a-zA-Z0-9\s.,+#&/-]/g, "") // allow letters, numbers, spaces, ., ,, +, #, &, -, /
                          .substring(0, 200) // max length 200 chars
                          .trim(), // remove leading/trailing spaces
                      );
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
