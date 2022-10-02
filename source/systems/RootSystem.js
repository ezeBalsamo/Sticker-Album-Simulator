import PlayerSystem from "./PlayerSystem.js";
import AlbumCompletionSystem from "./AlbumCompletionSystem.js";

export default class RootSystem{
    constructor(systems) {
        this.systemsByKey = systems.reduce((map, system) => {
            map.set(system.name, system);
            system.beChildOf(this);
            return map;
        }, new Map());
    }

    start(){
        Array.from(this.systemsByKey.values()).forEach(system => system.resolveDependencies());
    }

    systemNamed(name){
        return this.systemsByKey.get(name);
    }

    playerSystem() {
        return this.systemNamed(PlayerSystem.name);
    }

    albumCompletionSystem(){
        return this.systemNamed(AlbumCompletionSystem.name);
    }
}