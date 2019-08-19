// import { game as Game } from './Game';
// import { menu as Menu} from './Menu';

class App {
    private _scene: BABYLON.Scene;
    private _canvas: HTMLCanvasElement;
    private _menu : Menu;
    private gameOn : boolean;

    constructor() {
        // create canvas, scene (has gameboard), engine?
        this._canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
        const engine = new BABYLON.Engine(this._canvas, true);
        this._scene = new BABYLON.Scene(engine);
        this._scene.clearColor = new BABYLON.Color4(0, 0, 0, 0); //color of background - black
        this.gameOn = false;

        window.addEventListener("resize", () => {   //loop that gives new image to system at around 60 fps
            engine.resize();
        });
        
        this.createScene();

        engine.runRenderLoop(() => { 
            this._scene.render();
        });

        this._menu = new Menu(this._scene);

        this.gameLoop();
    }

    //Main render/game loop
    private async gameLoop() {
        this._scene.onBeforeRenderObservable.add(() => {
            if(!this._menu.isActive) {  //if menu is not active...
                //run game
            }
        });
    }

    private createScene() {
        const engine = this._scene.getEngine();
    
        var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI/3.3, 18.4, new BABYLON.Vector3(0, 0, 0), this._scene); //camera changed
        camera.attachControl(this._canvas, true);

        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this._scene);
        light.intensity = 1;
        
        // var gameTest = new Game(7); //or 5
    }
}

// new App();