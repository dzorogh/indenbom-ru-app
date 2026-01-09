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
    'elk.spacing.nodeNode': '40',
    'elk.direction': 'DOWN',
    'elk.margins': '200',
    // Используем NODES_AND_EDGES для учета порядка узлов и ребер
    'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES',
    'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
    // Принудительно соблюдаем порядок модели узлов при минимизации пересечений
    'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
    'elk.layered.crossingMinimization.forceNodeModelOrder': 'true',
    'elk.layered.thoroughness': '7',
    'elk.layered.priority.direction': '1',
    'elk.layered.priority.straightness': '1',
    'elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
    'elk.layered.nodePlacement.bk.edgeStraightening': 'IMPROVE_STRAIGHTNESS',
    // Устанавливаем влияние порядка модели на максимум
    'elk.layered.considerModelOrder.crossingCounterNodeInfluence': '0',
    'elk.layered.considerModelOrder.crossingCounterPortInfluence': '0',
    'elk.layered.considerModelOrder.portModelOrder': 'true',
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

    return nodes;
}

const getInitialEdges = (treeProps: FamilyTreeProps) => {
    return treeProps.couples.flatMap(couple => {
        const coupleEdges = [] as Edge[];

        const children = treeProps.people.filter(
            person => person.parent_couple_id === couple.id
        );

        // // Edge between couple and husband
        // if (couple.husband_id) {
        //     coupleEdges.push({
        //         id: `edge-couple-${couple.id}-husband`,
        //         source: 'person-' + couple.husband_id,
        //         target: 'couple-' + couple.id,
        //         selectable: false,
        //         targetHandle: 'top',
        //         type: ConnectionLineType.SmoothStep
        //     });
        // }

        // // Edge between couple and wife
        // if (couple.wife_id) {
        //     coupleEdges.push({
        //         id: `edge-couple-${couple.id}-wife`,
        //         source: 'person-' + couple.wife_id,
        //         target: 'couple-' + couple.id,
        //         selectable: false,
        //         targetHandle: 'top',
        //         type: ConnectionLineType.SmoothStep
        //     });
        // }

        // Edge between couple and husband and wife
        if (couple.husband_id && couple.wife_id) {
            // Не создаем ребро между мужем и женой, чтобы не нарушать иерархию
        }

        children.forEach(child => {
            // Edge between couple and child
            // coupleEdges.push({
            //     id: `edge-couple-${couple.id}-child-${child.id}`,
            //     source: 'couple-' + couple.id,
            //     target: 'person-' + child.id,
            //     selectable: false,
            //     type: ConnectionLineType.SmoothStep
            // });

            // Edge between husband and child
            if (couple.husband_id) {
                coupleEdges.push({
                    id: `edge-couple-${couple.id}-husband-child-${child.id}`,
                    source: 'person-' + couple.husband_id,
                    target: 'person-' + child.id,
                });
            }
            
            // Edge between wife and child
            if (couple.wife_id) {
                coupleEdges.push({
                    id: `edge-couple-${couple.id}-wife-child-${child.id}`,
                    source: 'person-' + couple.wife_id,
                    target: 'person-' + child.id,
                });
            }
        });

        return coupleEdges;
    });
}

const getLayoutedElements = (nodes: ElkNode[], edges: ElkExtendedEdge[], options: LayoutOptions, couples: Couple[], people: Person[]) => {
    // Создаем карту приоритетов для пар: муж и жена получают одинаковый приоритет
    // Также создаем карту для определения порядка узлов в паре
    const priorityMap = new Map<string, number>();
    const orderMap = new Map<string, number>();
    
    // Функция для парсинга даты рождения (для сортировки по возрасту)
    const parseBirthDate = (birthDate: string | null): number => {
        if (!birthDate) return Infinity; // Люди без даты рождения идут в конец
        
        // Пытаемся распарсить дату в разных форматах
        // Формат может быть: "19.02.2016", "2016-02-19", "2020-01-29", "2016" и т.д.
        const dateStr = birthDate.trim();
        
        // Сначала пытаемся распарсить как YYYY-MM-DD (ISO формат)
        const isoMatch = dateStr.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
        if (isoMatch) {
            const year = parseInt(isoMatch[1], 10);
            const month = parseInt(isoMatch[2], 10);
            const day = parseInt(isoMatch[3], 10);
            // Возвращаем timestamp для точной сортировки
            return new Date(year, month - 1, day).getTime();
        }
        
        // Пытаемся распарсить как полную дату (DD.MM.YYYY)
        const dateMatch = dateStr.match(/(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{4})/);
        if (dateMatch) {
            const year = parseInt(dateMatch[3], 10);
            const month = parseInt(dateMatch[2], 10);
            const day = parseInt(dateMatch[1], 10);
            // Возвращаем timestamp для точной сортировки
            return new Date(year, month - 1, day).getTime();
        }
        
        // Пытаемся извлечь только год
        const yearMatch = dateStr.match(/\d{4}/);
        if (yearMatch) {
            return parseInt(yearMatch[0], 10) * 10000; // Умножаем на 10000 для сортировки по году
        }
        
        return Infinity;
    };
    
    // Сначала собираем все пары и присваиваем им orderId
    // Используем маленькие orderId для пар, чтобы они группировались в начале
    let coupleOrderIdCounter = 0;
    couples.forEach((couple, coupleIndex) => {
        // Используем одинаковый приоритет для мужа и жены в паре
        // Используем очень большие приоритеты (200000+) для пар, чтобы они группировались вместе
        // и не разделялись детьми других пар
        // Приоритеты пар должны быть выше приоритетов детей (100000+), чтобы пары не разделялись
        const priority = 200000 + coupleIndex;
        
        // Используем последовательные маленькие orderId для пар
        // Это гарантирует, что пары будут группироваться вместе в начале слоя
        const baseOrderId = coupleOrderIdCounter;
        coupleOrderIdCounter += 2; // Резервируем место для мужа и жены
        
        if (couple.husband_id && couple.wife_id) {
            // Муж и жена получают одинаковый приоритет
            priorityMap.set('person-' + couple.husband_id, priority);
            priorityMap.set('person-' + couple.wife_id, priority);
            
            // Устанавливаем очень близкие orderId для мужа и жены (разница в 1)
            // Это помогает алгоритму разместить их рядом
            orderMap.set('person-' + couple.husband_id, baseOrderId);
            orderMap.set('person-' + couple.wife_id, baseOrderId + 1);
        } else if (couple.husband_id) {
            priorityMap.set('person-' + couple.husband_id, priority);
            orderMap.set('person-' + couple.husband_id, baseOrderId);
            coupleOrderIdCounter -= 1; // Используем только одно место
        } else if (couple.wife_id) {
            priorityMap.set('person-' + couple.wife_id, priority);
            orderMap.set('person-' + couple.wife_id, baseOrderId);
            coupleOrderIdCounter -= 1; // Используем только одно место
        }
        
        // Находим детей пары и сортируем их по возрасту
        const children = people.filter(
            person => person.parent_couple_id === couple.id
        );
        
        // Сортируем детей по дате рождения (от старшего к младшему)
        const sortedChildren = [...children].sort((a, b) => {
            const dateA = parseBirthDate(a.birth_date);
            const dateB = parseBirthDate(b.birth_date);
            const result = dateA - dateB;
            // Логируем для отладки
            if (children.length > 1) {
                console.log(`Sorting children of couple ${couple.id}:`, {
                    childA: a.full_name,
                    birthDateA: a.birth_date,
                    parsedA: dateA,
                    childB: b.full_name,
                    birthDateB: b.birth_date,
                    parsedB: dateB,
                    result,
                    sortedOrder: result < 0 ? `${a.full_name} before ${b.full_name}` : `${b.full_name} before ${a.full_name}`
                });
            }
            return result;
        });
        
        // Устанавливаем приоритет и порядок для детей
        // Используем приоритеты с большими различиями для детей, чтобы порядок строго учитывался
        // Базовый приоритет для детей пары: 100000 + coupleIndex * 10000
        // Каждый ребенок получает приоритет + childIndex * 100, чтобы старший имел меньший приоритет
        // Используем очень большие числа для изоляции приоритетов детей от других узлов
        sortedChildren.forEach((child, childIndex) => {
            // Используем приоритет с учетом порядка: меньший приоритет = раньше в порядке
            // Используем очень большие числа (100000+) для изоляции от других узлов
            const childrenPriority = 100000 + coupleIndex * 10000 + childIndex * 100;
            priorityMap.set('person-' + child.id, childrenPriority);
            // Порядок детей: используем большое базовое значение (10000) + coupleIndex * 1000 + childIndex
            // Это гарантирует, что дети будут после всех пар (которые имеют orderId < 10000)
            // Меньший orderId = раньше в порядке (слева)
            orderMap.set('person-' + child.id, 10000 + coupleIndex * 1000 + childIndex);
        });
        
        // Логируем финальный порядок детей
        if (sortedChildren.length > 1) {
            console.log(`Final order for couple ${couple.id} children:`, 
                sortedChildren.map((child, idx) => ({
                    index: idx,
                    name: child.full_name,
                    birthDate: child.birth_date,
                    orderId: 10000 + coupleIndex * 1000 + idx
                }))
            );
        }
    });

    const graph: ElkNode = {
        id: 'root',
        layoutOptions: options,
        children: nodes.map((node) => {
            const nodePriority = priorityMap.get(node.id);
            const nodeOrder = orderMap.get(node.id);
            const nodeOptions: LayoutOptions = {
                ...(node.layoutOptions || {}),
            };
            
            // Устанавливаем приоритет для узлов мужа и жены
            // Приоритет влияет на порядок размещения узлов в слое
            if (nodePriority !== undefined) {
                nodeOptions['elk.priority'] = nodePriority.toString();
            }
            
            // Устанавливаем порядок узла для учета порядка модели
            // Это помогает алгоритму разместить узлы в паре рядом друг с другом
            if (nodeOrder !== undefined) {
                nodeOptions['elk.layered.considerModelOrder.orderId'] = nodeOrder.toString();
            }
            
            // Уменьшаем расстояние между узлами в паре и между детьми
            // Используем индивидуальное spacing для узлов с приоритетом
            if (nodePriority !== undefined) {
                // Для пар используем минимальное расстояние
                // Для детей используем минимальное расстояние, чтобы они были ближе друг к другу
                // Пары имеют приоритет >= 200000
                // Дети имеют приоритет >= 100000 и < 200000
                let spacing = '10';
                if (nodePriority >= 200000) {
                    spacing = '5'; // Пары
                } else if (nodePriority >= 100000) {
                    spacing = '5'; // Дети
                }
                nodeOptions['elk.spacing.individual'] = spacing;
            }

            return {
                ...node,
                layoutOptions: nodeOptions,
                // Adjust the target and source handle positions based on the layout
                // direction.
                targetPosition: 'top',
                sourcePosition: 'bottom',
            };
        }),
        edges: edges,
    };

    return elk
        .layout(graph)
        .then((layoutedGraph) => {
            // Собираем отладочную информацию о финальных позициях
            const allNodes = layoutedGraph.children.map((node) => {
                const nodePriority = priorityMap.get(node.id);
                const nodeOrder = orderMap.get(node.id);
                const personId = node.id.replace('person-', '');
                const person = people.find(p => p.id.toString() === personId);
                
                return {
                    id: node.id,
                    personId: personId,
                    name: person?.full_name,
                    birthDate: person?.birth_date,
                    x: node.x ?? null,
                    y: node.y ?? null,
                    width: node.width ?? null,
                    height: node.height ?? null,
                    priority: nodePriority ?? null,
                    orderId: nodeOrder ?? null,
                };
            });
            
            // Группируем узлы по слоям (Y координата)
            const nodesByLayer = new Map<number, typeof allNodes>();
            allNodes.forEach(node => {
                const layer = node.y ?? 0;
                if (!nodesByLayer.has(layer)) {
                    nodesByLayer.set(layer, []);
                }
                nodesByLayer.get(layer)!.push(node);
            });
            
            // Сортируем узлы в каждом слое по X (визуальный порядок)
            nodesByLayer.forEach((nodes, layer) => {
                nodes.sort((a, b) => (a.x ?? 0) - (b.x ?? 0));
            });
            
            const debugLayoutInfo = {
                timestamp: new Date().toISOString(),
                nodes: allNodes.sort((a, b) => {
                    // Сортируем по Y (слой), затем по X (позиция в слое)
                    if ((a.y ?? 0) !== (b.y ?? 0)) return (a.y ?? 0) - (b.y ?? 0);
                    return (a.x ?? 0) - (b.x ?? 0);
                }),
                layers: Array.from(nodesByLayer.entries())
                    .sort(([y1], [y2]) => y1 - y2)
                    .map(([y, nodes]) => ({
                        layerY: y,
                        nodeCount: nodes.length,
                        nodes: nodes.map((node, index) => ({
                            ...node,
                            visualOrderInLayer: index,
                        })),
                    })),
                couples: couples.map((couple, coupleIndex) => {
                    const children = people.filter(p => p.parent_couple_id === couple.id);
                    const sortedChildren = [...children]
                        .map(child => ({
                            person: child,
                            node: layoutedGraph.children.find(n => n.id === 'person-' + child.id),
                        }))
                        .filter(item => item.node)
                        .sort((a, b) => {
                            // Сортируем по X позиции (визуальный порядок)
                            return (a.node?.x ?? 0) - (b.node?.x ?? 0);
                        });
                    
                    return {
                        coupleId: couple.id,
                        coupleIndex,
                        children: sortedChildren.map((item, index) => ({
                            id: item.person.id,
                            name: item.person.full_name,
                            birthDate: item.person.birth_date,
                            x: item.node?.x ?? null,
                            y: item.node?.y ?? null,
                            visualOrder: index,
                            expectedOrder: item.person.birth_date ? 
                                sortedChildren.findIndex(c => c.person.id === item.person.id) : null,
                            priority: priorityMap.get('person-' + item.person.id),
                            orderId: orderMap.get('person-' + item.person.id),
                        })),
                    };
                }),
            };
            
            // Сохраняем в localStorage для отладки
            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem('elk-debug-layout', JSON.stringify(debugLayoutInfo, null, 2));
                    console.log('=== ELK Debug Layout Info ===');
                    console.log('Saved to localStorage. Access via: localStorage.getItem("elk-debug-layout")');
                    console.log('\n📊 Nodes with positions (sorted by layer, then X):');
                    debugLayoutInfo.nodes.forEach((node, idx) => {
                        console.log(`  ${idx + 1}. ${node.name} - x: ${node.x}, y: ${node.y}, priority: ${node.priority}, orderId: ${node.orderId}`);
                    });
                    console.log('\n📋 Layers:');
                    debugLayoutInfo.layers.forEach((layer, idx) => {
                        console.log(`  Layer ${idx + 1} (Y=${layer.layerY}): ${layer.nodeCount} nodes`);
                        layer.nodes.forEach((node, nodeIdx) => {
                            console.log(`    ${nodeIdx + 1}. ${node.name} - x: ${node.x}, visualOrder: ${node.visualOrderInLayer}`);
                        });
                    });
                    console.log('\n👨‍👩‍👧‍👦 Children by couple:');
                    debugLayoutInfo.couples.forEach((couple, idx) => {
                        if (couple.children.length > 0) {
                            console.log(`  Couple ${idx + 1} (ID: ${couple.coupleId}):`);
                            couple.children.forEach((child, childIdx) => {
                                const orderMatch = child.expectedOrder === childIdx ? '✓' : '✗';
                                console.log(`    ${orderMatch} ${child.name} - x: ${child.x}, visualOrder: ${child.visualOrder}, expectedOrder: ${child.expectedOrder}, orderId: ${child.orderId}`);
                            });
                        }
                    });
                    console.log('\n=== Full debug info available in localStorage ===');
                } catch (e) {
                    console.error('Failed to save debug info to localStorage:', e);
                }
            }

            const layoutedNodes = layoutedGraph.children.map((node) => {
                const nodePriority = priorityMap.get(node.id);
                const nodeOrder = orderMap.get(node.id);
                
                // Находим человека для отладки даты рождения
                const personId = node.id.replace('person-', '');
                const person = people.find(p => p.id.toString() === personId);
                
                // Всегда добавляем параметры отладки для всех узлов
                const debugInfo: Record<string, unknown> = {
                    debugPriority: nodePriority ?? null,
                    debugOrderId: nodeOrder ?? null,
                    debugSpacing: nodePriority !== undefined ? (nodePriority >= 100000 ? '20' : '10') : null,
                    debugBirthDate: person?.birth_date ?? null,
                    // Добавляем финальные позиции для отладки
                    debugX: node.x ?? null,
                    debugY: node.y ?? null,
                };
                
                const nodeWithData = node as ElkNode & { data?: Record<string, unknown> };
                
                return {
                    ...node,
                    // React Flow expects a position property on the node instead of `x`
                    // and `y` fields.
                    position: { x: node.x, y: node.y },
                    // Добавляем параметры отладки в data
                    data: {
                        ...(nodeWithData.data || {}),
                        ...debugInfo,
                    },
                };
            }) as ElkNode[];

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

        getLayoutedElements(ns, es, elkOptions, treeProps.couples, treeProps.people).then(
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