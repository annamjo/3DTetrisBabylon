/*import {GameBoard} from './GameBoard.js';*/

class Game {
    private _activeBlocks: any[]; //positions of active blocks
    private _landed: any[]; //positions of landed (inactive) blocks
    private _gameBoard: GameBoard;

    constructor(size: number) {
        this._gameBoard = new GameBoard(size);
    }

    private drawBlock() { //loop - draw another block based on time interval/when current block not active
        //randomize block - array of options (string or number); spawn a random block
    } //draw drop preview?
    
    private getNextBlock() {} //also preview next block

    private removeBlocks() {} //when layer cleared //is there an ActiveBlock? - check layer after a block locks into place (no active blocks)

    private collpaseBlocks() {
        // let layerObserver = this._scene.onAfterRenderObservable.add( () => {
        //     //islayerfull
        // });
    } //when gameboard layers (spaces array) collapse

    private isGameboardTopped() {
        //for game over
    }
}