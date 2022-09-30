export default class PlayerSystem{
    static name = 'Player System';
    constructor() {
        this.players = JSON.parse(localStorage.getItem('players')) || [];
    }

    get name(){
        return this.constructor.name;
    }

    beChildOf(rootSystem){
    }

    resolveDependencies(){
    }

    playerNamed(playerName, ifFound, ifNone){
        return this.players.includes(playerName) ? ifFound() : ifNone ();
    }

    registerPlayerNamed(playerName) {
        this.players.push(playerName);
        localStorage.setItem('players', JSON.stringify(this.players));
    }
}