"use client";

import { formatDate } from "date-fns";
import { Download, MoreVertical, Printer, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { useReactToPrint } from "react-to-print";
import ResumePreview from "@/components/resume/ResumePreview";
import LoadingButton from "@/components/shared/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { mapToResumeValues } from "@/lib/utils";
import { deleteResume } from "./actions";
import type { ResumeServerData } from "@/lib/resume/types";

interface ResumeItemProps {
  resume: ResumeServerData;
  contentRef: React.Ref<HTMLDivElement>;
  className?: string;
}

export default function ResumeItem({ resume }: ResumeItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: resume.title || "Resume",
  });

  const wasUpdated = resume.updatedAt !== resume.createdAt;

  return (
    <div className="group border-border bg-card hover:border-primary/50 relative flex flex-col rounded-lg border p-4 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex flex-grow flex-col space-y-0.5 pr-3">
          <Link
            href={`/editor?resumeId=${resume.id}`}
            className="text-foreground hover:text-primary line-clamp-1 text-lg font-semibold tracking-tight transition-colors"
          >
            {resume.title || "Untitled Resume"}
          </Link>
          {resume.description && (
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {resume.description}
            </p>
          )}
          <div className="text-muted-foreground flex items-center text-xs font-medium">
            <span suppressHydrationWarning>
              {wasUpdated ? "Updated" : "Created"}{" "}
              {formatDate(resume.updatedAt, "MMM d, yyyy")}
            </span>
          </div>
        </div>
        <div className="-mt-1 -mr-2 shrink-0">
          <MoreMenu resumeId={resume.id} onPrintClick={reactToPrintFn} />
        </div>
      </div>

      <div
        onClick={() => router.push(`/editor?resumeId=${resume.id}`)}
        className="border-border/50 bg-muted/20 relative mt-auto block w-full cursor-pointer overflow-hidden rounded-md border"
        style={{ aspectRatio: "8.5/11" }}
        role="button"
        tabIndex={0}
      >
        <ResumePreview
          resumeData={mapToResumeValues(resume)}
          contentRef={contentRef}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}

interface MoreMenuProps {
  resumeId: string;
  onPrintClick: () => void;
}

function MoreMenu({ resumeId, onPrintClick }: MoreMenuProps) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:bg-muted hover:text-foreground h-8 w-8 rounded-full"
          >
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={() => setShowDeleteConfirmation(true)}
          >
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={onPrintClick}
          >
            <Printer className="size-4" />
            Print
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={onPrintClick}
          >
            <Download className="size-4" />
            Download
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteConfirmationDialog
        resumeId={resumeId}
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
      />
    </>
  );
}

interface DeleteConfirmationDialogProps {
  resumeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DeleteConfirmationDialog({
  resumeId,
  open,
  onOpenChange,
}: DeleteConfirmationDialogProps) {
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(() => {
      void (async () => {
        try {
          await deleteResume(resumeId);
          onOpenChange(false);
        } catch (error) {
          console.error(error);
          toast({
            variant: "destructive",
            description: "Something went wrong. Please try again.",
          });
        }
      })();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete resume?</DialogTitle>
          <DialogDescription>
            This will permanently delete this resume. This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant="destructive"
            onClick={() => {
              handleDelete();
            }}
            loading={isPending}
          >
            Delete
          </LoadingButton>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
