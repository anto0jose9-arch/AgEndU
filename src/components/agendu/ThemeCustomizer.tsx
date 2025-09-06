'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Palette, Sun, Moon } from 'lucide-react';

export function ThemeCustomizer() {
  const { theme, setTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Customize theme">
          <Palette className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none font-headline">Customize</h4>
            <p className="text-xs text-muted-foreground">
              Toggle light/dark mode.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="dark-mode" className="flex items-center gap-2">
              <Sun className="h-4 w-4" /> Light
            </Label>
            <Switch
              id="dark-mode"
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              aria-label="Toggle dark mode"
            />
            <Label htmlFor="dark-mode" className="flex items-center gap-2">
              <Moon className="h-4 w-4" /> Dark
            </Label>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
