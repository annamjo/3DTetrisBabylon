var createScene = function () {

    var scene = new BABYLON.Scene(engine); //created basic Babylon Scene object

    var camera = new BABYLON.ArcRotateCamera("Camera", (3*Math.PI)/2, 1, 20, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);

    //hemispheric light-coming fr up/sky
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    var box = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene);
    var mat = new BABYLON.StandardMaterial("boxMat", scene);
    //mat.diffuseColor = new BABYLON.Color3(0.5, 0, 0);
    box.material = mat;
    box.position.y = 3;
    box.computeWorldMatrix(true); //update world matrix before every frame

    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 7, height: 7}, scene); //flat ground
    ground.material = new BABYLON.StandardMaterial("groundMat", scene);
    ground.material.backFaceCulling = false;

    //frame
    var matBB = new BABYLON.StandardMaterial("matBB", scene);
    matBB.emissiveColor = new BABYLON.Color3(1, 1, 1);
    matBB.wireframe = true;

    var planOBB = BABYLON.Mesh.CreateBox("OBB", 1, scene);
    planOBB.scaling = new BABYLON.Vector3(7, 1, 7);
    planOBB.parent = ground;
    planOBB.material = matBB;

    //make block stop moving after collsion?
    var colpt;
    var collided = false;
    scene.registerBeforeRender(() => { //call function before every frame render
        if (box.intersectsMesh(ground, true)) { //box collision
            mat.emissiveColor = new BABYLON.Color3(0.5, 0, 0);
            //get position block collides at: (use to stop box motion)
            if (!collided) {
                colpt = box.position;
                console.log(colpt);
                collided = true;
            }
        } else {
            mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
        }
        
    });

    //keyboard events
    var inputMap = {};
    scene.actionManager = new BABYLON.ActionManager(scene);
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";        
    }));
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));

    //render loop
    scene.onBeforeRenderObservable.add(() => {
        if (collided) {
            box.position = colpt; //box locked in place
        }
        else {
            if (inputMap["w"]) {
                box.position.z += 0.1;
            }
            if (inputMap["a"]) {
                box.position.x -= 0.1;
            }
            if (inputMap["s"]) {
                box.position.z -= 0.1;
            }
            if (inputMap["d"]) {
                box.position.x += 0.1;
            }
            if (inputMap[" "]) { 
                box.position.y -= 0.1; 
            }
        }
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