import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { InputGroup, InputGroupAddon, } from "@/components/ui/input-group";
import { SearchIcon, CheckIcon } from "lucide-react";
function Command({ className, ...props }) {
    return (React.createElement(CommandPrimitive, { "data-slot": "command", className: cn("flex size-full flex-col overflow-hidden rounded-xl! bg-popover p-1 text-popover-foreground", className), ...props }));
}
function CommandDialog({ title = "Command Palette", description = "Search for a command to run...", children, className, showCloseButton = false, ...props }) {
    return (React.createElement(Dialog, { ...props },
        React.createElement(DialogHeader, { className: "sr-only" },
            React.createElement(DialogTitle, null, title),
            React.createElement(DialogDescription, null, description)),
        React.createElement(DialogContent, { className: cn("top-1/3 translate-y-0 overflow-hidden rounded-xl! p-0", className), showCloseButton: showCloseButton }, children)));
}
function CommandInput({ className, ...props }) {
    return (React.createElement("div", { "data-slot": "command-input-wrapper", className: "p-1 pb-0" },
        React.createElement(InputGroup, { className: "h-8! rounded-lg! border-input/30 bg-input/30 shadow-none! *:data-[slot=input-group-addon]:pl-2!" },
            React.createElement(CommandPrimitive.Input, { "data-slot": "command-input", className: cn("w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50", className), ...props }),
            React.createElement(InputGroupAddon, null,
                React.createElement(SearchIcon, { className: "size-4 shrink-0 opacity-50" })))));
}
function CommandList({ className, ...props }) {
    return (React.createElement(CommandPrimitive.List, { "data-slot": "command-list", className: cn("no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none", className), ...props }));
}
function CommandEmpty({ className, ...props }) {
    return (React.createElement(CommandPrimitive.Empty, { "data-slot": "command-empty", className: cn("py-6 text-center text-sm", className), ...props }));
}
function CommandGroup({ className, ...props }) {
    return (React.createElement(CommandPrimitive.Group, { "data-slot": "command-group", className: cn("overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground", className), ...props }));
}
function CommandSeparator({ className, ...props }) {
    return (React.createElement(CommandPrimitive.Separator, { "data-slot": "command-separator", className: cn("-mx-1 h-px bg-border", className), ...props }));
}
function CommandItem({ className, children, ...props }) {
    return (React.createElement(CommandPrimitive.Item, { "data-slot": "command-item", className: cn("group/command-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none in-data-[slot=dialog-content]:rounded-lg! data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-selected:bg-muted data-selected:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-selected:*:[svg]:text-foreground", className), ...props },
        children,
        React.createElement(CheckIcon, { className: "ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100" })));
}
function CommandShortcut({ className, ...props }) {
    return (React.createElement("span", { "data-slot": "command-shortcut", className: cn("ml-auto text-xs tracking-widest text-muted-foreground group-data-selected/command-item:text-foreground", className), ...props }));
}
export { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator, };
