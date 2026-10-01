import {
  closestCenter,
  DndContext,
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
import { useFieldArray, useForm } from "react-hook-form";
import { BulletPointsEditor } from "@/components/editor/BulletPointsEditor";
import { Button } from "@/components/ui/button";
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
import { projectSchema } from "@/lib/resume/validation";
import { cn, sanitizeEditorInput } from "@/lib/utils";
import GenerateProjectButton from "./GenerateProjectButton";
import type { EditorFormProps } from "@/lib/resume/types";
import type { ProjectValues } from "@/lib/resume/validation";
import type { DragEndEvent } from "@dnd-kit/core";
import type { UseFormReturn } from "react-hook-form";

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
    const { unsubscribe } = form.watch((values) => {
      void (async () => {
        const isValid = await form.trigger();
        if (!isValid) return;
        setResumeData({
          ...resumeData,
          projects: values.projects?.filter((proj) => proj !== undefined) || [],
        });
      })();
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
        <p className="text-muted-foreground text-sm">
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
                  description: [],
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
        "bg-background space-y-3 rounded-md border p-3",
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
          className="text-muted-foreground size-5 cursor-grab focus:outline-none"
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
                    sanitizeEditorInput(e.target.value, { maxLength: 50 }),
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
                    sanitizeEditorInput(e.target.value, { maxLength: 100 }),
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

      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name={`projects.${index}.demoLink`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Demo link</FormLabel>
              <FormDescription>
                Link to live demo.
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
                    className="bg-muted inline-flex h-10 min-w-16 items-center justify-center rounded-md px-3 text-sm hover:underline"
                  >
                    ↗
                  </a>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`projects.${index}.githubUrl`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code link</FormLabel>
              <FormDescription>
                Link to source code.
              </FormDescription>
              <div className="flex gap-2">
                <FormControl>
                  <Input {...field} type="url" placeholder="https://github.com/..." />
                </FormControl>
                {field.value && (
                  <a
                    href={field.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-muted inline-flex h-10 min-w-16 items-center justify-center rounded-md px-3 text-sm hover:underline"
                  >
                    ↗
                  </a>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
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
            <FormControl>
              <BulletPointsEditor
                value={field.value || []}
                onChange={field.onChange}
                label="Responsibilities / Achievements"
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
