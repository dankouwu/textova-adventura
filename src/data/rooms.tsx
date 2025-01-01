import { Room } from '../types/game';

export const rooms: Record<string, Room> = {
    start: {
        name: 'Temná místnost',
        description: 'Nacházíte se v temné místnosti. Vzduch je zatuchlý a skrze malé okno prosvítá slabé světlo. V rohu vidíte starou truhlu. U vchodu do další místnosti se povaluje kostlivec a ze stropu visí pavouk.',
        exits: {
            'sever': 'chodba',
            'východ': 'knihovna',
        },
        items: {
            'truhla': {
                name: 'Stará truhla',
                description: 'Masivní dřevěná truhla se zrezivělým zámkem. Vypadá, že by šla otevřít.',
                canTake: false,
            },
            'svíčka': {
                name: 'Svíčka',
                description: 'Stará vosková svíčka. Mohla by se hodit.',
                canTake: true,
                onUse: (state) => ({
                    message: 'Zapálili jste svíčku. Místnost se rozjasnila.',
                    newState: {
                        ...state,
                        gameFlags: { ...state.gameFlags, hasLight: true },
                    },
                }),
            },
        },
        entities: {
            'kostlivec': {
                name: 'Kostlivec',
                message: 'Stuj! Nechoď dál! V další místnosti na tebe čekس̶̘̟͕̤͎̫̘̼͐̐̍̉̑̿͐ي̸̫̘̑̈́̃̕ج̴̢̡̛̟̮̥̤͉͔͙͕̳̹̏͐̀̔̒͆̀̐̐̔̚م̸̩̼͗̂ا̴̡̡͙͉̪̙͓̲̂͜'
            },
            'pavouk': {
                name: 'Pavouk',
                message: 'Chrrr...'
            },
        }
    },

    chodba: {
        name: 'Dlouhá chodba',
        description: 'Dlouhá kamenná chodba. Na stěnách visí staré portréty. Jejich oči jako by vás sledovaly.',
        exits: {
            'jih': 'start',
            'sever': 'zbrojnice',
            'západ': 'sklep',
        },
        items: {
            'portrét': {
                name: 'Starý portrét',
                description: 'Portrét zachycuje přísně vyhlížejícího šlechtice. Za rámem něco prosvítá...',
                canTake: false,
            },
            'klíč': {
                name: 'Rezavý klíč',
                description: 'Starý železný klíč, silně zrezivělý.',
                canTake: true,
            },
        },
    },

    knihovna: {
        name: 'Stará knihovna',
        description: 'Místnost plná zaprášených knih. Většina z nich se rozpadá. V rohu stojí masivní psací stůl.',
        exits: {
            'západ': 'start',
            'sever': 'tajná_místnost',
        },
        items: {
            'kniha': {
                name: 'Stará kniha',
                description: 'Kniha v kožené vazbě. Pojednává o historii hradu.',
                canTake: true,
                onUse: (state) => ({
                    message: 'Našli jste v knize zmínku o tajné chodbě za knihovnou!',
                    newState: {
                        ...state,
                        gameFlags: { ...state.gameFlags, knowsSecretPassage: true },
                    },
                }),
            },
            'stůl': {
                name: 'Psací stůl',
                description: 'Masivní dubový stůl. V šuplíku je něco ukryto.',
                canTake: false,
            },
        },
    },

    zbrojnice: {
        name: 'Zbrojnice',
        description: 'Místnost plná starých zbraní a zbrojí. Většina je zrezivělá, ale některé kusy vypadají použitelně.',
        exits: {
            'jih': 'chodba',
        },
        items: {
            'meč': {
                name: 'Starý meč',
                description: 'Překvapivě dobře zachovalý meč.',
                canTake: true,
            },
            'zbroj': {
                name: 'Železná zbroj',
                description: 'Těžká železná zbroj. Mohla by poskytnout dobrou ochranu.',
                canTake: true,
                onUse: (state) => ({
                    message: 'Oblékli jste si zbroj. Cítíte se bezpečněji.',
                    newState: {
                        ...state,
                        health: state.health + 20,
                    },
                }),
            },
        },
    },

    sklep: {
        name: 'Vlhký sklep',
        description: 'Temný a vlhký sklep. Ze stěn kape voda a vzduch je těžký.',
        exits: {
            'východ': 'chodba',
        },
        items: {
            'láhev': {
                name: 'Stará láhev',
                description: 'Zaprášená láhev starého vína.',
                canTake: true,
            },
            'truhla': {
                name: 'Železná truhla',
                description: 'Těžká železná truhla se složitým zámkem.',
                canTake: false,
            },
        },
    },

    tajná_místnost: {
        name: 'Tajná místnost',
        description: 'Malá, skrytá místnost za knihovnou. Vypadá to, že zde nikdo nebyl mnoho let.',
        exits: {
            'jih': 'knihovna',
        },
        items: {
            'svitek': {
                name: 'Starý svitek',
                description: 'Prastarý svitek s tajemným textem.',
                canTake: true,
                onUse: (state) => ({
                    message: 'Rozluštili jste část textu! Obsahuje důležité informace o pokladu...',
                    newState: {
                        ...state,
                        gameFlags: { ...state.gameFlags, hasMapClue: true },
                    },
                }),
            },
        },
    },
};