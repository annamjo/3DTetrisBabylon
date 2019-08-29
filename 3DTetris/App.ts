class App {
    private _scene: BABYLON.Scene;
    private _canvas: HTMLCanvasElement;
    private _menu: Menu;
    private _game: Game;
    private _gameOver: boolean;
    private _endScreen: GameOver;
    private _score: number;

    constructor() {
        // create canvas, scene (has gameboard), engine?
        this._canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
        const engine = new BABYLON.Engine(this._canvas, true);
        this._scene = new BABYLON.Scene(engine);
        this._scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

        window.addEventListener("resize", () => {
            engine.resize();
        });
        
        this._gameOver = false;
        this._score = 0;
        this.createScene(this._scene);

        engine.runRenderLoop(() => { 
            // this._scene.render();
            if (!this._gameOver) {
                this._scene.render();
            }
            else if (this._gameOver) {
                this._menu._advancedTexture.dispose();
                this._scene.dispose();
                var scene2 = new BABYLON.Scene(engine);
                this.createScene(scene2);
                this._scene = scene2; //need?
                scene2.render();
            }
        });
    }

    private createScene(scene: BABYLON.Scene) {
        const engine = scene.getEngine();
    
        var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI/3.3, 18.4, new BABYLON.Vector3(0, 0, 0), scene); //camera changed
        camera.attachControl(this._canvas, true);

        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 1;

        if (this._gameOver) {
            scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
            this._endScreen = new GameOver(scene, this._score);
            let pointerDown = scene.onPointerObservable.add((pointerInfo) => {
                switch (pointerInfo.type) {
                    case BABYLON.PointerEventTypes.POINTERDOWN:
                        scene.onPointerObservable.remove(pointerDown);
                        this._endScreen.active = false;
                        this._endScreen.hide();
                        this._gameOver = false;
                        this._game = new Game(7, scene);
                        scene.registerBeforeRender(() => {
                            if (this._game.gameOver) {
                                this._gameOver = true;
                                this._score = this._game.scoreCount;
                            }
                        });
                        break;
                }
            });
        }
        else {
            this._menu = new Menu(scene);

            let pointerDown = scene.onPointerObservable.add((pointerInfo) => {
                switch (pointerInfo.type) {
                    case BABYLON.PointerEventTypes.POINTERDOWN:
                        scene.onPointerObservable.remove(pointerDown);
                        this._menu.active = false;
                        this._menu.hide();
                        this._game = new Game(7, scene);
                        scene.registerBeforeRender(() => {
                            if (this._game.gameOver) {
                                this._gameOver = true;
                                this._score = this._game.scoreCount;
                            }
                        });
                        break;
                }
            });
        }
    }
}

new App();