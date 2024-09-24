import React, {memo} from 'react';
import {Handle, NodeProps, Position} from '@xyflow/react';
import FamilyPersonDates from "./family-person-dates";
import {PersonNode} from "../types";

export default memo(function FamilyPersonNodeSmall(props: NodeProps<PersonNode>) {
    return (
        <>
            <div
                className="h-full px-3 py-2 z-10 flex justify-between flex-col rounded-lg border-zinc-300 border cursor-default">

                <div className="text-sm">
                    {props.data.person.full_name}
                </div>

                <div>
                    <div className="text-xs text-slate-400">
                        <FamilyPersonDates person={props.data.person}/>
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
