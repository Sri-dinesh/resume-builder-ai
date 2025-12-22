"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate email format
    if (!EMAIL_REGEX.test(formData.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          firstName: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setError(result.error || "Something went wrong.");
      }
    } catch {
      setError("Failed to send the message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="container space-y-16 py-24 md:py-32">
      <div className="mx-auto max-w-[58rem] text-center">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
          Get in Touch
        </h2>
        <p className="mt-4 text-muted-foreground sm:text-lg">
          Have questions? We&apos;d love to hear from you. Send us a message and
          we&apos;ll respond as soon as possible.
        </p>
      </div>
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              suppressHydrationWarning
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">Name</Label>
                  <Input
                    id="first-name"
                    name="firstName"
                    placeholder="Enter your name"
                    value={isHydrated ? formData.firstName : ""}
                    onChange={handleChange}
                    required
                    suppressHydrationWarning
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    type="email"
                    value={isHydrated ? formData.email : ""}
                    onChange={handleChange}
                    required
                    suppressHydrationWarning
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="Enter your subject"
                  value={isHydrated ? formData.subject : ""}
                  onChange={handleChange}
                  suppressHydrationWarning
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your issues..."
                  value={isHydrated ? formData.message : ""}
                  onChange={handleChange}
                  className="min-h-[80px]"
                  required
                  suppressHydrationWarning
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              {success && (
                <p className="text-green-500">Your message has been sent!</p>
              )}
              <Button
                type="submit"
                className="group relative w-full overflow-hidden"
                disabled={loading}
              >
                <span className="relative z-10">
                  {loading ? "Sending..." : "Send Message"}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary via-violet-400 to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
