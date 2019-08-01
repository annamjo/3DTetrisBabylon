var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0); //color of background - black
    var camera = new BABYLON.ArcRotateCamera("Camera", (3 * Math.PI) / 2, Math.PI / 2.9, 13, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true); //Math.PI/3.24, 1
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    var box = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene);
    var mat = new BABYLON.StandardMaterial("boxMat", scene);
    //box.material = new BABYLON.GridMaterial("groundMat", scene);
    box.material = mat;
    box.position.y = 3;
    box.computeWorldMatrix(true); //update world matrix before every frame
    //grid projected onto ground
    //plan: create a gameboard class, pass in params to construc to change size
    var grid = new BABYLON.GridMaterial("grid", scene);
    //grid.lineColor = BABYLON.Color3.White();
    grid.majorUnitFrequency = 1; //every line is a strong, bright line
    grid.opacity = 0.9; //grid opacity outside of the lines; trasparent if < 1
    grid.gridOffset = new BABYLON.Vector3(0.5, 0, 0.5);
    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 5, height: 5 }, scene);
    ground.material = grid;
    ground.material.backFaceCulling = false;
    ground.position.y = -1.5;
    var colpt;
    var collided = false;
    scene.registerBeforeRender(function () {
        if (box.intersectsMesh(ground, true)) { //box collision
            mat.emissiveColor = new BABYLON.Color3(0.5, 0, 0);
            //get position block collides at:
            if (!collided) {
                colpt = box.position;
                collided = true;
            }
        }
        else {
            mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
        }
    });
    scene.onKeyboardObservable.add(function (kbInfo) {
        if (collided) {
            box.position = colpt;
        }
        else {
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
                    }
                    break;
            }
        }
    });
    return scene;
};
//host:
var canvas = document.getElementById("renderCanvas"); //cast as canvas
var engine = new BABYLON.Engine(canvas, true); //turn on engine
//let engine know that window size changed (canvas will change)
window.addEventListener("resize", function () {
    engine.resize();
});
var scene = createScene();
engine.runRenderLoop(function () {
    scene.render();
});
//# sourceMappingURL=gridBlock.js.map