/*import {GameBoard} from './GameBoard.js';*/
var Game = /** @class */ (function () {
    function Game(size) {
        this._gameBoard = new GameBoard(size);
    }
    Game.prototype.drawBlock = function () {
        //randomize block - array of options (string or number); spawn a random block
    }; //draw drop preview?
    Game.prototype.getNextBlock = function () { }; //also preview next block
    Game.prototype.removeBlocks = function () { }; //when layer cleared //is there an ActiveBlock? - check layer after a block locks into place (no active blocks)
    Game.prototype.collpaseBlocks = function () {
        // let layerObserver = this._scene.onAfterRenderObservable.add( () => {
        //     //islayerfull
        // });
    }; //when gameboard layers (spaces array) collapse
    Game.prototype.isGameboardTopped = function () {
        //for game over
    };
    return Game;
}());
//# sourceMappingURL=Game.js.map