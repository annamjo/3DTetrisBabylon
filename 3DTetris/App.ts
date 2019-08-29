// import {Menu} from './Menu.js';

class App {
    private _scene: BABYLON.Scene;
    private _canvas: HTMLCanvasElement;

    constructor() {
        // create canvas, scene (has gameboard), engine?
        this._canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
        const engine = new BABYLON.Engine(this._canvas, true);
        this._scene = new BABYLON.Scene(engine);
        this._scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

        window.addEventListener("resize", () => {
            engine.resize();
        });
        
        this.createScene();

        engine.runRenderLoop(() => { 
            this._scene.render();
        });
    }

    private createScene() {
        const engine = this._scene.getEngine();
        //var scene = new BABYLON.Scene(engine);
        // scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    
        var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI/3.3, 18.4, new BABYLON.Vector3(0, 0, 0), this._scene); //camera changed
        camera.attachControl(this._canvas, true);

        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this._scene);
        light.intensity = 1;

        // var menu = new Menu(this._scene);
        var game = new Game(7, this._scene);

    }
}

new App();