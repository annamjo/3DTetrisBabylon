var createScene = function () {

    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0); //color of background - black
    scene.collisionsEnabled = true;

    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI/3.3, 18.4, new BABYLON.Vector3(0, 0, 0), scene); //camera changed
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 1;

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
    box.position.y = 5.5;

    var mat = new BABYLON.StandardMaterial("mat", scene);
    box.material = mat;

    box.checkCollisions = true;
    box.ellipsoid = new BABYLON.Vector3(0.5, 0.5, 0.5); //cant move if ellipsoid has 0 coordinates
    box.computeWorldMatrix(true); //update world matrix before every frame; must have for registerBeforeRender
    //compute world matrix before checking collisions, right before currentMesh.intersectsMesh(otherMesh, true)

    var dummy = BABYLON.MeshBuilder.CreateBox("dummy", {size:1}, scene);
    dummy.showBoundingBox = true;
    var material = new BABYLON.StandardMaterial("mat", scene);
    material.emissiveColor = new BABYLON.Color3(1, 1, 1);
    dummy.material = material;
    dummy.material.wireframe = true;
    dummy.visibility = 0.4;
    dummy.parent = box; //box attached to dummy
    // dummy.scaling = dummy.parent.ellipsoid; //how to show ellipsoid??

    var ground = gameBoard();

    function gameBoard() {

        var groundGrid = createGrid();
        groundGrid.backFaceCulling = false;
    
        var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 7, height: 7}, scene); //5, 5
        ground.material = groundGrid; //grid projected onto ground
        ground.position.y = -6;

        // ground.checkCollisions = true; //comment out afterrender, collided uses
        //ground.ellipsoid = new BABYLON.Vector3(2.5 , 0, 2.5);

        //front & back planes
        var fplane = createPlane(0, 0, -3.5, Math.PI); //-2.5 < z < 2.5, now 3.5
        var bplane = createPlane(0, 0, 3.5, 0);

        //right & left planes
        var rplane = createPlane(3.5, 0, 0, Math.PI / 2); //-2.5 < x < 2.5
        var lplane = createPlane(-3.5, 0, 0, -Math.PI/2);

        function createGrid() {
            var grid = new BABYLON.GridMaterial("grid", scene);
            grid.lineColor = BABYLON.Color3.White();
            grid.majorUnitFrequency = 1; //every line is a strong line
            grid.opacity = 0.8; //grid opacity outside of the lines; transparent if < 1
            grid.gridOffset = new BABYLON.Vector3(0.5, 0, 0.5);
            return grid;
        }

        function createPlane(x, y, z, rotation) {
            var plane = BABYLON.MeshBuilder.CreatePlane("plane", {height: 12, width: 7}, scene); //10, 5
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
    
    //INTERSECTIONS
    // scene.registerAfterRender would check for intersection each frame 
    // animation in this loop would not fall unit by unit, but can use spacebar and rotate
    var colpt;
    var collided = false;

    mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
    var onCollide = function() {
        // console.log("onEntry");
        mat.emissiveColor = new BABYLON.Color3(0, 0, 0);
        colpt = box.position; //use vertices/vectors for each corner of piece? (to lock in each vertex)
        collided = true;
	}

	// var onExit = function() {
    //     console.log("onExit");
    //     //reset colpt when new pieces spawned?? or for when piece disappears/gameboard plane cleared?
	// 	box.dispose();
	// }

    // attach an action manager to mesh, hosted by scene (can also attach to scene)
    box.actionManager = new BABYLON.ActionManager(scene); //trigger is onIntersectionEnter

    //raised when box intersects with ground (raised once - checks for colpt once)
    box.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
		{trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: ground},
		onCollide
    ));

    // box.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
	// 	{trigger: BABYLON.ActionManager.OnIntersectionExitTrigger, parameter: ground}, //turn off on entry enter action temp?
	// 	onExit
	// ));


    //set a position vector when intersects ground/any mesh??
    //box.position = new BABYLON.Vector3(x, y, z); 

    //motions
    var moveStep = 1;
    var rotation = Math.PI / 2;
    scene.onKeyboardObservable.add((kbInfo) => {
        //reset displacement vector: 
        var moveVector = new BABYLON.Vector3(0, 0, 0);

        if (collided) {
            box.position = colpt; //find a way to reset this; setposition-ed
        }
        else {
            switch (kbInfo.type) {
                case BABYLON.KeyboardEventTypes.KEYDOWN:
                    switch (kbInfo.event.key) {
                        case "w":
                            moveVector.z = moveStep;
                            box.moveWithCollisions(moveVector); //moveVector.normalize() - normalize vectors??
                            break;
                        case "s":
                            moveVector.z = -moveStep;
                            box.moveWithCollisions(moveVector);
                            break;
                        case "a":
                            moveVector.x = -moveStep;
                            box.moveWithCollisions(moveVector);
                            break;
                        case "d":
                            moveVector.x = moveStep;
                            box.moveWithCollisions(moveVector);
                            break;
                        case " ":
                            //use picking rays to detect oncoming collision?? oncollideobserv?? onintersectionentertrigger; for drop down preview?
                            moveVector.y = -moveStep;
                            box.moveWithCollisions(moveVector); 
                            break;
                        case "z":
                            box.rotate(BABYLON.Axis.X, rotation, BABYLON.Space.WORLD); //rotate about fixed world axis (instead of local axis aligned on mesh)
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

    //block falls unit by unit
    var fallingInterval = setInterval(() => { //make ground checkforcollisions?? too expensive??
        box.moveWithCollisions(new BABYLON.Vector3(0, -1, 0)); //animate using displacement vector
        // console.log("fall!");
    }, 1250); //1500

    scene.registerBeforeRender(() => { //or use onBeforeRenderObs??
        console.log(box.position);
        if (collided) { //box collision
            clearInterval(fallingInterval); //already computed world matrix
        } 
    });

    // scene.onBeforeRenderObservable.add(() => { 
    //     if (collided) { //box collision
    //         clearInterval(fallingInterval);
    //     } 
    // });

    // BABYLON.Animation.CreateAndStartAnimation("boxAni", box, "position.y", 30, 270, 4.5, -4.5, 0); //spacebar disabled - doesnt fall unit by unit
    
    // //using keys: timed frames-draw specific frame at specific time (ind of scene rendering rate)
    // //create a positioning animation at 30 fps, speedratio??
    // var aniBox = new BABYLON.Animation("animationBox", "position.y", 10, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    // var keys = [];
    // keys.push({
    //     frame: 0,
    //     value: -1.5
    // });
    // keys.push({
    //     frame: 10,
    //     value: -2.5
    // });
    // keys.push({
    //     frame: 20,
    //     value: -3.5
    // });
    // keys.push({
    //     frame: 30,
    //     value: -4.5
    // });

    // aniBox.setKeys(keys);
    // // box.animations.push(aniBox);
    // // scene.beginAnimation(box, 0, 3, false) //animation regardless of frame rate???
    // scene.beginDirectAnimation(box, [aniBox], 0, 30, false);


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