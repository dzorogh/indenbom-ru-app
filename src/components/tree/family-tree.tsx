"use client"

import React, { useCallback, useLayoutEffect } from 'react';
import {
    Controls,
    type EdgeTypes,
    MiniMap,
    type Node,
    type NodeTypes,
    useViewport,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
    useReactFlow, Panel, EdgeProps,
    ConnectionLineType,
    Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Couple, NodeType, Person } from "@/types";
import FamilyCoupleNode from "@/components/tree/family-couple-node";
import FamilyPersonNode from "@/components/tree/family-person-node";
import FamilyPersonNodeSmall from "@/components/tree/family-person-node-small";
import FamilyRootNode from "@/components/tree/family-root-node";
import ELK, { ElkExtendedEdge, ElkNode, LayoutOptions } from 'elkjs/lib/elk.bundled.js';
import { Button } from "@/components/ui/button";
import { CenterFocusIcon } from "hugeicons-react";

const elk = new ELK();

// Elk has a *huge* amount of options to configure. To see everything you can
// tweak check out:
//
// - https://www.eclipse.org/elk/reference/algorithms.html
// - https://www.eclipse.org/elk/reference/options.html
const elkOptions = {
    'elk.algorithm': 'layered',
    'elk.layered.spacing.nodeNodeBetweenLayers': '100',
    'elk.spacing.nodeNode': '80',
    'elk.direction': 'DOWN',
    'elk.margins': '200',
};

const personWidth = 500;
const personHeight = 150;
const personHeightSmall = 80;


const coupleNode = (couple: Couple): Node => {
    return {
        id: 'couple-' + couple.id,
        data: {
            couple,
        },
        width: 1,
        height: 1,
        position: { x: 0, y: 0 },
        type: NodeType.CoupleNode,
        selectable: false,
    }
}

const personNode = (person: Person, isRootPerson: boolean): Node => {
    return {
        id: 'person-' + person.id,
        data: {
            person,
            label: person.full_name,
            isRootPerson: isRootPerson
        },
        width: personWidth,
        position: { x: 0, y: 0 },
        // height: isSmall ? personHeightSmall : personHeight,
        height: personHeight,
        // type: isSmall ? NodeType.PersonNodeSmall : NodeType.PersonNode,
        type: NodeType.PersonNode,
    }
}

const getInitialNodes = (treeProps: FamilyTreeProps): Node[] => {
    const nodes: Node[] = treeProps.people.map((person) => {
        return personNode(person, person.id === treeProps.rootPersonId);
    });

    treeProps.couples.forEach(couple => {
        nodes.push(coupleNode(couple));
    });

    return nodes;
}

const getInitialEdges = (treeProps: FamilyTreeProps) => {
    return treeProps.couples.flatMap(couple => {
        const coupleEdges = [] as Edge[];

        const children = treeProps.people.filter(
            person => person.parent_couple_id === couple.id
        );

        // Edge between couple and husband
        if (couple.husband_id) {
            coupleEdges.push({
                id: `edge-couple-${couple.id}-husband`,
                source: 'person-' + couple.husband_id,
                target: 'couple-' + couple.id,
                selectable: false,
                targetHandle: 'top',
                type: ConnectionLineType.SmoothStep
            });
        }

        // Edge between couple and wife
        if (couple.wife_id) {
            coupleEdges.push({
                id: `edge-couple-${couple.id}-wife`,
                source: 'person-' + couple.wife_id,
                target: 'couple-' + couple.id,
                selectable: false,
                targetHandle: 'top',
                type: ConnectionLineType.SmoothStep
            });
        }

        children.forEach(child => {
            // Edge between couple and child
            coupleEdges.push({
                id: `edge-couple-${couple.id}-child-${child.id}`,
                source: 'couple-' + couple.id,
                target: 'person-' + child.id,
                selectable: false,
                type: ConnectionLineType.SmoothStep
            });
        });

        return coupleEdges;
    });
}

const getLayoutedElements = (nodes: ElkNode[], edges: ElkExtendedEdge[], options: LayoutOptions, couples: Couple[]) => {
    const graph: ElkNode = {
        id: 'root',
        layoutOptions: options,
        children: nodes.map((node) => ({
            ...node,
            // Adjust the target and source handle positions based on the layout
            // direction.
            targetPosition: 'top',
            sourcePosition: 'bottom',
        })),
        edges: edges,
    };

    return elk
        .layout(graph)
        .then((layoutedGraph) => {
            // Центрируем ноды пар между мужем и женой перед преобразованием в React Flow формат
            couples.forEach(couple => {
                const coupleNode = layoutedGraph.children.find(n => n.id === 'couple-' + couple.id);
                if (!coupleNode) return;

                const husbandNode = couple.husband_id ? layoutedGraph.children.find(n => n.id === 'person-' + couple.husband_id) : null;
                const wifeNode = couple.wife_id ? layoutedGraph.children.find(n => n.id === 'person-' + couple.wife_id) : null;

                if (husbandNode && wifeNode) {
                    // Вычисляем центр между мужем и женой
                    const husbandCenterX = (husbandNode.x || 0) + (husbandNode.width || personWidth) / 2;
                    const wifeCenterX = (wifeNode.x || 0) + (wifeNode.width || personWidth) / 2;
                    const centerX = (husbandCenterX + wifeCenterX) / 2;
                    
                    // Устанавливаем позицию ноды пары так, чтобы она была по центру
                    const coupleWidth = coupleNode.width || personHeightSmall;
                    coupleNode.x = centerX - coupleWidth / 2;
                } else if (husbandNode) {
                    // Если есть только муж, центрируем относительно него
                    const husbandCenterX = (husbandNode.x || 0) + (husbandNode.width || personWidth) / 2;
                    const coupleWidth = coupleNode.width || personHeightSmall;
                    coupleNode.x = husbandCenterX - coupleWidth / 2;
                } else if (wifeNode) {
                    // Если есть только жена, центрируем относительно неё
                    const wifeCenterX = (wifeNode.x || 0) + (wifeNode.width || personWidth) / 2;
                    const coupleWidth = coupleNode.width || personHeightSmall;
                    coupleNode.x = wifeCenterX - coupleWidth / 2;
                }
            });

            const layoutedNodes = layoutedGraph.children.map((node) => ({
                ...node,
                // React Flow expects a position property on the node instead of `x`
                // and `y` fields.
                position: { x: node.x, y: node.y },
            })) as ElkNode[];

            return {
                nodes: layoutedNodes,
                edges: layoutedGraph.edges as ElkExtendedEdge[],
            };
        })
        .catch(console.error);
};

const nodeTypes: NodeTypes = {
    [NodeType.CoupleNode]: FamilyCoupleNode,
    [NodeType.PersonNode]: FamilyPersonNode,
    [NodeType.PersonNodeSmall]: FamilyPersonNodeSmall,
    [NodeType.RootNode]: FamilyRootNode,
}

const LayoutFlow = (treeProps: FamilyTreeProps) => {
    const { fitView, getViewport, setViewport, getNode } = useReactFlow();

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const initialNodes = getInitialNodes(treeProps);
    const initialEdges = getInitialEdges(treeProps);

    const onLayout = useCallback(({ useInitialNodes = false }) => {
        const ns = useInitialNodes ? initialNodes : nodes;
        const es = useInitialNodes ? initialEdges : edges;

        getLayoutedElements(ns, es, elkOptions, treeProps.couples).then(
            (data) => {
                if (data) {
                    setNodes(data.nodes);
                    setEdges(data.edges);
                }
            },
        );
    }, [edges, nodes, treeProps.couples]
    );

    useLayoutEffect(() => {
        onLayout({ useInitialNodes: true });
    }, []);

    const focusOnRootPerson = (duration: number) => {
        const n = getNode('person-' + treeProps.rootPersonId)
        fitView({ nodes: [n], duration, maxZoom: 0.7 });
    }

    const focusOnRootPersonFast = useCallback(() => {
        focusOnRootPerson(0)
    }, [setViewport, getNode]);

    const focusOnRootPersonSlow = useCallback(() => {
        focusOnRootPerson(300)
    }, [setViewport, getNode]);

    const nodeClassName = (node) => node.type;

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            nodesConnectable={false}
            nodesDraggable={false}
            minZoom={0.1}
            fitView
            onNodesChange={focusOnRootPersonFast}
        >
            <Controls showInteractive={false} />

            <Panel position="top-right">
                <Button variant="outline" onClick={focusOnRootPersonSlow}><CenterFocusIcon /></Button>
            </Panel>
        </ReactFlow>
    );
};

export interface FamilyTreeProps {
    couples: Couple[];
    people: Person[];
    rootPersonId: number;
}

export const FamilyTree = ({ couples, people, rootPersonId }: FamilyTreeProps) => {

    return (
        <ReactFlowProvider>
            <LayoutFlow couples={couples} people={people} rootPersonId={rootPersonId} />
        </ReactFlowProvider>
    );
}