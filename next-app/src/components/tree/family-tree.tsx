"use client"

import React, {useCallback, useLayoutEffect} from 'react';
import {
    Controls,
    type EdgeTypes,
    MiniMap,
    type Node,
    type NodeTypes,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState, useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {Couple, NodeType, Person} from "@/types";
import FamilyCoupleNode from "@/components/tree/family-couple-node";
import FamilyPersonNode from "@/components/tree/family-person-node";
import FamilyPersonNodeSmall from "@/components/tree/family-person-node-small";
import FamilyRootNode from "@/components/tree/family-root-node";
import FamilyCoupleEdge from "@/components/tree/family-couple-edge";
import ELK, {ElkExtendedEdge, ElkNode, LayoutOptions} from 'elkjs/lib/elk.bundled.js';

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
    'elk.direction': 'DOWN'
};

const personWidth = 500;
const personHeight = 150;
const personHeightSmall = 80;

const isSecondPerson = (personId: number, {couples, people, rootPersonId}: FamilyTreeProps) => {
    const person = people.find(p => p.id === personId);

    if (!person) {
        return true
    }

    if (person.id === rootPersonId) {
        return false;
    }

    const noParents = couples.filter(couple => {
        return couple.id === person.parent_couple_id
    }).length === 0;

    const rootPerson = people.find(p => p.id === rootPersonId);

    const rootCouple = couples.find(c => c.id === rootPerson.parent_couple_id);

    const isRootCouple = rootCouple?.wife_id === personId || rootCouple?.husband_id === personId;

    // All without parents, except people of root person

    return noParents && !isRootCouple;
}

const getRootCouple = ({couples, people, rootPersonId}: FamilyTreeProps) => {
    const rootPerson = people.find(p => p.id === rootPersonId);
    return couples.find(c => c.id === rootPerson?.parent_couple_id);
}

const getInitialNodes = (treeProps: FamilyTreeProps): Node[] => {
    const nodes: Node[] = treeProps.people.map((person) => {
        return {
            id: 'person-' + person.id,
            data: {
                person,
                label: person.full_name,
                isRootPerson: person.id === treeProps.rootPersonId
            },
            width: personWidth,
            position: {x: 0, y: 0},
            height: isSecondPerson(person.id, treeProps) ? personHeightSmall : personHeight,
            type: isSecondPerson(person.id, treeProps) ? NodeType.PersonNodeSmall : NodeType.PersonNode,
        }
    });

    const rootCouple = getRootCouple(treeProps)

    if (rootCouple) {
        nodes.push({
            id: 'couple-' + rootCouple.id,
            data: {
                couple: rootCouple,
            },
            width: personWidth,
            height: personHeightSmall,
            position: {x: 0, y: 0},
            type: NodeType.CoupleNode,
            selectable: false,
        })
    }

    return nodes;
}

const getInitialEdges = (treeProps: FamilyTreeProps) => {
    return treeProps.couples.flatMap(couple => {
        const coupleEdges = [];

        const children = treeProps.people.filter(
            person => person.parent_couple_id === couple.id
        );

        const rootCouple = getRootCouple(treeProps);

        if (couple.id === rootCouple?.id) {
            if (couple.husband_id) {
                coupleEdges.push({
                    id: `edge-couple-${couple.id}-husband`,
                    source: 'person-' + couple.husband_id,
                    target: 'couple-' + couple.id,
                    selectable: false,
                });
            }

            if (couple.wife_id) {
                coupleEdges.push({
                    id: `edge-couple-${couple.id}-wife`,
                    source: 'person-' + couple.wife_id,
                    target: 'couple-' + couple.id,
                    selectable: false,
                });
            }

            children.forEach(child => {
                coupleEdges.push({
                    id: `edge-couple-${couple.id}-child-${child.id}`,
                    source: 'couple-' + couple.id,
                    target: 'person-' + child.id,
                    selectable: false,
                });
            });
        } else {
            let firstPersonId = null;
            let secondPersonId = null;

            if (couple.husband_id && !isSecondPerson(couple.husband_id, treeProps)) {
                firstPersonId = couple.husband_id;
                secondPersonId = couple.wife_id;
            }

            if (couple.wife_id && !isSecondPerson(couple.wife_id, treeProps)) {
                firstPersonId = couple.wife_id;
                secondPersonId = couple.husband_id;
            }

            if (!firstPersonId) {
                const rootPerson = treeProps.people.find(p => p.id === treeProps.rootPersonId);

                const couplesOfWife = treeProps.couples.filter(c => c.wife_id === couple.wife_id);

                if (couplesOfWife.filter(c => c.id === rootPerson.parent_couple_id)) {
                    firstPersonId = couple.wife_id;
                    secondPersonId = couple.husband_id;
                } else {
                    firstPersonId = couple.husband_id;
                    secondPersonId = couple.wife_id;
                }
            }

            // Edge between wife and husband
            if (firstPersonId && secondPersonId) {
                coupleEdges.push({
                    id: `edge-couple-${couple.id}-first`,
                    source: 'person-' + firstPersonId,
                    target: 'person-' + secondPersonId,
                    type: 'couple',
                    selectable: false,
                });
            }

            children.forEach(child => {
                if (secondPersonId) {
                    coupleEdges.push({
                        id: `edge-couple-${couple.id}-child-${child.id}-second`,
                        source: 'person-' + secondPersonId,
                        target: 'person-' + child.id,
                        selectable: false,
                    });
                } else {
                    coupleEdges.push({
                        id: `edge-couple-${couple.id}-child-${child.id}-first`,
                        source: 'person-' + firstPersonId,
                        target: 'person-' + child.id,
                        selectable: false,
                    });
                }

            });
        }

        return coupleEdges;
    });
}

const getLayoutedElements = (nodes: ElkNode[], edges: ElkExtendedEdge[], options: LayoutOptions) => {
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
        .then((layoutedGraph) => ({
            nodes: layoutedGraph.children.map((node) => ({
                ...node,
                // React Flow expects a position property on the node instead of `x`
                // and `y` fields.
                position: {x: node.x, y: node.y},
            })) as ElkNode[],

            edges: layoutedGraph.edges as ElkExtendedEdge[],
        }))
        .catch(console.error);
};

const nodeTypes: NodeTypes = {
    [NodeType.CoupleNode]: FamilyCoupleNode,
    [NodeType.PersonNode]: FamilyPersonNode,
    [NodeType.PersonNodeSmall]: FamilyPersonNodeSmall,
    [NodeType.RootNode]: FamilyRootNode,
}

const edgeTypes: EdgeTypes = {
    couple: FamilyCoupleEdge
}

const LayoutFlow = (treeProps: FamilyTreeProps) => {
    const {fitView} = useReactFlow();

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const initialNodes = getInitialNodes(treeProps);
    const initialEdges = getInitialEdges(treeProps);

    const onLayout = useCallback(({useInitialNodes = false}) => {
            const ns = useInitialNodes ? initialNodes : nodes;
            const es = useInitialNodes ? initialEdges : edges;

            getLayoutedElements(ns, es, elkOptions).then(
                (data) => {
                    if (data) {
                        setNodes(data.nodes);
                        setEdges(data.edges);
                    }
                },
            );
        }, [edges, nodes]
    );

    useLayoutEffect(() => {
        onLayout({useInitialNodes: true});
    }, []);


    const nodeClassName = (node) => node.type;

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            nodesConnectable={false}
            nodesDraggable={false}
            minZoom={0.1}
            fitView={true}
        >
            <MiniMap zoomable pannable nodeClassName={nodeClassName}/>

            <Controls showInteractive={false}/>
        </ReactFlow>
    );
};

export interface FamilyTreeProps {
    couples: Couple[];
    people: Person[];
    rootPersonId: number;
}

export const FamilyTree = ({couples, people, rootPersonId}: FamilyTreeProps) => {

    return (
        <ReactFlowProvider>
            <LayoutFlow couples={couples} people={people} rootPersonId={rootPersonId}/>
        </ReactFlowProvider>
    );
}
