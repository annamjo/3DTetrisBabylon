var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0); //sets background color to black
    var camera = new BABYLON.ArcRotateCamera("camera", (3 * Math.PI) / 2, Math.PI / 4, 15, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);
    //see documentation on Babylon (Cameras, Mesh Collisions and Gravity) -- prevents camera collisions?
    camera.checkCollisions = true;
    camera.collisionRadius = new BABYLON.Vector3(0.5, 0.5, 0.5);
    //top light
    var topLight = new BABYLON.HemisphericLight("topLight", new BABYLON.Vector3(0, 1, 0), scene);
    topLight.intensity = 0.7;
    var botLight = new BABYLON.HemisphericLight("botLight", new BABYLON.Vector3(0, -1, 0), scene);
    botLight.intensity = 0.5;
    //created grid that will be applied to ground
    var groundGrid = createGrid(width);
    groundGrid.backFaceCulling = false; //allowing to see "underside" of grid
    //standard ground
    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: width, height: width }, scene);
    ground.position.y = -5; //drops ground lower on screen
    ground.material = groundGrid; //sets ground material to grid
    //creates planes for sides
    var fplane = createPlane(0, 0, -width / 2, Math.PI); //front plane
    var bplane = createPlane(0, 0, width / 2, 0);
    //right & left planes
    var rplane = createPlane(width / 2, 0, 0, Math.PI / 2);
    var lplane = createPlane(-width / 2, 0, 0, (3 * Math.PI) / 2);
    return scene;
};
//prompt to ask for size of grid
var answer = prompt("What size grid do you want?", "5");
var width = parseInt(answer);
var offset = false;
if (width % 2 === 1) {
    offset = true;
}
;
//NEED to put this code to render the local browser page
var canvas = document.getElementById('renderCanvas');
var engine = new BABYLON.Engine(canvas, true);
window.addEventListener('resize', function () {
    engine.resize();
});
//Must call the function in order to render the scene
var scene = createScene(); //where we are; container but NEED camera
/***** Testing blocks *****/
// var smallCube = new SmallCube("smallCube", true, offset);
// smallCube.movement(smallCube.piece);        //calls Piece's movement function; then accesses physical block 
// var shortTower = new ShortTower("shortTower", true, offset);
// shortTower.movement(shortTower.piece);      //calls Piece's movement function; then accesses physical block
// var largeCube = new LargeCube("largeCube", true, offset);
// largeCube.movement(largeCube.piece);
// var miniL = new MiniL("miniL", true, offset);
// miniL.movement(miniL.piece);
var bigL = new BigL("bigL", true, offset);
bigL.movement(bigL.piece);
/***** Testing blocks *****/
engine.runRenderLoop(function () {
    scene.render();
});
function createGrid(width) {
    var grid = new BABYLON.GridMaterial("grid", scene);
    grid.lineColor = BABYLON.Color3.White(); //sets line color to white
    grid.majorUnitFrequency = 1; //every line is a strong line
    grid.opacity = 0.99; //changes opacity of main line; must be less than 1 in order for empty space to be transparent
    if (offset) { //if odd number given
        grid.gridOffset = new BABYLON.Vector3(0.5, 0, 0.5); //offsets grid by half a square
    }
    return grid;
}
;
function createPlane(x, y, z, rotation) {
    var planeGrid = createGrid(width);
    planeGrid.backFaceCulling = true;
    var plane = BABYLON.MeshBuilder.CreatePlane("plane", { height: 10, width: width }, scene);
    plane.position.x = x;
    plane.position.y = y;
    plane.position.z = z;
    plane.rotation.y = rotation;
    plane.material = planeGrid;
    return plane;
}
;
//# sourceMappingURL=classTest.js.map