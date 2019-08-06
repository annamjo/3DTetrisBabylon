var createScene = function () {

    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0); //color of background - black
    scene.collisionsEnabled = true;

    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI/3.24, 15.5, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true); //Math.PI/3.24, 1

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 1 ;

    var faceColors = new Array(6);

    faceColors[0] = new BABYLON.Color4(1,1,0,1);
    faceColors[1] = new BABYLON.Color4(0,0,1,1);
    faceColors[2] = new BABYLON.Color4(1,0,0,1);
    faceColors[3] = new BABYLON.Color4(1,0,1,1);
    faceColors[4] = new BABYLON.Color4(0,1,1,1);
    faceColors[5] = new BABYLON.Color4(0,1,0,1);
    
    var options = {
        width: 1,
        height: 1,
        depth: 1,
        faceColors: faceColors
    };

    var box = BABYLON.MeshBuilder.CreateBox("box", options, scene);
    //var mat = new BABYLON.StandardMaterial("mat", scene);
    //box.material = new BABYLON.GridMaterial("groundMat", scene);
    //box.material = mat;
    box.position.y = 3.5;

    box.checkCollisions = true;
    box.ellipsoid = new BABYLON.Vector3(0.5, 0.5, 0.5);
    box.ellipsoidOffset = new BABYLON.Vector3(0, 0, 0);
    //box.showBoundingBox = true; 
    box.computeWorldMatrix(true); //update world matrix before every frame; must have for registerBeforeRender

    //grid projected onto ground
    //plan: create a gameboard class, pass in params to construc to change size

    var ground = gameBoard();

    function gameBoard() {

        var groundGrid = createGrid();
        groundGrid.backFaceCulling = false;
    
        var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 5, height: 5}, scene);
        ground.material = groundGrid;
        ground.position.y = -5;

        //front & back planes
        var fplane = createPlane(0, 0, -2.5, Math.PI); //-2.5 < z < 2.5
        var bplane = createPlane(0, 0, 2.5, 0);

        //right & left planes
        var rplane = createPlane(2.5, 0, 0, Math.PI / 2); //-2.5 < x < 2.5
        var lplane = createPlane(-2.5, 0, 0, -Math.PI/2);

        function createGrid() {
            var grid = new BABYLON.GridMaterial("grid", scene);
            grid.lineColor = BABYLON.Color3.White();
            grid.majorUnitFrequency = 1; //every line is a strong line
            grid.opacity = 0.8; //grid opacity outside of the lines; trasparent if < 1
            grid.gridOffset = new BABYLON.Vector3(0.5, 0, 0.5);
            return grid;
        }

        function createPlane(x, y, z, rotation) {
            var plane = BABYLON.MeshBuilder.CreatePlane("plane", {height: 10, width: 5}, scene); //change width to 7?
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
        
        return ground;
    }
    
    var colpt;
    var collided = false;
    scene.registerAfterRender(() => {
        if (box.intersectsMesh(ground, true)) { //box collision
            //mat.emissiveColor = new BABYLON.Color3(0.5, 0, 0);
            //get position block collides at:
            if (!collided) {
                colpt = box.position;
                collided = true;
            }
        } 
        // else {
        //     mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
        // }
        
    });

    //motions
    var moveStep = 1;
    var rotation = Math.PI / 2;
    scene.onKeyboardObservable.add((kbInfo) => {
        //reset displacement vector: 
        var moveVector = new BABYLON.Vector3(0, 0, 0);

        //reset origin for rotations:
        //box.rotation = new BABYLON.Vector3(0, 0, 0);

        if (collided) {
            box.position = colpt; //find a way to reset
        }
        else {
            switch (kbInfo.type) {
                case BABYLON.KeyboardEventTypes.KEYDOWN:
                    switch (kbInfo.event.key) {
                        case "a":
                            box.moveWithCollisions(moveVector);
                            break;
                        case "d":
                            box.moveWithCollisions(moveVector);
                            break;
                        case "w":
                            box.moveWithCollisions(moveVector);
                            break;
                        case "s":
                            box.moveWithCollisions(moveVector);
                            break;
                        case " ":
                            box.position.y -= moveStep; //change to before render obser?
                            // moveVector.z = -moveStep; //ground.checkCollisions = true; , comment out afterrender, collided uses
                            // box.moveWithCollisions(moveVector);
                            break;
                        case "z":
                            box.rotate(BABYLON.Axis.X, rotation, BABYLON.Space.WORLD);
                            //rotate about fixed World axis insteal of local (axis aligned on your mesh)
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
        }
    });
    
    //make block fall unit by unit
    var animatable;
    var boxAni = new BABYLON.Animation("BoxAnimation", "position.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    scene.onBeforeStepObservable.add((theScene) => {
        animatable = scene.beginAnimation(box[0], 0, 100, true, 1.0);
        animatable.speedRatio *= 0.85; //.translate?
        box.position.y -= moveStep;
    });

        // engine.runRenderLoop(() => { //animation
    //     if (collided) {
    //         box.position = colpt;
    //     }
    //     else {
    //         if (box.position.y > 0.5) {
    //             box.position.y -= 0.01;
    //         }
    //     }
    // });
    
    return scene;
};

//host:
var canvas = document.getElementById("renderCanvas") as HTMLCanvasElement; //cast as canvas
var engine = new BABYLON.Engine(canvas, true); //turn on engine

//let engine know that window size changed (canvas will change)
window.addEventListener("resize", () => {
    engine.resize();
});

var scene = createScene();

engine.runRenderLoop(() => { 
    scene.render();
});