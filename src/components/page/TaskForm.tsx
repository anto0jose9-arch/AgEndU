"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import type { Task } from '@/lib/types';
import { es } from 'date-fns/locale';
import { Badge } from "../ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres."),
  dueDate: z.date().optional(),
  plannedDates: z.array(z.date()).optional(),
  priority: z.enum(['low', 'medium', 'high'], { required_error: "La prioridad es obligatoria." }),
}).refine(data => {
    if (!data.dueDate || !data.plannedDates) return true;
    return data.plannedDates.every(pd => pd <= data.dueDate!);
}, {
  message: "Las fechas de planificación no pueden ser posteriores a la fecha de entrega.",
  path: ["plannedDates"],
});


type TaskFormValues = z.infer<typeof formSchema>;

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormValues) => void;
  onClose: () => void;
}

export function TaskForm({ task, onSubmit, onClose }: TaskFormProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task?.title || "",
      dueDate: task?.dueDate || undefined,
      plannedDates: task?.plannedDates || [],
      priority: task?.priority || 'medium',
    },
  });
  
  const plannedDates = form.watch("plannedDates") || [];
  const dueDate = form.watch("dueDate");

  const handleSubmit = (data: TaskFormValues) => {
    onSubmit(data);
    onClose();
  };
  
  const handleRemovePlannedDate = (indexToRemove: number) => {
    const newDates = plannedDates.filter((_, index) => index !== indexToRemove);
    form.setValue("plannedDates", newDates, { shouldValidate: true });
  };
  
  const handleDueDateChange = (date: Date | undefined) => {
      form.setValue("dueDate", date, { shouldValidate: true });
      if (date) {
        const validPlannedDates = (form.getValues("plannedDates") || []).filter(pd => pd <= date);
        form.setValue("plannedDates", validPlannedDates, { shouldValidate: true });
      }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título de la Tarea</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Completar lectura del Capítulo 4" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="plannedDates"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fechas Planificadas (Opcional)</FormLabel>
              <Collapsible>
                <CollapsibleTrigger asChild>
                   <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value?.length && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value?.length ? `${field.value.length} fecha(s) seleccionada(s)` : "Seleccionar fechas"}
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="flex flex-wrap gap-2 mt-2 min-h-[20px]">
                      {plannedDates.map((date, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {format(date, "PPP", { locale: es })}
                              <button
                                  type="button"
                                  onClick={() => handleRemovePlannedDate(index)}
                                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                  aria-label={`Quitar fecha ${format(date, "PPP")}`}
                              >
                                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                              </button>
                          </Badge>
                      ))}
                  </div>
                  <FormControl>
                      <Calendar
                          mode="multiple"
                          min={0}
                          selected={field.value}
                          onSelect={field.onChange}
                          locale={es}
                          disabled={(date) => dueDate ? date > dueDate : false}
                          className="rounded-md border"
                      />
                  </FormControl>
                </CollapsibleContent>
              </Collapsible>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Entrega (Opcional)</FormLabel>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                     <FormControl>
                          <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={handleDueDateChange}
                              locale={es}
                              className="rounded-md border"
                          />
                      </FormControl>
                  </CollapsibleContent>
                </Collapsible>
                <FormMessage />
              </FormItem>
            )}
          />

        <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioridad</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la prioridad" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit">{task ? 'Guardar Cambios' : 'Añadir Tarea'}</Button>
        </div>
      </form>
    </Form>
  );
}
