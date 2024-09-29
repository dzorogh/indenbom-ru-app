import {Badge} from "@/components/ui/badge";
import React from "react";
import {CheckmarkCircle02Icon, Tick01Icon} from "hugeicons-react";

export const FamilyPersonHeadingBadge = ({children}) => {
    return (
        <Badge
            variant="secondary"
            className="ring-4 ring-white bg-slate-950 text-white flex items-center justify-center gap-2 pr-0.5 py-0.5">
            {children}
            <CheckmarkCircle02Icon size={20}/>
        </Badge>
    );
};
