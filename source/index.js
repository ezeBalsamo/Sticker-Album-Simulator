import PlayerSystem from "./systems/PlayerSystem.js";
import ApplicationContext from "./systems/ApplicationContext.js";
import {render} from "./views/canvas.js";
import {login} from "./views/login.js";
import AlbumCompletionSystem from "./systems/AlbumCompletionSystem.js";
import RandomStickersProvider from "./stickers/RandomStickersProvider.js";
import PackSpecification from "./packs/PackSpecification.js";
import RootSystem from "./systems/RootSystem.js";
import {stickers} from "./stickers/stickers.js";


const stickersProvider = new RandomStickersProvider(stickers);
const packSpecification = new PackSpecification(150, 5);

const playerSystem = new PlayerSystem();
const albumCompletionSystem = new AlbumCompletionSystem(stickersProvider, packSpecification);
const systems = [playerSystem, albumCompletionSystem];

const rootSystem = new RootSystem(systems);
rootSystem.start();

const context = new ApplicationContext(rootSystem);
render(login(context));
