/*import {GameBoard} from './GameBoard.js';*/
var App = /** @class */ (function () {
    function App() {
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
    App.prototype.createScene = function () {
        var engine = this._scene.getEngine();
        //var scene = new BABYLON.Scene(engine);
        var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 3.3, 18.4, new BABYLON.Vector3(0, 0, 0), this._scene); //camera changed
        camera.attachControl(this._canvas, true);
        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this._scene);
        light.intensity = 1;
        var box = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, this._scene);
        box.position.y = 5.5;
        //drawBlock
        // var game = new Game(7); //or 5
    };
    return App;
}());
new App();
//# sourceMappingURL=App.js.map