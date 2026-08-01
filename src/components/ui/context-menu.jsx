"use client";
import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const ContextMenu = ContextMenuPrimitive.Root;
export const ContextMenuPortal = ContextMenuPrimitive.Portal;

export function ContextMenuTrigger({ className, children, ...props }) {
  return (
    <ContextMenuPrimitive.Trigger className={className} data-slot="context-menu-trigger" {...props}>
      {children}
    </ContextMenuPrimitive.Trigger>
  );
}

export function ContextMenuPopup({
  children,
  className,
  sideOffset = 4,
  align = "center",
  alignOffset,
  side = "bottom",
  anchor,
  portalProps,
  ...props
}) {
  return (
    <ContextMenuPortal {...portalProps}>
      <ContextMenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="z-50"
        data-slot="context-menu-positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <ContextMenuPrimitive.Popup
          className={cn(
            "relative flex min-w-44 origin-(--transform-origin) rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] shadow-2xl outline-none p-1.5 backdrop-blur-none z-50",
            className
          )}
          data-slot="context-menu-popup"
          {...props}
        >
          <div className="max-h-(--available-height) w-full overflow-y-auto space-y-0.5">
            {children}
          </div>
        </ContextMenuPrimitive.Popup>
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPortal>
  );
}

export function ContextMenuGroup(props) {
  return <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />;
}

export function ContextMenuItem({ className, inset, variant = "default", ...props }) {
  return (
    <ContextMenuPrimitive.Item
      className={cn(
        "flex min-h-9 cursor-pointer select-none items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] outline-none transition-colors hover:bg-[var(--bg-secondary)] focus:bg-[var(--bg-secondary)] data-[variant=destructive]:text-red-500 hover:data-[variant=destructive]:bg-red-500/10 focus:data-[variant=destructive]:bg-red-500/10",
        className
      )}
      data-inset={inset}
      data-slot="context-menu-item"
      data-variant={variant}
      {...props}
    />
  );
}

export function ContextMenuSeparator({ className, ...props }) {
  return (
    <ContextMenuPrimitive.Separator
      className={cn("mx-1 my-1.5 h-px bg-[var(--border-color)]/60", className)}
      data-slot="context-menu-separator"
      {...props}
    />
  );
}

export function ContextMenuSub(props) {
  return <ContextMenuPrimitive.SubmenuRoot data-slot="context-menu-sub" {...props} />;
}

export function ContextMenuSubTrigger({ className, children, ...props }) {
  return (
    <ContextMenuPrimitive.SubmenuTrigger
      className={cn(
        "flex min-h-9 cursor-pointer select-none items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] outline-none transition-colors hover:bg-[var(--bg-secondary)] focus:bg-[var(--bg-secondary)]",
        className
      )}
      data-slot="context-menu-sub-trigger"
      {...props}
    >
      {children}
      <ChevronRightIcon className="ms-auto w-3.5 h-3.5 opacity-60" />
    </ContextMenuPrimitive.SubmenuTrigger>
  );
}

export function ContextMenuSubPopup({ className, sideOffset = 0, align = "start", ...props }) {
  return (
    <ContextMenuPopup
      align={align}
      className={cn("min-w-36 z-50", className)}
      data-slot="context-menu-sub-content"
      side="inline-end"
      sideOffset={sideOffset}
      {...props}
    />
  );
}

export { ContextMenuPrimitive };
