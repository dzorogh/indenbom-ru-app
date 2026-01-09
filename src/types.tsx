import FamilyCoupleNode from "@/components/tree/family-couple-node"
import FamilyPersonNode from "@/components/tree/family-person-node";
import FamilyPersonNodeSmall from "@/components/tree/family-person-node-small";
import FamilyRootNode from "@/components/tree/family-root-node";
import {Node} from "@xyflow/react";

export interface Family {
    id: number,
    title: string,
    slug: string,
    description: string
}

interface CoupleBase {
    id: number;
    husband_id: number;
    wife_id: number;
}

export interface Couple extends CoupleBase {
    husband?: Person;
    wife?: Person;
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

export enum PersonContactType {
    Wikipedia = 'wikipedia',
    Facebook = 'facebook',
    Telegram = 'telegram',
    Vk = 'vk',
    Archive = 'archive',
}

export interface Photo {
    id: number;
    media_url: string,
    description?: string,
    approximate_date?: string,
    place?: string,
    order?: number | null,
    people?: Person[]
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
    parent_couple: Couple;
    full_name: string;
    contacts_count?: number;
    photos_count?: number;
    contacts:
        {
            id: number,
            type: PersonContactType,
            value: string
        }[]
    ,
    avatar_url?: string,
    photos?: Photo[],
    article: string,
    position_on_photo?: string,
    couples?: Couple[]
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
    isRootPerson: boolean,
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

export enum NodeType {
    CoupleNode = 'coupleNode',
    PersonNode = 'personNode',
    PersonNodeSmall = 'personNodeSmall',
    RootNode = 'rootNode'
}

export type PersonNode = Node<PersonNodeData, NodeType.PersonNode>
export type CoupleNode = Node<CoupleNodeData, NodeType.CoupleNode>

