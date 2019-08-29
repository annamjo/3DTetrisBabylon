var App = /** @class */ (function () {
    function App() {
        var _this = this;
        // create canvas, scene (has gameboard), engine?
        this._canvas = document.getElementById("renderCanvas");
        var engine = new BABYLON.Engine(this._canvas, true);
        this._scene = new BABYLON.Scene(engine);
        this._scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
        window.addEventListener("resize", function () {
            engine.resize();
        });
        this._gameOver = false;
        this._score = 0;
        this.createScene(this._scene);
        engine.runRenderLoop(function () {
            // this._scene.render();
            if (!_this._gameOver) {
                _this._scene.render();
            }
            else if (_this._gameOver) {
                _this._menu._advancedTexture.dispose();
                _this._scene.dispose();
                var scene2 = new BABYLON.Scene(engine);
                _this.createScene(scene2);
                _this._scene = scene2; //need?
                scene2.render();
            }
        });
    }
    App.prototype.createScene = function (scene) {
        var _this = this;
        var engine = scene.getEngine();
        var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 3.3, 18.4, new BABYLON.Vector3(0, 0, 0), scene); //camera changed
        camera.attachControl(this._canvas, true);
        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 1;
        if (this._gameOver) {
            scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
            this._endScreen = new GameOver(scene, this._score);
            var pointerDown_1 = scene.onPointerObservable.add(function (pointerInfo) {
                switch (pointerInfo.type) {
                    case BABYLON.PointerEventTypes.POINTERDOWN:
                        scene.onPointerObservable.remove(pointerDown_1);
                        _this._endScreen.active = false;
                        _this._endScreen.hide();
                        _this._gameOver = false;
                        _this._game = new Game(7, scene);
                        scene.registerBeforeRender(function () {
                            if (_this._game.gameOver) {
                                _this._gameOver = true;
                                _this._score = _this._game.scoreCount;
                            }
                        });
                        break;
                }
            });
        }
        else {
            this._menu = new Menu(scene);
            var pointerDown_2 = scene.onPointerObservable.add(function (pointerInfo) {
                switch (pointerInfo.type) {
                    case BABYLON.PointerEventTypes.POINTERDOWN:
                        scene.onPointerObservable.remove(pointerDown_2);
                        _this._menu.active = false;
                        _this._menu.hide();
                        _this._game = new Game(7, scene);
                        scene.registerBeforeRender(function () {
                            if (_this._game.gameOver) {
                                _this._gameOver = true;
                                _this._score = _this._game.scoreCount;
                            }
                        });
                        break;
                }
            });
        }
    };
    return App;
}());
new App();
//# sourceMappingURL=App.js.map