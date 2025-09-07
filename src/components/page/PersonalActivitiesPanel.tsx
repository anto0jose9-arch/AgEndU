"use client";

import React, { useState, useMemo } from "react";
import { PersonalActivity } from "@/lib/types";
import { Button } from "../ui/button";
import { Plus, Trash, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { ClipboardList, Bell } from 'lucide-react';
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

interface PersonalActivitiesPanelProps {
    activities: PersonalActivity[];
    onAddActivity: (data: Omit<PersonalActivity, 'id' | 'completed' | 'completionDate'>) => void;
    onDeleteActivity: (id: string) => void;
    onToggleComplete: (id: string) => void;
    onClearCompleted: () => void;
    notificationsEnabled: boolean;
    onNotificationsChange: (enabled: boolean) => void;
}

export function PersonalActivitiesPanel({ 
    activities, 
    onAddActivity, 
    onDeleteActivity, 
    onToggleComplete, 
    onClearCompleted,
    notificationsEnabled,
    onNotificationsChange
}: PersonalActivitiesPanelProps) {
    const [newActivityTitle, setNewActivityTitle] = useState("");

    const completedActivitiesCount = useMemo(() => activities.filter(a => a.completed).length, [activities]);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newActivityTitle.trim()) {
            onAddActivity({ title: newActivityTitle.trim() });
            setNewActivityTitle("");
        }
    }

    const sortedActivities = useMemo(() => 
        [...activities].sort((a, b) => (a.completed ? 1 : -1) - (b.completed ? 1 : -1) || (b.completionDate?.getTime() || 0) - (a.completionDate?.getTime() || 0)),
    [activities]);

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 space-y-4">
                 <form onSubmit={handleAdd} className="flex gap-2">
                    <Input 
                        placeholder="Nueva actividad..."
                        value={newActivityTitle}
                        onChange={(e) => setNewActivityTitle(e.target.value)}
                    />
                    <Button type="submit" size="icon" aria-label="Añadir actividad">
                        <Plus className="h-4 w-4" />
                    </Button>
                </form>
                
                <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center space-x-2">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        <Label htmlFor="notifications-switch" className="font-medium">
                            Notificar actividades
                        </Label>
                    </div>
                    <Switch
                        id="notifications-switch"
                        checked={notificationsEnabled}
                        onCheckedChange={onNotificationsChange}
                    />
                </div>
            </div>

            <ScrollArea className="flex-1 px-4">
              <div className="space-y-2">
                  {sortedActivities.length > 0 ? sortedActivities.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <div className={cn("flex items-center justify-between p-2 rounded-md hover:bg-muted/50", activity.completed && 'completed')}>
                          <div className="flex items-center gap-3">
                              <Checkbox
                                  id={`personal-${activity.id}`}
                                  checked={activity.completed}
                                  onCheckedChange={() => onToggleComplete(activity.id)}
                                  aria-label={`Marcar ${activity.title} como ${activity.completed ? 'incompleta' : 'completa'}`}
                              />
                              <label
                                  htmlFor={`personal-${activity.id}`}
                                  className={cn(
                                      "text-sm font-medium cursor-pointer animated-strikethrough",
                                      activity.completed && "text-muted-foreground"
                                  )}
                              >
                                  {activity.title}
                              </label>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:text-destructive shrink-0" aria-label={`Eliminar ${activity.title}`}>
                                  <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Esto eliminará permanentemente la actividad.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDeleteActivity(activity.id)}>Eliminar</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                      </div>
                      {index < sortedActivities.length - 1 && <Separator />}
                    </React.Fragment>
                  )) : (
                      <p className="text-sm text-center text-muted-foreground py-4">No hay actividades personales.</p>
                  )}
              </div>
            </ScrollArea>
             <div className="p-4 mt-auto border-t">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" className="w-full" disabled={completedActivitiesCount === 0}>
                            <Trash className="mr-2 h-4 w-4" />
                            Limpiar ({completedActivitiesCount}) Completada(s)
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará permanentemente {completedActivitiesCount} actividad(es) completada(s).
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={onClearCompleted}>Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}
