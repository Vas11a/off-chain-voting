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

    constructor(price: number, weight: number) {
        this.price = price;
        this.weight = weight;
        this.hash = solidityPackedKeccak256(["int256", "int256", "uint256"], [price, weight, new Date().getTime() ]);
    }
}

export class LinkedList {
    head: Node | null = null;

    vote(price: number, additionalWeight: number): UpdateResult | AddResult {
        let current = this.head;
        while (current) {
            if (current.price === price) {
                current.weight += additionalWeight;

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

        const newNode = new Node(price, additionalWeight);
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

    display(): { price: number; weight: number; prev: number | null; next: number | null }[] {
        let current = this.head;
        const nodes: { price: number; weight: number; prev: number | null; next: number | null }[] = [];
        while (current) {
            nodes.push({
                price: current.price,
                weight: current.weight,
                prev: current.prev ? current.prev.price : null,
                next: current.next ? current.next.price : null,
            });
            current = current.next;
        }
        console.log(nodes);
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
    
}
