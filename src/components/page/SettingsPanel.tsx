"use client";

import React, { useState, useEffect } from "react";
import { useSettings } from "@/hooks/use-settings";
import type { AppSettings } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Moon, Sun } from "lucide-react";
import { Separator } from "../ui/separator";

const colorThemes = [
    { name: 'Predeterminado', primaryColor: '#ff0000', backgroundColor: '#111827', foregroundColor: '#f9fafb' },
    { name: 'Océano', primaryColor: '#007BFF', backgroundColor: '#0A192F', foregroundColor: '#E6F1FF' },
    { name: 'Bosque', primaryColor: '#28A745', backgroundColor: '#1A202C', foregroundColor: '#F7FAFC' },
    { name: 'Púrpura', primaryColor: '#8A2BE2', backgroundColor: '#191921', foregroundColor: '#F3E5F5' },
    { name: 'Atardecer', primaryColor: '#FF6347', backgroundColor: '#2C1B1A', foregroundColor: '#FFF2F0' },
    { name: 'Menta Suave', primaryColor: '#68D391', backgroundColor: '#F0FFF4', foregroundColor: '#2F855A' },
    { name: 'Algodón de Azúcar', primaryColor: '#F687B3', backgroundColor: '#FFF5F7', foregroundColor: '#97266D' },
    { name: 'Vainilla', primaryColor: '#F6E05E', backgroundColor: '#FFFFF0', foregroundColor: '#B7791F' },
];


export function SettingsPanel() {
    const { settings, updateSettings, applyTheme } = useSettings();
    const [localSettings, setLocalSettings] = useState<AppSettings>(settings);

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleThemeChange = (themeName: string) => {
        const selectedTheme = colorThemes.find(t => t.name === themeName);
        if (selectedTheme) {
            setLocalSettings(prev => ({
                ...prev,
                theme: {
                    ...prev.theme,
                    name: themeName,
                    primaryColor: selectedTheme.primaryColor,
                    backgroundColor: selectedTheme.backgroundColor,
                    foregroundColor: selectedTheme.foregroundColor
                }
            }));
        }
    };
    
    const handleAppearanceChange = (isDark: boolean) => {
        setLocalSettings(prev => ({ ...prev, appearance: isDark ? 'dark' : 'light' }));
    };

    const handleApplyChanges = () => {
        updateSettings(localSettings);
        applyTheme(localSettings);
    };
    
    return (
        <Card className="border-none shadow-none flex flex-col h-full">
            <CardHeader>
                <CardTitle>Configuración</CardTitle>
                <CardDescription>Personaliza la apariencia de la aplicación.</CardDescription>
            </CardHeader>
            <ScrollArea className="flex-1">
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <Label>Apariencia</Label>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <div className="flex items-center space-x-2">
                                {localSettings.appearance === 'dark' ? <Moon className="h-5 w-5 text-muted-foreground" /> : <Sun className="h-5 w-5 text-muted-foreground" />}
                                <Label htmlFor="appearance-switch" className="font-medium">
                                    Modo {localSettings.appearance === 'dark' ? 'Oscuro' : 'Claro'}
                                </Label>
                            </div>
                            <Switch
                                id="appearance-switch"
                                checked={localSettings.appearance === 'dark'}
                                onCheckedChange={handleAppearanceChange}
                            />
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                        <Label>Tema de Color</Label>
                        <RadioGroup
                            value={localSettings.theme.name}
                            onValueChange={handleThemeChange}
                            className="grid grid-cols-2 gap-4"
                        >
                            {colorThemes.map((theme) => (
                                <Label
                                    key={theme.name}
                                    htmlFor={theme.name}
                                    className={cn(
                                        "flex flex-col items-start space-y-2 rounded-md border-2 p-3 hover:border-accent cursor-pointer",
                                        localSettings.theme.name === theme.name && "border-primary"
                                    )}
                                >
                                    <RadioGroupItem value={theme.name} id={theme.name} className="sr-only" />
                                    <span className="font-semibold">{theme.name}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: theme.primaryColor }} />
                                        <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: theme.backgroundColor }} />
                                        <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: theme.foregroundColor }} />
                                    </div>
                                </Label>
                            ))}
                        </RadioGroup>
                    </div>
                </CardContent>
            </ScrollArea>
             <CardFooter>
                <Button className="w-full" onClick={handleApplyChanges}>Aplicar Cambios</Button>
            </CardFooter>
        </Card>
    );
}
