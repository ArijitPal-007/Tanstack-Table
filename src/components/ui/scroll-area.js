"use client";
import * as React from "react";
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import { cn } from "@/lib/utils";
function ScrollArea({ className, children, ...props }) {
    return (React.createElement(ScrollAreaPrimitive.Root, { "data-slot": "scroll-area", className: cn("relative", className), ...props },
        React.createElement(ScrollAreaPrimitive.Viewport, { "data-slot": "scroll-area-viewport", className: "size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1" }, children),
        React.createElement(ScrollBar, null),
        React.createElement(ScrollAreaPrimitive.Corner, null)));
}
function ScrollBar({ className, orientation = "vertical", ...props }) {
    return (React.createElement(ScrollAreaPrimitive.Scrollbar, { "data-slot": "scroll-area-scrollbar", "data-orientation": orientation, orientation: orientation, className: cn("flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent", className), ...props },
        React.createElement(ScrollAreaPrimitive.Thumb, { "data-slot": "scroll-area-thumb", className: "relative flex-1 rounded-full bg-border" })));
}
export { ScrollArea, ScrollBar };
