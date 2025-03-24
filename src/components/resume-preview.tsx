// "use client"

// import { useState } from "react"
// import { motion } from "framer-motion"
// import { Button } from "@/components/ui/button"
// import { ArrowLeft, ArrowRight } from "lucide-react"
// import Image from "next/image"
// import { useTheme } from "next-themes"

// const templates = [
//   {
//     id: "modern",
//     name: "Modern",
//     description: "Clean and contemporary design with a focus on skills and experience.",
//     imageDark: "/placeholder.svg?height=600&width=400&text=Modern+Template+(Dark)",
//     imageLight: "/placeholder.svg?height=600&width=400&text=Modern+Template+(Light)",
//   },
//   {
//     id: "professional",
//     name: "Professional",
//     description: "Traditional layout perfect for corporate and executive positions.",
//     imageDark: "/placeholder.svg?height=600&width=400&text=Professional+Template+(Dark)",
//     imageLight: "/placeholder.svg?height=600&width=400&text=Professional+Template+(Light)",
//   },
//   {
//     id: "creative",
//     name: "Creative",
//     description: "Bold design for creative fields like design, marketing, and media.",
//     imageDark: "/placeholder.svg?height=600&width=400&text=Creative+Template+(Dark)",
//     imageLight: "/placeholder.svg?height=600&width=400&text=Creative+Template+(Light)",
//   },
// ]

// export default function ResumePreview() {
//   const [activeIndex, setActiveIndex] = useState(0)
//   const { theme } = useTheme()

//   const nextTemplate = () => {
//     setActiveIndex((prev) => (prev + 1) % templates.length)
//   }

//   const prevTemplate = () => {
//     setActiveIndex((prev) => (prev - 1 + templates.length) % templates.length)
//   }

//   const activeTemplate = templates[activeIndex]

//   return (
//     <section id="templates" className="py-20 md:py-32 bg-muted/30" aria-labelledby="templates-heading">
//       <div className="container px-4 sm:px-6 lg:px-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="text-center max-w-3xl mx-auto mb-16"
//         >
//           <h2 id="templates-heading" className="text-3xl md:text-4xl font-bold mb-4">
//             Professional Resume Templates
//           </h2>
//           <p className="text-muted-foreground text-lg">
//             Choose from our collection of ATS-friendly templates designed to impress employers
//           </p>
//         </motion.div>

//         <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
//           {/* Template preview */}
//           <motion.div
//             className="flex-1 relative w-full max-w-md mx-auto"
//             initial={{ opacity: 0, scale: 0.9 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             viewport={{ once: true }}
//             key={activeTemplate.id}
//           >
//             <div className="relative max-w-md mx-auto">
//               <div
//                 className="absolute -z-10 -right-4 top-1/4 w-20 h-28 border-2 border-dashed border-primary/20 rounded-md rotate-6"
//                 aria-hidden="true"
//               ></div>
//               <div
//                 className="absolute -z-10 -left-6 bottom-1/3 w-16 h-24 border-2 border-dashed border-violet-500/20 rounded-md -rotate-3"
//                 aria-hidden="true"
//               ></div>
//               <motion.div
//                 initial={{ y: 10, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 exit={{ y: -10, opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="relative rounded-lg shadow-xl overflow-hidden border border-primary/20"
//               >
//                 <Image
//                   src={theme === "dark" ? activeTemplate.imageDark : activeTemplate.imageLight}
//                   width={400}
//                   height={600}
//                   alt={`${activeTemplate.name} Resume Template Preview`}
//                   className="w-full h-auto"
//                   loading="eager"
//                   priority={activeIndex === 0}
//                 />

//                 {/* Gradient overlay */}
//                 <div
//                   className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-violet-500/10 dark:to-indigo-500/10 opacity-60"
//                   aria-hidden="true"
//                 />
//               </motion.div>

//               {/* Decorative elements */}
//               <div
//                 className="absolute -z-10 -bottom-10 -right-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl"
//                 aria-hidden="true"
//               ></div>
//               <div
//                 className="absolute -z-10 -top-10 -left-10 w-40 h-40 rounded-full bg-violet-500/10 dark:bg-indigo-500/10 blur-3xl"
//                 aria-hidden="true"
//               ></div>
//             </div>
//           </motion.div>

//           {/* Template info */}
//           <div className="flex-1">
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               className="max-w-md mx-auto relative"
//             >
//               <div
//                 className="absolute -z-10 right-0 top-0 w-12 h-12 bg-primary/5 rounded-full blur-xl"
//                 aria-hidden="true"
//               ></div>
//               <div
//                 className="absolute -z-10 left-10 bottom-10 w-16 h-16 bg-violet-500/5 rounded-full blur-xl"
//                 aria-hidden="true"
//               ></div>
//               <h3 className="text-2xl font-bold mb-2">{activeTemplate.name}</h3>
//               <p className="text-muted-foreground mb-6">{activeTemplate.description}</p>

//               <div className="flex items-center justify-between mb-8">
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   onClick={prevTemplate}
//                   className="rounded-full"
//                   aria-label="Previous template"
//                 >
//                   <ArrowLeft className="h-4 w-4" aria-hidden="true" />
//                 </Button>

//                 <div className="flex space-x-2" role="tablist" aria-label="Template navigation">
//                   {templates.map((template, index) => (
//                     <button
//                       key={template.id}
//                       onClick={() => setActiveIndex(index)}
//                       className={`w-2 h-2 rounded-full transition-colors ${
//                         index === activeIndex ? "bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
//                       }`}
//                       aria-label={`Go to template ${index + 1}`}
//                       role="tab"
//                       aria-selected={index === activeIndex}
//                       aria-controls={`template-panel-${template.id}`}
//                     />
//                   ))}
//                 </div>

//                 <Button
//                   variant="outline"
//                   size="icon"
//                   onClick={nextTemplate}
//                   className="rounded-full"
//                   aria-label="Next template"
//                 >
//                   <ArrowRight className="h-4 w-4" aria-hidden="true" />
//                 </Button>
//               </div>

//               <Button
//                 className="w-full bg-gradient-to-r from-primary to-violet-600 dark:to-indigo-500 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
//                 aria-describedby="template-description"
//               >
//                 Use This Template
//               </Button>
//               <p id="template-description" className="sr-only">
//                 Use the {activeTemplate.name} template to create your resume
//               </p>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";

const templates = [
  {
    id: "modern",
    name: "Modern",
    description:
      "Clean and contemporary design with a focus on skills and experience.",
    imageDark:
      "/placeholder.svg?height=600&width=400&text=Modern+Template+(Dark)",
    imageLight:
      "/placeholder.svg?height=600&width=400&text=Modern+Template+(Light)",
  },
  {
    id: "professional",
    name: "Professional",
    description:
      "Traditional layout perfect for corporate and executive positions.",
    imageDark:
      "/placeholder.svg?height=600&width=400&text=Professional+Template+(Dark)",
    imageLight:
      "/placeholder.svg?height=600&width=400&text=Professional+Template+(Light)",
  },
  {
    id: "creative",
    name: "Creative",
    description:
      "Bold design for creative fields like design, marketing, and media.",
    imageDark:
      "/placeholder.svg?height=600&width=400&text=Creative+Template+(Dark)",
    imageLight:
      "/placeholder.svg?height=600&width=400&text=Creative+Template+(Light)",
  },
];

export default function ResumePreview() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensures that the theme is only accessed after the component mounts on the client side
  useEffect(() => {
    setMounted(true);
  }, []);

  const nextTemplate = () => {
    setActiveIndex((prev) => (prev + 1) % templates.length);
  };

  const prevTemplate = () => {
    setActiveIndex((prev) => (prev - 1 + templates.length) % templates.length);
  };

  const activeTemplate = templates[activeIndex];

  if (!mounted) {
    return null; // Or a loading indicator, to avoid hydration mismatch during SSR
  }

  return (
    <section
      id="templates"
      className="bg-muted/30 py-20 md:py-32"
      aria-labelledby="templates-heading"
    >
      <div className="container px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2
            id="templates-heading"
            className="mb-4 text-3xl font-bold md:text-4xl"
          >
            Professional Resume Templates
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose from our collection of ATS-friendly templates designed to
            impress employers
          </p>
        </motion.div>

        <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
          {/* Template preview */}
          <motion.div
            className="relative mx-auto w-full max-w-md flex-1"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            key={activeTemplate.id}
          >
            <div className="relative mx-auto max-w-md">
              <div
                className="absolute -right-4 top-1/4 -z-10 h-28 w-20 rotate-6 rounded-md border-2 border-dashed border-primary/20"
                aria-hidden="true"
              ></div>
              <div
                className="absolute -left-6 bottom-1/3 -z-10 h-24 w-16 -rotate-3 rounded-md border-2 border-dashed border-violet-500/20"
                aria-hidden="true"
              ></div>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative overflow-hidden rounded-lg border border-primary/20 shadow-xl"
              >
                <Image
                  src={
                    theme === "dark"
                      ? activeTemplate.imageDark
                      : activeTemplate.imageLight
                  }
                  width={400}
                  height={600}
                  alt={`${activeTemplate.name} Resume Template Preview`}
                  className="h-auto w-full"
                  loading="eager"
                  priority={activeIndex === 0}
                />

                {/* Gradient overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-violet-500/10 opacity-60 dark:to-indigo-500/10"
                  aria-hidden="true"
                />
              </motion.div>

              {/* Decorative elements */}
              {/* <div
                className="absolute -bottom-10 -right-10 -z-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
                aria-hidden="true"
              ></div> */}
              {/* <div
                className="absolute -left-10 -top-10 -z-10 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl dark:bg-indigo-500/10"
                aria-hidden="true"
              ></div> */}
            </div>
          </motion.div>

          {/* Template info */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative mx-auto max-w-md"
            >
              <div
                className="absolute right-0 top-0 -z-10 h-12 w-12 rounded-full bg-primary/5 blur-xl"
                aria-hidden="true"
              ></div>
              <div
                className="absolute bottom-10 left-10 -z-10 h-16 w-16 rounded-full bg-violet-500/5 blur-xl"
                aria-hidden="true"
              ></div>
              <h3 className="mb-2 text-2xl font-bold">{activeTemplate.name}</h3>
              <p className="mb-6 text-muted-foreground">
                {activeTemplate.description}
              </p>

              <div className="mb-8 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevTemplate}
                  className="rounded-full"
                  aria-label="Previous template"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </Button>

                <div
                  className="flex space-x-2"
                  role="tablist"
                  aria-label="Template navigation"
                >
                  {templates.map((template, index) => (
                    <button
                      key={template.id}
                      onClick={() => setActiveIndex(index)}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        index === activeIndex
                          ? "bg-primary"
                          : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      }`}
                      aria-label={`Go to template ${index + 1}`}
                      role="tab"
                      aria-selected={index === activeIndex}
                      aria-controls={`template-panel-${template.id}`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextTemplate}
                  className="rounded-full"
                  aria-label="Next template"
                >
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-primary to-violet-600 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:to-indigo-500"
                aria-describedby="template-description"
              >
                Use This Template
              </Button>
              <p id="template-description" className="sr-only">
                Use the {activeTemplate.name} template to create your resume
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
