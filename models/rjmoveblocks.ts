var createScene = function() {
    
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("camera", (3*Math.PI)/2, 0, 20, new BABYLON.Vector3(0, 0, 0), scene);

    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    light.intensity = 0.7;

    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
     
    //created grid that will be applied to ground
    var groundGrid = new BABYLON.GridMaterial("groundMaterial", scene);
    groundGrid.lineColor = BABYLON.Color3.White();   //sets line color to gray
    groundGrid.opacity = 0.99;      //changes opacity of main line; must be less than 1 in order for empty space to be transparent
    groundGrid.gridRatio = 0.1;     //making x10 more lines appear
    groundGrid.minorUnitVisibility = 0.0;   //making minor lines invisible (0% to 100% opacity)
 
    ground.material = groundGrid;
    ground.material.backFaceCulling = false;    //allowing to see "underside" of grid

    var cube = BABYLON.MeshBuilder.CreateBox("cube", {size: 1}, scene);
    cube.material = new BABYLON.GridMaterial("groundMaterial", scene);
    cube.position.y = 5;

    //changes color of box to red
        // var cubeMaterial = new BABYLON.StandardMaterial('cubeMat', scene);
        // cubeMaterial.diffuseColor = BABYLON.Color3.Red();
        // cube.material = cubeMaterial;

    //keyboard events
    var inputMap = {};
    //adding action manager to scene
    scene.actionManager = new BABYLON.ActionManager(scene);

    scene.actionManager.registerAction( //registers action
        new BABYLON.ExecuteCodeAction( //do function (param2) on trigger (param1)
            BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
                inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";   //??? what is inputMap
            } 
        )
    );

    scene.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {								
                inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";  //what is inputMap
            }
        )
    );

    //code will be called at every frame (~60fps)
    scene.onBeforeRenderObservable.add(() => {    //What does inputMap[...] do?
        //TODO: Lock block when touching plane or other blocks       
        //input limited to w-a-s-d keys
        if(inputMap["w"]){  // || inputMap["ArrowUp"]
            cube.position.z += 0.1;
        } 
        if(inputMap["a"]){  // || inputMap["ArrowLeft"]
            cube.position.x -= 0.1;
        } 
        if(inputMap["s"]){  // || inputMap["ArrowDown"]
            cube.position.z -= 0.1;
        } 
        if(inputMap["d"]){  //  || inputMap["ArrowRight"]
            cube.position.x += 0.1;
        }    
        if(inputMap[" "]) { //Move down on " " (space)
            cube.position.y -= 0.1;
        }
        //code to make shape rise; will not be needed in 3D Tetris
        if(inputMap["2"]) {
            cube.position.y += 0.1;
        }
    });
    
    //block falling
    scene.onBeforeRenderObservable.add(() => { 
        if(cube.position.y > 0.5) {
            cube.position.y -= 0.01;
        }
    });

    return scene;

};

//NEED to put this code to render the local browser page
var canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
var engine = new BABYLON.Engine(canvas, true);

window.addEventListener('resize', () => {   //checks if user resizes window
    engine.resize();
});

//Must call the function
var scene = createScene();  //where we are; container but NEED camera

engine.runRenderLoop(() => {    //loop that gives new image to system at around 60 fps
    scene.render();
});

