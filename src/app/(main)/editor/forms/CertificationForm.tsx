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
import { EditorFormProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import { certificationSchema, CertificationValues } from "@/lib/validation";
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

export default function CertificationForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const form = useForm<CertificationValues>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      certifications: resumeData.certifications || [],
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setResumeData({
        ...resumeData,
        certifications:
          values.certifications?.filter((cert) => cert !== undefined) || [],
      });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "certifications",
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
        <h2 className="text-2xl font-semibold">Certifications</h2>
        <p className="text-sm text-muted-foreground">
          Add as many certifications as you like.
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
                <CertificationItem
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
                  certificationName: "",
                  awardedDate: undefined,
                })
              }
            >
              Add certification
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

interface CertificationItemProps {
  id: string;
  form: UseFormReturn<CertificationValues>;
  index: number;
  remove: (index: number) => void;
}

function CertificationItem({
  id,
  form,
  index,
  remove,
}: CertificationItemProps) {
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
        <span className="font-semibold">Certification {index + 1}</span>
        <GripHorizontal
          className="size-5 cursor-grab text-muted-foreground focus:outline-none"
          {...attributes}
          {...listeners}
        />
      </div>

      <FormField
        control={form.control}
        name={`certifications.${index}.certificationName`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Certification Name</FormLabel>
            <FormControl>
              <Input
                {...field}
                autoFocus
                onChange={(e) =>
                  field.onChange(
                    e.target.value
                      .replace(/[^a-zA-Z0-9\s&.,'+-]/g, "") // allow letters, numbers, spaces, &, ., ,, ', +, -
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

      <FormField
        control={form.control}
        name={`certifications.${index}.awardedBy`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Awarded By</FormLabel>
            <FormControl>
              <Input
                {...field}
                autoFocus
                onChange={(e) =>
                  field.onChange(
                    e.target.value
                      .replace(/[^a-zA-Z0-9\s&.,'-]/g, "") // allow letters, numbers, spaces, &, ., ,, ', -
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

      <FormField
        control={form.control}
        name={`certifications.${index}.awardedDate`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Awarded Date</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="date"
                value={
                  field.value
                    ? new Date(field.value).toISOString().slice(0, 10)
                    : ""
                }
              />
            </FormControl>
            <FormDescription>
              Leave empty if the certification date is not applicable.
            </FormDescription>
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
