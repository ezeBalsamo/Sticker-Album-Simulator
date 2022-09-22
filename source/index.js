import DOMBasedInteractionSystem from './interaction/DOMBasedInteractionSystem.js';
import Sticker from "./stickers/Sticker.js";
import RandomStickersProvider from "./stickers/RandomStickersProvider.js";
import PackSpecification from "./packs/PackSpecification.js";
import StickersAlbumSimulator from "./album/StickersAlbumSimulator.js";

const argentinaStickers = [
    new Sticker('Argentina Logo'),
    new Sticker('Emiliano Martinez'),
    new Sticker('Marcos Acuña'),
    new Sticker('Nahuel Molina'),
    new Sticker('Nicolás Otamendi'),
    new Sticker('Cristian Romero'),
    new Sticker('Rodrigo de Paul'),
    new Sticker('Ángel Di María'),
    new Sticker('Giovanni Lo Celso'),
    new Sticker('Leandro Paredes'),
    new Sticker('Lautaro Martinez'),
    new Sticker('Lionel Messi')
]

const brazilStickers = [
    new Sticker('Brasil Logo'),
    new Sticker('Alisson'),
    new Sticker('Alex Sandro'),
    new Sticker('Danilo'),
    new Sticker('Marquinhos'),
    new Sticker('Thiago Silva'),
    new Sticker('Casemiro'),
    new Sticker('Fred'),
    new Sticker('Lucas Paquetá'),
    new Sticker('Gabriel Jesús'),
    new Sticker('Neymar Jr'),
    new Sticker('Vinícius Jr')
]

const stickers = [...argentinaStickers, ...brazilStickers];

const stickersProvider = new RandomStickersProvider(stickers);
const packSpecification = new PackSpecification(150, 5);
const interactionSystem = new DOMBasedInteractionSystem();

interactionSystem.withPlayerDo((player) => {
    const simulator = new StickersAlbumSimulator(player, stickersProvider, packSpecification, interactionSystem);
    simulator.startSimulation();
})
