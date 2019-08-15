import { Game } from './Game';

class App {
    private _scene: BABYLON.Scene;
    private _canvas: HTMLCanvasElement;

    constructor() {
        // create canvas, scene (has gameboard), engine?
        this._canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
        const engine = new BABYLON.Engine(this._canvas, true);
        this._scene = new BABYLON.Scene(engine);

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
    
        var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI/3.3, 18.4, new BABYLON.Vector3(0, 0, 0), this._scene); //camera changed
        camera.attachControl(this._canvas, true);

        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this._scene);
        light.intensity = 1;

        var box = BABYLON.MeshBuilder.CreateBox("box", {size: 1}, this._scene);
        box.position.y = 5.5;
        //drawBlock
        
        var game = new Game(7); //or 5

        var box2 = BABYLON.MeshBuilder.CreateBox("box", {size: 0.5}, this._scene);
        box2.position.y = 1;

        box.parent = box2; //delete parent -> all child meshes also deleted
        // box.position.y = 0;

    }
}

new App();