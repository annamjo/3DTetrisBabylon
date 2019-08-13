/*import {GameBoard} from './GameBoard.js';*/

var createScene = function () {

    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI/3.3, 18.4, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 1;

    var box = BABYLON.MeshBuilder.CreateBox("box", {size: 1}, scene);
    box.position.y = 5.5;

    var mat = new BABYLON.StandardMaterial("mat", scene);
    box.material = mat;

    var gameBoard = new GameBoard(7);
    var ground = gameBoard.ground;
    var positions = gameBoard.spaces;

    //motions
    var rotation = Math.PI / 2;
    scene.onKeyboardObservable.add((kbInfo) => { 
        switch (kbInfo.type) {
            case BABYLON.KeyboardEventTypes.KEYDOWN:
                switch (kbInfo.event.key) {
                    case "a":
                        box.position.x -= 1;
                    break;

                    case "d":
                        box.position.x += 1;
                    break;

                    case "w":
                        box.position.z += 1;
                    break;

                    case "s":
                        box.position.z -= 1;
                    break;

                    case " ":
                        box.position.y -= 1;
                    break;

                    case "z":
                        box.rotate(BABYLON.Axis.X, rotation, BABYLON.Space.WORLD);
                        break;

                    case "x":
                        box.rotate(BABYLON.Axis.Y, -rotation, BABYLON.Space.WORLD);
                        break;

                    case "c":
                        box.rotate(BABYLON.Axis.Z, -rotation, BABYLON.Space.WORLD); 
                        break;
                }
            break;
        }
    });
    return scene;
};

//host:
var canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
var engine = new BABYLON.Engine(canvas, true);

window.addEventListener("resize", () => {
    engine.resize();
});

var scene = createScene();

engine.runRenderLoop(() => { 
    scene.render();
});