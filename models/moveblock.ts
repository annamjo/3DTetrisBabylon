var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene); //hemispheric light-coming fr up/sky

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7; //0.1 - only 10% of light in 3d world; light-source of energy, has color/diffuse

    var box = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene);
    box.position.y = 3;

    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 7, height: 7}, scene); //flat ground
    //keyboard event
    var inputMap = {};
    scene.actionManager = new BABYLON.ActionManager(scene);
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";        
    }));
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));

    //render loop
    scene.onBeforeRenderObservable.add(()=>{
        if (inputMap["w"] || inputMap["ArrowUp"]) {
            box.position.z += 0.1;
        }
        if (inputMap["a"] || inputMap["ArrowLeft"]) {
            box.position.x -= 0.1;
        }
        if (inputMap["s"] || inputMap["ArrowDown"]) {
            box.position.z -= 0.1;
        }
        if (inputMap["d"] || inputMap["ArrowRight"]) {
            box.position.x += 0.1;
        }
        if (inputMap[" "]) { //make block stop moving after space?
            box.position.y -= 0.1; 
            //box.position.y = 1; //touch ground (ground.position.y = 0)
        }
    });

    //block falling
    scene.onBeforeRenderObservable.add(() => { 
        if(box.position.y > 0.5) {
            box.position.y -= 0.01;
        }
    });

    return scene;
};

//host:
var canvas = document.getElementById("renderCanvas") as HTMLCanvasElement; //casted canvas so TS knows this is a canvas element
//create engine/adaptor-translate babylon>>webgl; engine to talk to webgpu; translation by intermediate layer
var engine = new BABYLON.Engine(canvas, true); //turn on engine

//let engine know that window size changed (canvas will change)
window.addEventListener("resize", () => {
    engine.resize();
});

//var scene = new BABYLON.Scene(engine);
var scene = createScene(); //up top

engine.runRenderLoop(() => { //animates images- 60 fps -synchronizes w/brain to see movement
    scene.render();
});