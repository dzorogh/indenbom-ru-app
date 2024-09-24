import React, {memo} from 'react';
import {Handle, NodeProps, Position} from '@xyflow/react';
import {CoupleNode} from "../types";

export default memo(function FamilyCoupleNode(props: NodeProps<CoupleNode>) {
    return (
        <>
            {props.data.children?.length ? <div className="bg-cyan-600 w-full h-1/2 absolute bottom-0"></div> : null}

            <Handle
                type="target"
                position={Position.Left}
                id="left"
                isConnectable={false}
            />

            <Handle
                type="target"
                position={Position.Right}
                id="right"
                isConnectable={false}
            />

            {props.data.children?.length ? <Handle
                type="source"
                position={Position.Bottom}
                id="bottom"
                isConnectable={false}
            /> : null}
        </>
    );
});
