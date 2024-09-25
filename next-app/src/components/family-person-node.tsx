import React, {memo} from 'react';
import {Handle, NodeProps, Position} from '@xyflow/react';
import {Icon} from "@iconify-icon/react";
import FamilyPersonDates from "./family-person-dates";
import {PersonNode} from "../types";
import Image from "next/image";

export default memo(function FamilyPersonNode(props: NodeProps<PersonNode>) {
    const icons = {
        wikipedia: <Icon icon="tabler:brand-wikipedia"/>,
        facebook: <Icon icon="tabler:brand-facebook"/>,
        telegram: <Icon icon="tabler:brand-telegram"/>,
        vk: <Icon icon="tabler:brand-vk"/>,
        archive: <Icon icon="tabler:archive"/>,
    }

    const defaultIcon = <Icon icon="tabler:world"/>

    return (
        <>
            <div
                className="h-full bg-white  z-10 rounded-r-3xl rounded-l-[150px] shadow-lg shadow-slate-200 flex cursor-default gap-4">

                <div>
                    {props.data.person.avatar_url ?
                        <Image
                            src={props.data.person.avatar_url}
                            width={150}
                            height={150}
                            objectFit="contain"
                            className="rounded-full"
                            alt={props.data.person.full_name}
                        />
                        :
                        <div className="w-[150px] h-[150px] rounded-full bg-slate-50 flex items-center justify-center">
                            <Icon icon="tabler:camera" className="text-2xl opacity-20" />
                        </div>
                    }
                </div>


                <div className="flex py-4 pr-4 justify-between flex-col">
                    <div className="flex flex-col gap-2">
                        <div>
                            {props.data.person.full_name}
                        </div>

                        <div className="nodrag text-2xl">
                            {props.data.person.contacts?.map(contact => {
                                return (
                                    <a key={contact.id} target="_blank" href={contact.value}
                                       className="text-slate-600 transition-colors hover:text-blue-800">
                                        {icons[contact.type] ?? defaultIcon}
                                    </a>
                                )
                            })}
                        </div>
                    </div>


                    {props.data.person.birth_date || props.data.person.death_date || props.data.person.place_of_birth ?
                        <div className="flex flex-col gap-1">
                            {props.data.person.place_of_birth ?
                                <div className="text-sm text-slate-400">
                                    {props.data.person.place_of_birth}
                                </div>
                                : ""
                            }

                            {props.data.person.birth_date || props.data.person.death_date ?
                                <div className="text-sm text-slate-400">
                                    <FamilyPersonDates person={props.data.person}/>
                                </div>
                                : ""
                            }
                        </div>
                        : ""
                    }
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
