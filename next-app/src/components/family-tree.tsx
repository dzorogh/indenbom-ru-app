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

const personWidth = 450;
const personHeight = 150;
const personHeightSmall = 75;

const getInitialNodes = (couples: Couple[], people: Person[]) : Node[] => {
    const isSecondPerson = (person: Person) => {
        return couples.filter(couple => {
            return couple.second_person_id === person.id
        }).length > 0
    }

    return  people.map((person) => {
        return {
            id: 'person-' + person.id,
            data: {
                person,
                label: person.full_name
            },
            width: personWidth,
            position: {x: 0, y: 0},
            height: isSecondPerson(person) ? personHeightSmall : personHeight,
            type: isSecondPerson(person) ? NodeTypes.PersonNodeSmall : NodeTypes.PersonNode,
        }
    });
}

const getInitialEdges = (couples: Couple[], people: Person[]) => {
    return couples.flatMap(couple => {
        const coupleEdges = [];

        if (couple.second_person_id && couple.first_person_id) {
            coupleEdges.push({
                id: `edge-couple-${couple.id}-first`,
                source: 'person-' + couple.first_person_id,
                target: 'person-' + couple.second_person_id,
                type: 'straight',
                minlen: 1.5
            });
        }


        const children = people.filter(
            person => person.parent_couple_id === couple.id
        );

        children.forEach(child => {

            if (couple.second_person_id) {
                coupleEdges.push({
                    id: `edge-couple-${couple.id}-child-${child.id}-second`,
                    source: 'person-' + couple.second_person_id,
                    target: 'person-' + child.id,
                    type: 'smoothstep',
                    animated: true,
                    minlen: 1.5
                });
            } else {
                coupleEdges.push({
                    id: `edge-couple-${couple.id}-child-${child.id}-second`,
                    source: 'person-' + couple.first_person_id,
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

const LayoutFlow = ({couples, people}: FamilyTreeProps) => {
    const [nodes] = useNodesState(getInitialNodes(couples, people));
    const [edges] = useEdgesState(getInitialEdges(couples, people));

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
}

export const FamilyTree = ({couples, people}: FamilyTreeProps) => {

    return (
        <ReactFlowProvider>
            <LayoutFlow couples={couples} people={people}/>
        </ReactFlowProvider>
    );
}
