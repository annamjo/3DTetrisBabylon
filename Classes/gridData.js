/*
 *  The grid data is separate from the 3D aspect of the game. This would be considered the backend of the
 *  game. This file will house a 3D array that stores boolean values of whether the index has an object or
 *  does not have an object.
 *
 *  In order for this to work, what do we need to happen?
 *  The board needs to have a 3D array that keeps track of all pieces on the board. DONE
 *  Each individual piece needs to have a 3D array that stores the location of the piece. DONE
 *  Before the block moves, we need to check if the move is possible. DONE
 *  The piece array should update meaning the new spot is true and the old spot if false.
 *  The piece array and grid array should merge.
 */
//generates 3d array, size: width x height x width; boolean values are defaulted to false (empty)
function generateArray(width, height) {
    var array = new Array(width);
    for (var x = 0; x < array.length; x++) { //loop for x
        array[x] = new Array(height); //2d array
        for (var y = 0; y < array[x].length; y++) { //loop for y
            array[x][y] = new Array(width); //3d array
            for (var z = 0; z < array[x][y].length; z++) { //loop for z
                array[x][y][z] = false;
            }
        }
    }
    return array;
}
function generateArrayCollisions(width, height) {
    //+2 bc adding border around
    var w = width + 2;
    var h = height + 2;
    var array = new Array(w);
    for (var x = 0; x < array.length; x++) { //loop for x
        array[x] = new Array(h); //2d array
        for (var y = 0; y < array[x].length; y++) { //loop for y
            array[x][y] = new Array(w); //3d array
            for (var z = 0; z < array[x][y].length; z++) { //loop for z
                if (x === 0 || x === w - 1 || y === h - 1 || z === 0 || z === w - 1) {
                    array[x][y][z] = true;
                }
                else {
                    array[x][y][z] = false;
                }
            }
        }
    }
    return array;
}
//find location of block and place it into grid
function placeBlock(mesh, array) {
    //coordinates of piece on grid (x, y, z)
    var xPos = mesh.position.x;
    var yPos = mesh.position.y;
    var zPos = mesh.position.z;
    // console.log("x: " + xPos + " y: " + yPos + " z: " + zPos);
    //coodinates of piece in array [x][y][z]
    var xArr = gridToArray("X", xPos);
    var yArr = gridToArray("Y", yPos);
    var zArr = gridToArray("Z", zPos);
    // console.log("x: " + xArr + " y: " + yArr + " z: " + zArr);
    //sets spot in array to true because that's the spot in the grid that the cube occupies
    array[xArr][yArr][zArr] = true;
}
//opposite of placeBlock(); sets position to false
function removeBlock(mesh, grid, piece) {
    //coordinates of piece on grid (x, y, z)
    var xPos = mesh.position.x;
    var yPos = mesh.position.y;
    var zPos = mesh.position.z;
    //coodinates of piece in array [x][y][z]
    var xArr = gridToArray("X", xPos);
    var yArr = gridToArray("Y", yPos);
    var zArr = gridToArray("Z", zPos);
    grid[xArr][yArr][zArr] = false;
    piece[xArr][yArr][zArr] = false;
}
//function that convert point in grid (x, y, z) to point in array [x][y][z]
function gridToArray(coord, point) {
    //for gridArrayCollisions
    var w = width + 2;
    var h = height + 2;
    switch (coord.toUpperCase()) {
        case "X":
            return point + ((w - 1) / 2); //x + width/2
            break;
        case "Y":
            return (point - (h - 1) / 2) * -1; //-(y-(width/2))
            break;
        case "Z":
            return point + ((w - 1) / 2); //z + width/2
            break;
    }
}
function meshCollisionCheck(xPos, yPos, zPos, grid) {
    //coodinates of piece in array [x][y][z]
    var xArr = gridToArray("X", xPos);
    var yArr = gridToArray("Y", yPos);
    var zArr = gridToArray("Z", zPos);
    if (grid[xArr][yArr][zArr] === false) { //if spot on grid is empty, return true (mesh can move there)
        return true;
    }
    return false;
}
/*
 *  Basic functionality:
 *  - Compare each element in grid array to each element in piece array
 *  - Overlay piece array to grid array; combine
 *  - If true && true of both grids, block can't move there
 */
function mergeArrays(grid, piece) {
    // console.log("grid array");
    // console.log(grid);
    // console.log("piece array");
    // console.log(piece);
    // console.log();
    for (var x = 0; x < grid.length; x++) { //loop for x
        for (var y = 0; y < grid[x].length; y++) { //loop for y
            for (var z = 0; z < grid[x][y].length; z++) { //loop for z
                //if spot on grid is empty but spot on piece is occupied (block is there)...
                if (grid[x][y][z] === false && piece[x][y][z] === true) {
                    grid[x][y][z] = true; //set grid spot to true
                }
            }
        }
    }
}
//get the object in that position
function blockAt(x, y, z, objectArray) {
    var mesh = objectArray[x][y][z];
    return mesh;
}
/*
 *  The pieces we currently have are...
 *      0.) SmallCube
 *      1.) LargeCube
 *      2.) MiniL
 *      3.) ShortTower
 */
function randomlyGeneratePiece() {
    var number = Math.floor((Math.random() * 4)); //pick numbers 0-3 inclusive
    console.log(number);
    var block;
    switch (number) {
        case 0: //SmallCube
            block = new SmallCube("smallCube", true, offsetW, offsetH, ground);
            break;
        case 1: //LargeCube
            block = new LargeCube("largeCube", true, offsetW, offsetH, ground);
            break;
        case 2: //MiniL
            block = new MiniL("miniL", true, offsetW, offsetH, ground);
            break;
        case 3: //ShortTower
            block = new ShortTower("shortTower", true, offsetW, offsetH, ground);
            break;
    } //switch
    return block;
}
//# sourceMappingURL=gridData.js.map