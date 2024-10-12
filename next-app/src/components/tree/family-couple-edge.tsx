import React, {type FC} from 'react';
import {
    getBezierPath,
    EdgeLabelRenderer,
    BaseEdge,
    type EdgeProps,
    type Edge,
} from '@xyflow/react';
import {Add02Icon} from "hugeicons-react";

const FamilyCoupleEdge: FC<EdgeProps<Edge<{ label: string }>>> = ({
                                                                id,
                                                                sourceX,
                                                                sourceY,
                                                                targetX,
                                                                targetY,
                                                                sourcePosition,
                                                                targetPosition,
                                                                data,
                                                            }) => {
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return (
        <>
            <BaseEdge id={id} path={edgePath} className="stroke-amber-700" interactionWidth={null} />
            <EdgeLabelRenderer>
                <div
                    style={{
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                    }}
                    className="z-20 nodrag nopan absolute bg-secondary text-secondary-foreground p-1 rounded"
                >
                    <Add02Icon />
                </div>
            </EdgeLabelRenderer>
        </>
    );
};

export default FamilyCoupleEdge;
