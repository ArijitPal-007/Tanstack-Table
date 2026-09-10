import { Pin, PinOff } from "lucide-react";
import React from "react";
import { Button } from "@base-ui/react";
export function ColumnPinning({ column, }) {
    const pinned = column.getIsPinned();
    return (React.createElement(Button
    // type="button"
    , { 
        // type="button"
        onClick: () => {
            if (pinned) {
                column.pin(false);
            }
            else {
                column.pin("start");
            }
        }, className: "rounded p-1 hover:bg-gray-300 hover:text-blue-900 cursor-pointer", title: pinned ? "Unpin column" : "Pin column" }, pinned ? (React.createElement(PinOff, { className: "size-4" })) : (React.createElement(Pin, { className: "size-4" }))));
}
