var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0); //sets background color to black
    scene.collisionsEnabled = true;
    //top light
    var topLight = new BABYLON.HemisphericLight("topLight", new BABYLON.Vector3(0, 1, 0), scene);
    topLight.intensity = 0.7;
    var botLight = new BABYLON.HemisphericLight("botLight", new BABYLON.Vector3(0, -1, 0), scene);
    botLight.intensity = 0.5;
    var camera = new BABYLON.ArcRotateCamera("camera", (3 * Math.PI) / 2, Math.PI / 4, 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);
    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);
    //created grid that will be applied to ground
    var groundGrid = createGrid();
    if (offsetW && offsetH) { //if odd number given for base and height...
        groundGrid.gridOffset = new BABYLON.Vector3(0.5, 0.5, 0.5);
    }
    if (offsetW) { //if odd number given for base...
        groundGrid.gridOffset = new BABYLON.Vector3(0.5, 0, 0.5);
    }
    groundGrid.backFaceCulling = false; //allowing to see "underside" of grid
    //standard ground
    ground = BABYLON.MeshBuilder.CreateGround("ground", { width: width, height: width }, scene);
    ground.position.y = -height / 2; //drops ground lower on screen
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
// var answer = prompt("What size grid do you want?", "5");
// var width : number = parseInt(answer);
var width = 3;
var offsetW = false;
if (width % 2 === 1) {
    offsetW = true;
}
;
//Change this number to change height :)
var height = 3;
var offsetH = false; //if false, height is even and no need for offseting grid
if (height % 2 === 1) {
    offsetH = true;
}
var canvas = document.getElementById('renderCanvas');
var engine = new BABYLON.Engine(canvas, true);
window.addEventListener('resize', function () {
    engine.resize();
});
var scene = createScene(); //where we are; container but NEED camera
engine.runRenderLoop(function () {
    scene.render();
});
//row 0
var box00 = new SmallCube("0, 0", false, offsetW, offsetH, ground);
box00.piece.position = new BABYLON.Vector3(-1, -1, 1);
// var box01 = new SmallCube("0, 0", false, offsetW, offsetH, ground);
// box01.piece.position = new BABYLON.Vector3(0, -1, 1);
// var box02 = new SmallCube("0, 0", false, offsetW, offsetH, ground);
// box02.piece.position = new BABYLON.Vector3(1, -1, 1);
// //row 1
// var box10 = new SmallCube("0, 0", false, offsetW, offsetH, ground);
// box10.piece.position = new BABYLON.Vector3(-1, -1, 0);
// var box11 = new SmallCube("0, 0", false, offsetW, offsetH, ground);
// box11.piece.position = new BABYLON.Vector3(0, -1, 0);
// var box12 = new SmallCube("0, 0", false, offsetW, offsetH, ground);
// box12.piece.position = new BABYLON.Vector3(1, -1, 0);
// //row 2
// var box20 = new SmallCube("0, 0", false, offsetW, offsetH, ground);
// box20.piece.position = new BABYLON.Vector3(-1, -1, -1);
// var box21 = new SmallCube("0, 0", false, offsetW, offsetH, ground);
// box21.piece.position = new BABYLON.Vector3(0, -1, -1);
// var box22 = new SmallCube("0, 0", false, offsetW, offsetH, ground);
// box22.piece.position = new BABYLON.Vector3(1, -1, -1);
/*
 *  Brainstorming for 3D Array:
 *  In essence, we want to get the position of the block when it is locked to the grid, check to see
 *  where the position would fall in the 3D array, and set that element in the array to "occupied". The
 *  block's locked position should correlate to a spot or spots (depending on the size) in the array
 *
 *  How to implement?
 *  Each index in the array can correspond to the spots on the board, meaning the index of the first
 *  element would be -width/2 (something like that). Using the position of the box, find the spot
 *  in the array and set the boolean to true.
 */
var gridArray = createArray(width, height);
function createArray(base, height) {
    console.log("Creating 3d array. False if empty, true is full");
    //set so that element aligns with coordinates on grid
    var startingX = -Math.floor(base / 2) - 1; //= -2
    var startingY = Math.floor(height / 2) + 1; //= 2
    var startingZ = -Math.floor(base / 2) - 1; //= -2
    // +/- 1 because the variable gets incremented before used; with 3x3x3 grid, [-1, 1] for all values
    //current positions
    var x = startingX;
    var y = startingY;
    var z = startingZ;
    var positionArray = new Array(base); //creates new array where length = base (3)
    //constructing array in which the bottom left corner is object with coordinates (-1, -1, 1)
    for (var i = 0; i < positionArray.length; i++) { //loop for x
        x++;
        positionArray[i] = new Array(height); //2d array
        y = startingY;
        for (var j = 0; j < positionArray[i].length; j++) { //loop for y
            y--;
            positionArray[i][j] = new Array(base); //3d array
            z = startingZ;
            for (var k = 0; k < positionArray[i][j].length; k++) { //loop for z
                z++;
                var blockData = {
                    xPos: x,
                    yPos: y,
                    zPos: z,
                    hasObj: false
                };
                positionArray[i][j][k] = blockData;
            }
        }
    }
    return positionArray;
}
;
/*
 *  With the createArray() function, each index now has (x, y, z) coordinates and a boolean determining whether
 *  the index is empty or not.
 *
 *  Now what? What do I want to happen?
 *  After the block is locked, get the (x, y, z) coordinates of the locked block. Find the correlating (x, y, z)
 *  coordinates in the 3D array and change the hasObj property of the element to true. The 3D array will not be
 *  used for collisions, but rather for clearing 3D rows out. If the 3D row (x, z) is full, clear the blocks.
 */
var xPiecePos = box00.piece.position.x;
var yPiecePos = box00.piece.position.y;
var zPiecePos = box00.piece.position.z;
// console.log(xPiecePos, yPiecePos, zPiecePos);
console.log("This object exists in the array:");
console.log(gridArray[0][2][2]);
//doesn't work on multi-dimensional array ://
// let blockLocation : number = gridArray.indexOf({xPos: xPiecePos, yPos: yPiecePos, zPos: zPiecePos, hasObj: false});
// console.log(blockLocation);
//TO-DO: expensive to iterate over 3D array
function getIndexOf(array, obj) {
    for (var i = 0; i < array.length; i++) { //loop for x
        for (var j = 0; j < array[i].length; j++) { //loop for y
            for (var k = 0; k < array[i][j].length; k++) { //loop for z
                array[i][j][k].x;
                var index = array[i][j].indexOf(obj);
                if (index > -1) {
                    return [i, k, index];
                }
            }
        }
    }
    return -1;
}
;
var objectToBeFound = {
    xPos: xPiecePos,
    yPos: yPiecePos,
    zPos: zPiecePos,
    hasObj: false
};
console.log("Object I am looking for: ");
console.log(objectToBeFound);
//func doesn't work
var blockLocation = getIndexOf(gridArray, objectToBeFound);
console.log("The location of the object in the array: " + blockLocation);
function createGrid() {
    var grid = new BABYLON.GridMaterial("grid", scene);
    grid.lineColor = BABYLON.Color3.White(); //sets line color to white
    grid.majorUnitFrequency = 1; //every line is a strong line
    grid.opacity = 0.99; //changes opacity of main line; must be less than 1 in order for empty space to be transparent
    return grid;
}
;
function createPlane(x, y, z, rotation) {
    var planeGrid = createGrid();
    if (offsetW && offsetH) { //if odd number given for base
        planeGrid.gridOffset = new BABYLON.Vector3(0.5, 0.5, 0);
    }
    else if (offsetH) { //if odd number given for height
        planeGrid.gridOffset = new BABYLON.Vector3(0, 0.5, 0.5);
    }
    else if (offsetW) {
        planeGrid.gridOffset = new BABYLON.Vector3(0.5, 0, 0.5); //offsets ground grid by half a square
    }
    else {
        //do nothing
    }
    planeGrid.backFaceCulling = true;
    var plane = BABYLON.MeshBuilder.CreatePlane("plane", { height: height, width: width }, scene);
    plane.position.x = x;
    plane.position.y = y;
    plane.position.z = z;
    plane.rotation.y = rotation;
    plane.material = planeGrid;
    plane.checkCollisions = true;
    return plane;
}
;
//# sourceMappingURL=blockTest.js.map