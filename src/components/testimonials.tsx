"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    quote:
      "Thanks to this AI resume builder, I landed my dream job at a top tech company. The ATS-friendly and AI suggestions made all the difference.",
    author: "David Chen",
    title: "Software Engineer",
    company: "Tech Giant Corp",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    quote:
      "As a career coach, I recommend this platform to all my clients. The AI-powered content suggestions are spot-on and save hours of work.",
    author: "Sarah Thompson",
    title: "Career Coach",
    company: "Career Accelerator",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    quote:
      "The resume I created got me interviews at multiple Fortune 500 companies. The AI helped me highlight my achievements perfectly.",
    author: "James Wilson",
    title: "Marketing Director",
    company: "Global Brands Inc",
    image: "/placeholder.svg?height=100&width=100",
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevTestimonial = useCallback(() => {
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  }, []);

  return (
    <section
      id="testimonials"
      className="bg-muted/30 py-20 md:py-32"
      aria-labelledby="testimonials-heading"
    >
      <div className="container px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2
            id="testimonials-heading"
            className="mb-4 text-3xl font-bold md:text-4xl"
          >
            What Our Users Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of professionals who have transformed their careers
            with our platform
          </p>
        </motion.div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-8">
          {/* Navigation buttons */}
          <div className="absolute left-0 top-1/2 z-10 -translate-y-1/2">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full bg-background/80 shadow-md backdrop-blur-sm hover:bg-background"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>

          <div className="absolute right-0 top-1/2 z-10 -translate-y-1/2">
            <Button
              variant="ghost"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full bg-background/80 shadow-md backdrop-blur-sm hover:bg-background"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>

          {/* Testimonial slider */}
          <div className="overflow-hidden" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-primary/10 shadow-lg">
                  <CardContent className="p-4 sm:p-8">
                    {/* <div className="absolute top-0 right-0 w-20 h-20 opacity-5" aria-hidden="true">
                      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M3 21C3 16.0294 7.02944 12 12 12C16.9706 12 21 16.0294 21 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div> */}
                    {/* <div className="absolute bottom-4 left-4 w-16 h-16 opacity-5" aria-hidden="true">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M15.5 9H15.51M8.5 9H8.51M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8.5 9C8.5 9.27614 8.27614 9.5 8 9.5C7.72386 9.5 7.5 9.27614 7.5 9C7.5 8.72386 7.72386 8.5 8 8.5C8.27614 8.5 8.5 8.72386 8.5 9Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15.5 9C15.5 9.27614 15.2761 9.5 15 9.5C14.7239 9.5 14.5 9.27614 14.5 9C14.5 8.72386 14.7239 8.5 15 8.5C15.2761 8.5 15.5 8.72386 15.5 9Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 17C13.6569 17 15 15.6569 15 14H9C9 15.6569 10.3431 17 12 17Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div> */}
                    <div className="flex flex-col items-center gap-6 md:flex-row">
                      <div className="flex-shrink-0">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-primary/20 sm:h-20 sm:w-20"
                        >
                          <Image
                            src={
                              testimonials[activeIndex].image ||
                              "/placeholder.svg"
                            }
                            alt={`${testimonials[activeIndex].author} profile picture`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 64px, 80px"
                          />
                        </motion.div>
                      </div>

                      <div className="flex-1 text-center md:text-left">
                        <Quote
                          className="mx-auto mb-2 h-6 w-6 text-primary/20 sm:mb-4 sm:h-8 sm:w-8 md:mx-0"
                          aria-hidden="true"
                        />
                        <p className="mb-4 text-base italic sm:text-lg">
                          "{testimonials[activeIndex].quote}"
                        </p>
                        <div>
                          <p className="font-semibold">
                            {testimonials[activeIndex].author}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {testimonials[activeIndex].title},{" "}
                            {testimonials[activeIndex].company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots indicator */}
          <div
            className="mt-6 flex justify-center space-x-2"
            role="tablist"
            aria-label="Testimonial navigation"
          >
            {testimonials.map((testimonial, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveIndex(index);
                }}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === activeIndex
                    ? "bg-primary"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
                role="tab"
                aria-selected={index === activeIndex}
                aria-controls={`testimonial-panel-${index}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
