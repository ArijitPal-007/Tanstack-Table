import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
function Pagination({ className, ...props }) {
    return (React.createElement("nav", { role: "navigation", "aria-label": "pagination", "data-slot": "pagination", className: cn("mx-auto flex w-full justify-center", className), ...props }));
}
function PaginationContent({ className, ...props }) {
    return (React.createElement("ul", { "data-slot": "pagination-content", className: cn("flex items-center gap-0.5", className), ...props }));
}
function PaginationItem({ ...props }) {
    return React.createElement("li", { "data-slot": "pagination-item", ...props });
}
function PaginationLink({ className, isActive, size = "icon", ...props }) {
    return (React.createElement(Button, { variant: isActive ? "outline" : "ghost", size: size, className: cn(className), nativeButton: false, render: React.createElement("a", { "aria-current": isActive ? "page" : undefined, "data-slot": "pagination-link", "data-active": isActive, ...props }) }));
}
function PaginationPrevious({ className, text = "Previous", ...props }) {
    return (React.createElement(PaginationLink, { "aria-label": "Go to previous page", size: "default", className: cn("pl-1.5!", className), ...props },
        React.createElement(ChevronLeftIcon, { "data-icon": "inline-start" }),
        React.createElement("span", { className: "hidden sm:block" }, text)));
}
function PaginationNext({ className, text = "Next", ...props }) {
    return (React.createElement(PaginationLink, { "aria-label": "Go to next page", size: "default", className: cn("pr-1.5!", className), ...props },
        React.createElement("span", { className: "hidden sm:block" }, text),
        React.createElement(ChevronRightIcon, { "data-icon": "inline-end" })));
}
function PaginationEllipsis({ className, ...props }) {
    return (React.createElement("span", { "aria-hidden": true, "data-slot": "pagination-ellipsis", className: cn("flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4", className), ...props },
        React.createElement(MoreHorizontalIcon, null),
        React.createElement("span", { className: "sr-only" }, "More pages")));
}
export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, };
