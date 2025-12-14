"use client";

import { useEffect, useState } from "react";
import { getUserResumes } from "./actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ResumeData {
  id: string;
  title: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  country: string | null;
  linkedin: string | null;
  jobTitle: string | null;
  summary: string | null;
  skills: string[];
  workExperiences: Array<{
    position: string | null;
    company: string | null;
    startDate: string | undefined;
    endDate: string | undefined;
    description: string | null;
  }>;
  educations: Array<{
    degree: string | null;
    school: string | null;
    startDate: string | undefined;
    endDate: string | undefined;
  }>;
  projects: Array<{
    ProjectName: string | null;
    description: string | null;
    toolsUsed: string | null;
  }>;
  certifications: Array<{
    certificationName: string | null;
    awardedBy: string | null;
  }>;
  updatedAt: Date;
}

interface ResumeSelectorProps {
  onSelect: (resume: ResumeData | null) => void;
}

export default function ResumeSelector({ onSelect }: ResumeSelectorProps) {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResumes() {
      try {
        const data = await getUserResumes();
        setResumes(data);
      } catch (err) {
        setError(
          "Failed to load your resumes. You can still enter details manually.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchResumes();
  }, []);

  const handleSelect = (resumeId: string) => {
    setSelectedId(resumeId);
    if (resumeId === "manual") {
      onSelect(null);
    } else {
      const resume = resumes.find((r) => r.id === resumeId);
      onSelect(resume || null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="ml-2 text-sm text-gray-500">
            Loading your resumes...
          </span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (resumes.length === 0) {
    return (
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <FileText className="h-5 w-5" />
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300">
                No saved resumes found
              </p>
              <p>Enter your details manually below or create a resume first.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Import from Saved Resume
      </label>
      <Select onValueChange={handleSelect} value={selectedId || undefined}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a resume to import data..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="manual">
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Enter details manually
            </span>
          </SelectItem>
          {resumes.map((resume) => (
            <SelectItem key={resume.id} value={resume.id}>
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                {resume.title ||
                  `${resume.firstName || ""} ${resume.lastName || ""}`.trim() ||
                  "Untitled Resume"}
                <span className="text-xs text-gray-400">
                  {new Date(resume.updatedAt).toLocaleDateString()}
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedId && selectedId !== "manual" && (
        <p className="text-xs text-green-600 dark:text-green-400">
          ✓ Resume data imported. You can modify any field below.
        </p>
      )}
    </div>
  );
}
