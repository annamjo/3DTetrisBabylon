var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0); //color of background - black
    scene.collisionsEnabled = true;
    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 3.24, 15.5, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true); //Math.PI/3.24, 1
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    var box = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene);
    var mat = new BABYLON.StandardMaterial("mat", scene);
    //box.material = new BABYLON.GridMaterial("groundMat", scene);
    box.material = mat;
    box.position.y = 3.5;
    box.checkCollisions = true;
    box.ellipsoid = new BABYLON.Vector3(0.5, 0.5, 0.5);
    box.ellipsoidOffset = new BABYLON.Vector3(0, 0, 0);
    box.showBoundingBox = true;
    box.computeWorldMatrix(true); //update world matrix before every frame; must have for registerBeforeRender
    //grid projected onto ground
    //plan: create a gameboard class, pass in params to construc to change size
    var groundGrid = createGrid();
    groundGrid.backFaceCulling = false;
    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 5, height: 5 }, scene);
    ground.material = groundGrid;
    ground.position.y = -5;
    //front & back planes
    var fplane = createPlane(0, 0, -2.5, Math.PI); //-2.5 < z < 2.5
    var bplane = createPlane(0, 0, 2.5, 0);
    //right & left planes
    var rplane = createPlane(2.5, 0, 0, Math.PI / 2); //-2.5 < x < 2.5
    var lplane = createPlane(-2.5, 0, 0, -Math.PI / 2);
    function createGrid() {
        var grid = new BABYLON.GridMaterial("grid", scene);
        grid.majorUnitFrequency = 1; //every line is a strong line
        grid.opacity = 0.8; //grid opacity outside of the lines; trasparent if < 1
        grid.gridOffset = new BABYLON.Vector3(0.5, 0, 0.5);
        return grid;
    }
    function createPlane(x, y, z, rotation) {
        var plane = BABYLON.MeshBuilder.CreatePlane("plane", { height: 10, width: 5 }, scene);
        plane.position.x = x;
        plane.position.y = y;
        plane.position.z = z;
        plane.rotation.y = rotation;
        var planeGrid = createGrid();
        planeGrid.backFaceCulling = true;
        plane.material = planeGrid;
        plane.checkCollisions = true;
        return plane;
    }
    var colpt;
    var collided = false;
    scene.registerAfterRender(function () {
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
    //motions
    var moveStep = 1;
    scene.onKeyboardObservable.add(function (kbInfo) {
        if (collided) {
            box.position = colpt; //find a way to reset, or make other blocks collidable, use movewith
        }
        else {
            switch (kbInfo.type) {
                case BABYLON.KeyboardEventTypes.KEYDOWN:
                    switch (kbInfo.event.key) {
                        case "a":
                            box.moveWithCollisions(new BABYLON.Vector3(-1, 0, 0));
                            break;
                        case "d":
                            box.moveWithCollisions(new BABYLON.Vector3(1, 0, 0));
                            break;
                        case "w":
                            box.moveWithCollisions(new BABYLON.Vector3(0, 0, 1));
                            break;
                        case "s":
                            box.moveWithCollisions(new BABYLON.Vector3(0, 0, -1));
                            break;
                        case " ":
                            box.position.y -= 1; //use in before render?
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
//# sourceMappingURL=collideGrid.js.map