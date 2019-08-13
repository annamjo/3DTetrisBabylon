/*import {GameBoard} from './GameBoard.js';*/

class Game {
    private _scene: BABYLON.Scene;
    private _canvas: HTMLCanvasElement;
    private _camera: BABYLON.ArcRotateCamera;

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
    }

    private drawBlock() { //loop - draw another block based on time interval/when current block not active
        //randomize block - array of options (string or number); spawn a random block
    } //draw drop preview?
    
    private getNextBlock() {} //also preview next block

    private removeBlocks() {} //when layer cleared //is there an ActiveBlock? - check layer after a block locks into place (no active blocks)

    private collpaseBlocks() {
        let layerObserver = this._scene.onAfterRenderObservable.add( () => {

        });
    } //when gameboard layers (spaces array) collapse
}

new Game();