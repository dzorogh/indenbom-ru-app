import FamilyCoupleNode from "./components/family-couple-node";
import FamilyPersonNode from "./components/family-person-node";
import FamilyPersonNodeSmall from "./components/family-person-node-small";
import FamilyRootNode from "./components/family-root-node";
import {Node} from "@xyflow/react";

interface CoupleBase {
    id: number;
    first_person_id: number;
    second_person_id: number;
}

export interface Couple extends CoupleBase {
    firstPerson?: Person;
    secondPerson?: Person;
    children?: Person[];
}

export interface Couple extends CoupleBase {
}

export enum DatePrecision {
    Exact = 'exact',
    Approximate = 'approximate',
    Year = 'year',
    Decade = 'decade',
    Century = 'century'
}

export interface PersonBase {
    id: number;
    created_at: string;
    updated_at: string;
    first_name: string;
    middle_name: string | null;
    last_name: string | null;
    place_of_birth: string | null;
    birth_date: string | null;
    death_date: string | null;
    birth_date_precision: DatePrecision;
    death_date_precision: DatePrecision;
    parent_couple_id: number | null;
    full_name: string;
    contacts: [
        {
            id: number,
            type: string,
            value: string
        }
    ],
    avatar_url?: string
}

export interface Person extends PersonBase {
    couples?: Couple[]
}

export interface Person extends PersonBase {
}

export enum TreeNodeType {
    Couple = 'couple',
    Person = 'person',
    Root = 'root'
}


export interface BaseNodeData extends Record<string, unknown> {
    // size: number[],
    type: TreeNodeType
}

export interface PersonNodeData extends BaseNodeData {
    type: TreeNodeType.Person,
    person: Person,
}

export interface CoupleNodeData extends BaseNodeData {
    type: TreeNodeType.Couple,
    couple: Couple,
    children?: NodeData[],
}

export interface RootNodeData extends BaseNodeData {
    type: TreeNodeType.Root,
    children: NodeData[],
}

export type NodeData = CoupleNodeData | PersonNodeData | RootNodeData

export enum NodeTypes {
    CoupleNode = 'coupleNode',
    PersonNode = 'personNode',
    PersonNodeSmall = 'personNodeSmall',
    RootNode = 'rootNode'
}

export const nodeTypes = {
    [NodeTypes.CoupleNode]: FamilyCoupleNode,
    [NodeTypes.PersonNode]: FamilyPersonNode,
    [NodeTypes.PersonNodeSmall]: FamilyPersonNodeSmall,
    [NodeTypes.RootNode]: FamilyRootNode,
}

export type PersonNode = Node<PersonNodeData, NodeTypes.PersonNode>
export type CoupleNode = Node<CoupleNodeData, NodeTypes.CoupleNode>
