import React, {memo} from 'react';
import {Handle, NodeProps, Position} from '@xyflow/react';
import FamilyPersonDates from "./family-person-dates";
import {PersonNode} from "../types";
import Image from "next/image";
import {SmileIcon} from "lucide-react";
import Link from "next/link";

export default memo(function FamilyPersonNodeSmall(props: NodeProps<PersonNode>) {
    return (
        <>
            <div
                className="h-full z-10 flex rounded-full border-zinc-300 border cursor-default">

                <Link href={`/person/${props.data.person.id}`}
                      className="transition-shadow hover:ring-4 ring-primary rounded-full">

                    <div
                        className="h-full aspect-square rounded-full bg-slate-50 flex items-center justify-center relative">
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

                <div className="flex justify-between flex-col px-3 py-2 pr-16">
                    <div className="text-sm">
                        <Link href={`/person/${props.data.person.id}`} className="hover:underline">
                            {props.data.person.full_name}
                        </Link>
                    </div>

                    <div>
                        <div className="text-xs text-slate-400">
                            <FamilyPersonDates person={props.data.person}/>
                        </div>
                    </div>
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
