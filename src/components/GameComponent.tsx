'use client'

import {useEffect, useRef, useState} from 'react';
import { GameState, Room, Inventory, GameAction } from '../types/game';
import { rooms } from '../data/rooms';
import { initialInventory } from '../data/inventory';
import {StringWriter} from "@jridgewell/sourcemap-codec/dist/types/strings";
import {string} from "postcss-selector-parser";

export default function GameComponent() {
    const historyRef = useRef<HTMLDivElement>(null);

    const [gameState, setGameState] = useState<GameState>({
        currentRoom: 'start',
        inventory: initialInventory,
        health: 100,
        visitedRooms: ['start'],
        gameFlags: {},
    });

    const [gameHistory, setGameHistory] = useState<string[]>([
        'Vítejte v "Tajemství Starého Hradu"',
        'Probudili jste se v temné místnosti starého hradu...'
    ]);

    const [userInput, setUserInput] = useState('');

    useEffect(() => {
        if(historyRef.current) {
            historyRef.current.scrollTop = historyRef.current.scrollHeight;
        }
    }, [gameHistory]);

    const addToHistory = (message: string) => {
        setGameHistory((prev) => [...prev, message]);
    };

    const handleAction = (action: GameAction) => {
        const currentRoom = rooms[gameState.currentRoom];

        switch (action.type) {
            case 'move':
                if (currentRoom.exits[action.target]) {
                    const newRoom = currentRoom.exits[action.target];
                    setGameState((prev) => ({
                        ...prev,
                        currentRoom: newRoom,
                        visitedRooms: [...prev.visitedRooms, newRoom],
                    }));
                    addToHistory(`Přesunuli jste se do: ${rooms[newRoom].name}`);
                    addToHistory(rooms[newRoom].description);

                    let itemMessage = "Předměty v místnosti: ";

                    if (rooms[newRoom].items) {
                        const items = Object.values(rooms[newRoom].items);
                        if (items.length > 0) {
                            for (const item of items) {
                                itemMessage += `${item.name}, `;
                            }
                            itemMessage = itemMessage.trim().slice(0, -1);
                        } else {
                            itemMessage += "žádné";
                        }
                    } else {
                        itemMessage += "žádné";
                    }

                    addToHistory(itemMessage.trim());

                } else {
                    addToHistory('Tímto směrem nelze jít.');
                }
                break;

            case 'examine':
                if (currentRoom.items[action.target]) {
                    addToHistory(currentRoom.items[action.target].description);
                } else {
                    addToHistory('Tento předmět zde není.');
                }
                break;

            case 'take':
                if (currentRoom.items[action.target] && currentRoom.items[action.target].canTake) {
                    setGameState((prev) => ({
                        ...prev,
                        inventory: {
                            ...prev.inventory,
                            [action.target]: currentRoom.items[action.target],
                        },
                    }));
                    addToHistory(`Sebrali jste: ${currentRoom.items[action.target].name}`);
                } else {
                    addToHistory('Tento předmět nelze vzít.');
                }
                break;

            case 'use':
                if (gameState.inventory[action.target]) {
                    const item = gameState.inventory[action.target];
                    if (item.onUse) {
                        const result = item.onUse(gameState);
                        addToHistory(result.message);
                        if (result.newState) {
                            setGameState(result.newState);
                        }
                    } else {
                        addToHistory('Tento předmět nelze použít.');
                    }
                } else {
                    addToHistory('Tento předmět nemáte v inventáři.');
                }
                break;
        }
    };

    const parseCommand = (input: string) => {
        const words = input.toLowerCase().trim().split(' ');
        const command = words[0];
        const target = words.slice(1).join(' ');

        switch (command) {
            case 'jdi':
            case 'jít':
                handleAction({ type: 'move', target });
                break;
            case 'prozkoumej':
            case 'podívej':
                handleAction({ type: 'examine', target });
                break;
            case 'vezmi':
            case 'seber':
                handleAction({ type: 'take', target });
                break;
            case 'použij':
                handleAction({ type: 'use', target });
                break;
            case 'inventář':
                const items = Object.values(gameState.inventory).map(item => item.name).join(', ');
                addToHistory(`Inventář: ${items || 'prázdný'}`);
                break;
            case 'rozhlédni':
                const room = rooms[gameState.currentRoom];
                addToHistory(room.description);
                const exits = Object.keys(room.exits).join(', ');
                const itemsInRoom = Object.keys(room.items).join(', ');
                addToHistory(`Východy: ${exits}`);
                addToHistory(`Předměty v místnosti: ${itemsInRoom}`);
                break;
            case 'promluv':
                if(rooms[gameState.currentRoom].entities && rooms[gameState.currentRoom].entities[target]) {
                    addToHistory(rooms[gameState.currentRoom].entities[target].message);
                } else {
                    addToHistory('Žádná entita pod tímto jmenem není poblíž...');
                }
                break;
            case 'sebevražda':
                addToHistory('Pokusil ses zabít... Ale stále žiješ!');
                break;
            default:
                addToHistory('Nerozumím tomuto příkazu.');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        addToHistory(`> ${userInput}`);
        parseCommand(userInput);
        setUserInput('');
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-6xl font-bold mb-6 text-center text-gray-400"
            style={{ fontFamily: "'Oleo Script Swash Caps', cursive" }}>
                Tajemství Starého Hradu
            </h1>

            <div
                ref={historyRef}
                className="bg-gray-800 rounded-lg p-4 mb-4 h-96 overflow-y-auto scroll-smooth"
            >
                {gameHistory.map((message, index) => {
                    const isCommand = message.startsWith('> ');
                    return (
                        <p key={index} className="mb-2">
                            {isCommand ? (
                                <>
                                    <span className="text-blue-400">{message.slice(0, 2)}</span>
                                    {message.slice(2)}
                                </>
                            ) : (
                                message
                            )}
                        </p>
                    );
                })}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="flex-1 bg-gray-700 rounded px-4 py-2 text-white"
                    placeholder="Zadejte příkaz..."
                />
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-800 text-black font-bold py-2 px-4 rounded"
                >
                    Odeslat
                </button>
            </form>

            <div className="mt-4 text-sm text-gray-400">
                <p>Dostupné příkazy:</p>
                <p>jdi [směr] - přesun do jiné místnosti</p>
                <p>prozkoumej [předmět] - prozkoumání předmětu</p>
                <p>vezmi [předmět] - sebrání předmětu</p>
                <p>použij [předmět] - použití předmětu z inventáře</p>
                <p>inventář - zobrazení inventáře</p>
                <p>rozhlédni - popis aktuální místnosti</p>
                <p>promluv [entita] - promluv s entitou</p>
                <p>sebevražda - zabijete se</p>
            </div>
        </div>
    );
}