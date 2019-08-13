/*import {GameBoard} from './GameBoard.js';*/
var Game = /** @class */ (function () {
    function Game() {
        var _this = this;
        // create canvas, scene (has gameboard), engine?
        this._canvas = document.getElementById("renderCanvas");
        var engine = new BABYLON.Engine(this._canvas, true);
        this._scene = new BABYLON.Scene(engine);
        window.addEventListener("resize", function () {
            engine.resize();
        });
        this.createScene();
        engine.runRenderLoop(function () {
            _this._scene.render();
        });
    }
    Game.prototype.createScene = function () {
        var engine = this._scene.getEngine();
        //var scene = new BABYLON.Scene(engine);
        var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 3.3, 18.4, new BABYLON.Vector3(0, 0, 0), this._scene); //camera changed
        camera.attachControl(this._canvas, true);
        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this._scene);
        light.intensity = 1;
        var box = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, this._scene);
        box.position.y = 5.5;
    };
    Game.prototype.drawBlock = function () {
        //randomize block - array of options (string or number); spawn a random block
    }; //draw drop preview?
    Game.prototype.getNextBlock = function () { }; //also preview next block
    Game.prototype.removeBlocks = function () { }; //when layer cleared //is there an ActiveBlock? - check layer after a block locks into place (no active blocks)
    Game.prototype.collpaseBlocks = function () {
        var layerObserver = this._scene.onAfterRenderObservable.add(function () {
        });
    }; //when gameboard layers (spaces array) collapse
    return Game;
}());
new Game();
//# sourceMappingURL=Game.js.map