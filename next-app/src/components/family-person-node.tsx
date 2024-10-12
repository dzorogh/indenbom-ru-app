import React, {memo} from 'react';
import {Handle, NodeProps, Position} from '@xyflow/react';
import FamilyPersonDates from "./family-person-dates";
import {PersonNode} from "@/types";
import Image from "next/image";
import Link from "next/link";
import FamilyPersonContactIcon from "@/components/family-person-contact-icon";
import {SmileIcon} from "lucide-react";
import {Album02Icon, AttachmentCircleIcon, AttachmentSquareIcon, PassportIcon, Structure03Icon} from "hugeicons-react";
import {Button, buttonVariants} from "@/components/ui/button";

export default memo(function FamilyPersonNode(props: NodeProps<PersonNode>) {

    return (
        <>
            <div
                className={`h-full bg-white z-10 rounded-r-3xl rounded-l-[150px] shadow-lg shadow-slate-200 flex cursor-default gap-4 ${props.data.isRootPerson ? 'ring-primary ring' : ''}`}>

                <div className="ring-primary rounded-full shrink-0 h-full aspect-square relative">
                    {props.data.person.avatar_url ?
                        <Image
                            priority={true}
                            src={props.data.person.avatar_url}
                            fill={true}
                            className="rounded-full"
                            alt={props.data.person.full_name}
                        />
                        :
                        <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center">
                            <SmileIcon className="opacity-20" />
                        </div>
                    }
                </div>


                <div className="flex py-4 justify-between flex-col grow">
                    <div className="flex flex-col gap-2">
                        <div>
                            <Link href={`/people/${props.data.person.id}`} className="transition-colors hover:underline hover:text-primary underline-offset-4">
                                {props.data.person.full_name}
                            </Link>
                        </div>

                        <div className="flex gap-2 text-muted-foreground">
                            {props.data.person.photos_count ? <Album02Icon/> : ""}
                            {props.data.person.contacts_count ? <AttachmentSquareIcon /> : ""}
                        </div>
                    </div>

                    {props.data.person.birth_date || props.data.person.death_date || props.data.person.place_of_birth ?
                        <div className="flex flex-col gap-1">
                            {props.data.person.place_of_birth ?
                                <div className="text-sm text-muted-foreground">
                                    {props.data.person.place_of_birth}
                                </div>
                                : ""
                            }

                            {props.data.person.birth_date || props.data.person.death_date ?
                                <div className="text-sm text-muted-foreground">
                                    <FamilyPersonDates person={props.data.person}/>
                                </div>
                                : ""
                            }
                        </div>
                        : ""
                    }
                </div>

                <div className="flex flex-col gap-2 pt-4 pr-4">
                    <Link href={`/people/${props.data.person.id}/tree`} className={buttonVariants({ variant: "outline", size: 'default' })}>
                        <Structure03Icon />
                    </Link>
                    <Link href={`/people/${props.data.person.id}`} className={buttonVariants({ variant: "outline", size: 'default' })}>
                        <PassportIcon />
                    </Link>
                </div>
            </div>

            <Handle
                type="target"
                position={Position.Top}
                id="top"
                isConnectable={false}
                className="bg-pink-500"
            />

            <Handle
                type="source"
                position={Position.Bottom}
                id="bottom"
                isConnectable={false}
            />

        </>
    );
});
