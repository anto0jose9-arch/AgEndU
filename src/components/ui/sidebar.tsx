"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetOverlay, SheetClose } from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SettingsPanel } from "../page/SettingsPanel"

const SIDEBAR_WIDTH_MOBILE = "20rem"

type SidebarId = "left" | "right" | "settings";

type SidebarContext = {
  openSidebars: Record<SidebarId, boolean>;
  setOpen: (id: SidebarId, open: boolean) => void;
  toggleSidebar: (id: SidebarId) => void;
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(
  (
    {
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [openSidebars, setOpenSidebars] = React.useState<Record<SidebarId, boolean>>({
      left: false,
      right: false,
      settings: false,
    });

    const setOpen = (id: SidebarId, open: boolean) => {
      setOpenSidebars(prev => ({ ...prev, [id]: open }));
    };

    const toggleSidebar = (id: SidebarId) => {
      setOpen(id, !openSidebars[id]);
    };

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        openSidebars,
        setOpen,
        toggleSidebar,
      }),
      [openSidebars]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            className={cn(
              "group/sidebar-wrapper",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
            <SettingsSidebar />
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"


const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
  }
>(
  (
    {
      side = "left",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { openSidebars, setOpen } = useSidebar();
    const open = openSidebars[side as SidebarId];
    const onOpenChange = (isOpen: boolean) => setOpen(side as SidebarId, isOpen);

    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          ref={ref}
          data-sidebar="sidebar"
          className={cn("w-[var(--sidebar-width)] bg-sidebar p-0 text-sidebar-foreground flex flex-col", className)}
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
          {...props}
        >
          {children}
        </SheetContent>
      </Sheet>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SettingsSidebar = () => {
  const { openSidebars, setOpen } = useSidebar();
  const open = openSidebars.settings;
  const onOpenChange = (isOpen: boolean) => setOpen('settings', isOpen);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[var(--sidebar-width)] bg-sidebar p-0 text-sidebar-foreground flex flex-col"
        style={{ '--sidebar-width': SIDEBAR_WIDTH_MOBILE } as React.CSSProperties}
      >
        <SheetHeader className="flex items-center justify-between p-4 border-b">
           <SheetTitle>Ajustes</SheetTitle>
           <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </SheetClose>
        </SheetHeader>
        <SidebarContent>
          <SettingsPanel />
        </SidebarContent>
      </SheetContent>
    </Sheet>
  );
};


interface SidebarTriggerProps extends ButtonProps {
  side: SidebarId;
  tooltip?: string;
}

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  SidebarTriggerProps
>(({ className, onClick, side, tooltip, children, ...props }, ref) => {
  const { toggleSidebar, openSidebars } = useSidebar();
  const isOpen = openSidebars[side];

  const button = (
      <Button
        ref={ref}
        data-sidebar="trigger"
        variant="ghost"
        size="icon"
        className={cn("h-8 w-8", className)}
        onClick={(event) => {
          onClick?.(event)
          toggleSidebar(side)
        }}
        {...props}
      >
        {isOpen ? <X /> : children}
      </Button>
  );

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side={side === 'left' ? 'right' : 'left'}>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-sidebar-border", className)}
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
