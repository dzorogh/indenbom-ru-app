"use client"

import React from 'react';
import {
    Controls,
    MiniMap,
    Node,
    ReactFlow,
    ReactFlowProvider, useEdgesState, useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Dagre from '@dagrejs/dagre';
import {Couple, nodeTypes, NodeTypes, Person} from "@/types";

const personWidth = 500;
const personHeight = 150;
const personHeightSmall = 80;

const isSecondPerson = (personId: number, couples: Couple[], people: Person[], rootPersonId: number) => {
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

    const selfCouplesAsHusband = couples.filter(couple => {
        return couple.wife_id === person.id || couple.husband_id === person.id
    });

    const rootPerson = people.find(p => p.id === rootPersonId);

    const rootPersonParentCouple = selfCouplesAsHusband.find(c => c.id === rootPerson.parent_couple_id);

    // All without parents, except father of root person

    return noParents && rootPersonParentCouple?.husband_id !== person.id;
}

const getInitialNodes = (couples: Couple[], people: Person[], rootPersonId: number) : Node[] => {
    return  people.map((person) => {
        return {
            id: 'person-' + person.id,
            data: {
                person,
                label: person.full_name,
                isRootPerson: person.id === rootPersonId
            },
            width: personWidth,
            position: {x: 0, y: 0},
            height: isSecondPerson(person.id, couples, people, rootPersonId) ? personHeightSmall : personHeight,
            type: isSecondPerson(person.id, couples, people, rootPersonId) ? NodeTypes.PersonNodeSmall : NodeTypes.PersonNode,
        }
    });
}

const getInitialEdges = (couples: Couple[], people: Person[], rootPersonId: number) => {
    return couples.flatMap(couple => {
        const coupleEdges = [];

        let firstPersonId = null;
        let secondPersonId = null;

        if (couple.husband_id && !isSecondPerson(couple.husband_id, couples, people, rootPersonId)) {
            firstPersonId = couple.husband_id;
            secondPersonId = couple.wife_id;
        }

        if (couple.wife_id && !isSecondPerson(couple.wife_id, couples, people, rootPersonId)) {
            firstPersonId = couple.wife_id;
            secondPersonId = couple.husband_id;
        }

        if (!firstPersonId) {
            const rootPerson = people.find(p => p.id === rootPersonId);

            const couplesOfWife = couples.filter(c => c.wife_id === couple.wife_id);

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
                type: 'straight',
                minlen: 1.5
            });
        }

        const children = people.filter(
            person => person.parent_couple_id === couple.id
        );

        children.forEach(child => {
            if (secondPersonId) {
                coupleEdges.push({
                    id: `edge-couple-${couple.id}-child-${child.id}-second`,
                    source: 'person-' + secondPersonId,
                    target: 'person-' + child.id,
                    type: 'smoothstep',
                    animated: true,
                    minlen: 1.5
                });
            } else {
                coupleEdges.push({
                    id: `edge-couple-${couple.id}-child-${child.id}-second`,
                    source: 'person-' + firstPersonId,
                    target: 'person-' + child.id,
                    type: 'smoothstep',
                    animated: true,
                    minlen: 1.5
                });
            }

        });

        return coupleEdges;
    });
}

const getLayoutedElements = (nodes, edges) => {
    const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

    g.setGraph({
        rankdir: 'vertical',
        ranker: 'tight-tree'
    });

    edges.forEach((edge) => g.setEdge(edge.source, edge.target, {weight: edge.weight, minlen: edge.minlen}));

    nodes.forEach((node) =>
        g.setNode(node.id, {
            ...node,
            width: node.width ?? 0,
            height: node.height ?? 0,
        }),
    );

    Dagre.layout(g);

    return {
        nodes: nodes.map((node) => {
            const position = g.node(node.id);
            // We are shifting the dagre node position (anchor=center center) to the top left
            // so it matches the React Flow node anchor point (top left).
            const x = position.x - (node.measured?.width ?? 0) / 2;
            const y = position.y - (node.measured?.height ?? 0) / 2;

            return {...node, position: {x, y}};
        }),
        edges,
    };
};

const LayoutFlow = ({couples, people, rootPersonId}: FamilyTreeProps) => {
    const [nodes] = useNodesState(getInitialNodes(couples, people, rootPersonId));
    const [edges] = useEdgesState(getInitialEdges(couples, people, rootPersonId));

    const layouted = getLayoutedElements(nodes, edges);


    const nodeClassName = (node) => node.type;

    return (
        <ReactFlow
            nodes={layouted.nodes}
            edges={layouted.edges}
            nodeTypes={nodeTypes}
            nodesConnectable={false}
            nodesDraggable={false}
            fitView
            minZoom={0.1}
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
