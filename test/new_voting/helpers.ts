import { solidityPackedKeccak256 } from "ethers";

interface NodeInterface {
    price: number;
    weight: number;
    hash: string;
    next: Node | null;
    prev: Node | null;
}

export interface UpdateResult {
    price: number;
    weight: number;
    type: "update";
    hash: string;
    next: string | null;
    prev: string | null;
    oldNext: string | null;
    oldPrev: string | null;
}

interface AddResult {
    price: number;
    weight: number;
    hash: string;
    type: "add";
    next: string | null;
    prev: string | null;
}

class Node implements NodeInterface {
    price: number;
    weight: number;
    hash: string;
    next: Node | null = null;
    prev: Node | null = null;
    adressToWeight: Map<string, number> = new Map();

    constructor(price: number, weight: number, address: string) {
        this.price = price;
        this.weight = weight;
        this.hash = solidityPackedKeccak256(["int256", "int256", "uint256"], [price, weight, new Date().getTime() ]);
        this.adressToWeight.set(address, weight);
    }
}

export class LinkedList {
    head: Node | null = null;

    vote(price: number, additionalWeight: number, address: string): UpdateResult | AddResult {
        let current = this.head;
        while (current) {
            if (current.price === price) {
                const userAddressWeight = current.adressToWeight.get(address);
                if (!userAddressWeight) {
                    current.weight += additionalWeight;
                    current.adressToWeight.set(address, additionalWeight);    
                } else {
                    current.weight -= userAddressWeight;
                    current.weight += additionalWeight;
                    current.adressToWeight.set(address, additionalWeight);
                }
                
                

                const curPrev = current.prev;
                const curNext = current.next;

                if (current.prev) current.prev.next = current.next;
                if (current.next) current.next.prev = current.prev;
                if (current === this.head) this.head = current.next;

                this.addSorted(current);

                return {
                    price: current.price,
                    weight: current.weight,
                    type: "update",
                    hash: current.hash,
                    next: current.next ? current.next.hash : null,
                    prev: current.prev ? current.prev.hash : null,
                    oldNext: curNext ? curNext.hash : null,
                    oldPrev: curPrev ? curPrev.hash : null,
                };
            }
            current = current.next;
        }

        const newNode = new Node(price, additionalWeight, address);
        this.addSorted(newNode);

        return {
            price: newNode.price,
            weight: newNode.weight,
            hash: newNode.hash,
            type: "add",
            next: newNode.next ? newNode.next.hash : null,
            prev: newNode.prev ? newNode.prev.hash : null,
        };
    }

    addSorted(newNode: Node): void {
        if (!this.head || newNode.weight > this.head.weight) {
            newNode.next = this.head;
            if (this.head) this.head.prev = newNode;
            this.head = newNode;
            newNode.prev = null;
            return;
        }

        let current = this.head;
        while (current.next && current.next.weight >= newNode.weight) {
            current = current.next;
        }

        newNode.next = current.next;
        if (current.next) current.next.prev = newNode;
        current.next = newNode;
        newNode.prev = current;
    }

    getHighest(): number | null | undefined {
        return this.head?.price;
    }

    display(): { price: number; weight: number; hash: string; prev: number | null; next: number | null, addressToWeight: Map<string, number> }[] {
        let current = this.head;
        const nodes: { price: number; weight: number; hash: string; prev: number | null; next: number | null, addressToWeight: Map<string, number> }[] = [];
        while (current) {
            nodes.push({
                price: current.price,
                weight: current.weight,
                hash: current.hash,
                prev: current.prev ? current.prev.price : null,
                next: current.next ? current.next.price : null,
                addressToWeight: current.adressToWeight
            });
            current = current.next;
        }
        return nodes;
    }
    clear(): void {
        let current = this.head;
        while (current) {
            const next = current.next;
            current.next = null;
            current.prev = null;
            current = next;
        }
        this.head = null;
    }

    clone(): LinkedList {
        const newLinkedList = new LinkedList();
    
        if (!this.head) {
            return newLinkedList;
        }
    
        let current: Node | null = this.head;
        const nodeMap = new Map<Node, Node>();
    
        while (current) {
            const newNode = new Node(current.price, current.weight, "");
            newNode.hash = current.hash;
            newNode.adressToWeight = new Map(current.adressToWeight);
            nodeMap.set(current, newNode);
            current = current.next;
        }
    
        current = this.head;
        while (current) {
            const clonedNode = nodeMap.get(current)!;
            clonedNode.next = current.next ? nodeMap.get(current.next) || null : null;
            clonedNode.prev = current.prev ? nodeMap.get(current.prev) || null : null;
            if (!clonedNode.prev) {
                newLinkedList.head = clonedNode;
            }
            current = current.next;
        }
    
        return newLinkedList;
    }
    
    
}
