export interface GameState {
    currentRoom: string;
    inventory: Inventory;
    health: number;
    visitedRooms: string[];
    gameFlags: Record<string, boolean>;
}

export interface Room {
    name: string;
    description: string;
    exits: Record<string, string>;
    items: Record<string, Item>;
    entities: Record<string, Entity>;
}

export interface Item {
    name: string;
    description: string;
    canTake: boolean;
    onUse?: (state: GameState) => {
        message: string;
        newState?: GameState;
    };
}

export interface Entity {
    name: string;
    message: string;
}

export interface Inventory {
    [key: string]: Item;
}

export type GameAction =
    | { type: 'move'; target: string }
    | { type: 'examine'; target: string }
    | { type: 'take'; target: string }
    | { type: 'use'; target: string };