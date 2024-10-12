import React, {memo} from 'react';
import {Handle, NodeProps, Position} from '@xyflow/react';
import FamilyPersonDates from "./family-person-dates";
import {PersonNode} from "../types";
import Image from "next/image";
import {SmileIcon} from "lucide-react";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {PassportIcon, Structure03Icon} from "hugeicons-react";

export default memo(function FamilyPersonNodeSmall(props: NodeProps<PersonNode>) {
    return (
        <>
            <div
                className="h-full z-10 flex gap-4 rounded-r-3xl rounded-l-[150px] border-border border cursor-default">

                <Link href={`/people/${props.data.person.id}/tree`}
                      className="transition-shadow hover:ring-4 ring-primary rounded-full shrink-0">

                    <div
                        className="h-full aspect-square rounded-full bg-secondary flex items-center justify-center relative">
                        {props.data.person.avatar_url ? <Image
                                priority={true}
                                src={props.data.person.avatar_url}
                                fill={true}
                                className="rounded-full"
                                alt={props.data.person.full_name}
                            />
                            : <SmileIcon className="opacity-20"/>
                        }
                    </div>
                </Link>

                <div className="flex justify-between flex-col px-3 py-2 grow">
                    <div className="text-sm">
                        <Link href={`/person/${props.data.person.id}`} className="hover:underline">
                            {props.data.person.full_name}
                        </Link>
                    </div>

                    <div>
                        <div className="text-xs text-muted-foreground">
                            <FamilyPersonDates person={props.data.person}/>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-1 pt-2 pr-2">
                    <Link href={`/people/${props.data.person.id}/tree`}
                          className={buttonVariants({variant: "outline", size: 'xs'})}>
                        <Structure03Icon size={13}/>
                    </Link>
                    <Link href={`/people/${props.data.person.id}`}
                          className={buttonVariants({variant: "outline", size: 'xs'})}>
                        <PassportIcon size={13}/>
                    </Link>
                </div>

            </div>

            <Handle
                type="target"
                position={Position.Top}
                id="top"
                isConnectable={false}
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
