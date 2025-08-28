import { Button } from "@/components/ui/button";
import DOMPurify from "dompurify";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import { projectSchema, ProjectValues } from "@/lib/validation";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import { GripHorizontal } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import GenerateProjectButton from "./GenerateProjectButton";
import { RichTextEditor } from "@/components/RichTextEditor";

export default function ProjectForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const form = useForm<ProjectValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projects: resumeData.projects || [],
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setResumeData({
        ...resumeData,
        projects: values.projects?.filter((proj) => proj !== undefined) || [],
      });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "projects",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);
      move(oldIndex, newIndex);
      return arrayMove(fields, oldIndex, newIndex);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <p className="text-sm text-muted-foreground">
          Add as many projects as you like.
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={fields}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field, index) => (
                <ProjectItem
                  id={field.id}
                  key={field.id}
                  index={index}
                  form={form}
                  remove={remove}
                />
              ))}
            </SortableContext>
          </DndContext>
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={() =>
                append({
                  ProjectName: "",
                  toolsUsed: "",
                  startDate: "",
                  endDate: "",
                  description: "",
                })
              }
            >
              Add project
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

interface ProjectItemProps {
  id: string;
  form: UseFormReturn<ProjectValues>;
  index: number;
  remove: (index: number) => void;
}

function ProjectItem({ id, form, index, remove }: ProjectItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      className={cn(
        "space-y-3 rounded-md border bg-background p-3",
        isDragging && "relative z-50 cursor-grab shadow-xl",
      )}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div className="flex justify-between gap-2">
        <span className="font-semibold">Project {index + 1}</span>
        <GripHorizontal
          className="size-5 cursor-grab text-muted-foreground focus:outline-none"
          {...attributes}
          {...listeners}
        />
      </div>
      <div className="flex justify-center">
        {/* <GenerateProjectButton
          onProjectGenerated={(proj) =>
            form.setValue(`projects.${index}`, proj)
          }
        /> */}
        <GenerateProjectButton
          onProjectGenerated={(proj) => {
            // Get the current values for this project item
            const currentProject = form.getValues(`projects.${index}`);
            // Update only the description from the AI generated project
            form.setValue(`projects.${index}`, {
              ...currentProject,
              description: proj.description,
            });
          }}
        />
      </div>
      <FormField
        control={form.control}
        name={`projects.${index}.ProjectName`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project name</FormLabel>
            <FormControl>
              <Input
                {...field}
                autoFocus
                onChange={(e) =>
                  field.onChange(
                    e.target.value
                      .replace(/[^a-zA-Z0-9\s&._-]/g, "") // allow letters, numbers, spaces, &, ., _, -
                      .substring(0, 50) // max length 50 chars
                      .trim(), // remove leading/trailing spaces
                  )
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`projects.${index}.toolsUsed`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tools used</FormLabel>
            <FormControl>
              <Input
                {...field}
                onChange={(e) =>
                  field.onChange(
                    e.target.value
                      .replace(/[^a-zA-Z0-9\s&.+\-\/]/g, "") // allow letters, numbers, spaces, &, ., +, -, /
                      .substring(0, 100) // max length 100 chars
                      .trim(), // remove leading/trailing spaces
                  )
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* <FormField
        control={form.control}
        name={`projects.${index}.demoLink`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Demo link</FormLabel>
            <FormDescription>
              Place a link to a live demo of your project.
            </FormDescription>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      /> */}

      <FormField
        control={form.control}
        name={`projects.${index}.demoLink`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Demo link</FormLabel>
            <FormDescription>
              Place a link to a live demo of your project. Ensure the link is in
              proper format.
            </FormDescription>
            <div className="flex gap-2">
              <FormControl>
                <Input {...field} type="url" placeholder="https://..." />
              </FormControl>
              {field.value && (
                <a
                  href={field.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 min-w-20 items-center justify-center rounded-md bg-muted px-3 text-sm hover:underline"
                >
                  Visit ↗
                </a>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name={`projects.${index}.startDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start date</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  value={field.value?.slice(0, 10)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`projects.${index}.endDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>End date</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  value={field.value?.slice(0, 10)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormDescription>
        Leave <span className="font-semibold">end date</span> empty if this
        project is ongoing.
      </FormDescription>
      {/* <FormField
        control={form.control}
        name={`projects.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      /> */}

      <FormField
        control={form.control}
        name={`projects.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <RichTextEditor
                value={field.value || ""}
                // onChange={(html) => field.onChange(html)}
                onChange={(html) => {
                  const cleaned = DOMPurify.sanitize(html, {
                    ALLOWED_TAGS: [
                      "b",
                      "i",
                      "u",
                      "p",
                      "br",
                      "ul",
                      "ol",
                      "li",
                      "strong",
                      "em",
                    ],
                    ALLOWED_ATTR: [],
                  });
                  field.onChange(cleaned);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button variant="destructive" type="button" onClick={() => remove(index)}>
        Remove
      </Button>
    </div>
  );
}
