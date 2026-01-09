import React, { memo } from 'react';
import { Handle, NodeProps, Position } from '@xyflow/react';
import { CoupleNode } from "@/types";
import { Add01Icon } from "hugeicons-react";

export default memo(function FamilyCoupleNode(props: NodeProps<CoupleNode>) {
    return (
        <>
            <div className="flex justify-center h-full w-full">
                <div className="rounded-full h-full aspect-square  bg-secondary border flex items-center justify-center">
                    <Add01Icon />
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
