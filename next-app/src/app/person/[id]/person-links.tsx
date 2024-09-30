import React from "react";
import {Person} from "@/types";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import Link from "next/link";
import FamilyPersonContactIcon from "@/components/family-person-contact-icon";

export const PersonLinks = ({person}: { person: Person }) => {
    return person.contacts?.length ?
        <div className="flex gap-4">
            {person.contacts?.map(contact => {
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Link key={contact.id} target="_blank" href={contact.value}
                                      className="text-3xl text-slate-600 transition-colors hover:text-primary">
                                    <FamilyPersonContactIcon type={contact.type} size={40}/>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{new URL(contact.value).host}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                )
            })}
        </div>

        : ""
}
