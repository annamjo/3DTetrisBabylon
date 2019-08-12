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
    for (var i = 0; i < array.length; i++) { //loop for x
        array[i] = new Array(height); //2d array
        for (var j = 0; j < array[i].length; j++) { //loop for y
            array[i][j] = new Array(width); //3d array
            for (var k = 0; k < array[i][j].length; k++) { //loop for z
                array[i][j][k] = false;
            }
        }
    }
    return array;
}
function generateObjectArray(width, height) {
    var array = new Array(width);
    for (var i = 0; i < array.length; i++) { //loop for x
        array[i] = new Array(height); //2d array
        for (var j = 0; j < array[i].length; j++) { //loop for y
            array[i][j] = new Array(width); //3d array
            for (var k = 0; k < array[i][j].length; k++) { //loop for z
                array[i][j][k] = null;
            }
        }
    }
    return array;
}
//TO-DO: won't work on other blocks besides SmallCube
//find location of block and place it into grid
function placeBlock(mesh, array) {
    //coordinates of piece on grid (x, y, z)
    var xPos = mesh.position.x;
    var yPos = mesh.position.y;
    var zPos = mesh.position.z;
    console.log("x: " + xPos + " y: " + yPos + " z: " + zPos);
    // uncomment for shapes other than small cube
    // if (offsetW) {
    //     xPos += 0.5;
    //     zPos += 0.5;
    // }
    // if(offsetH) {
    //     yPos -= 0.5;
    // }
    console.log("x: " + xPos + " y: " + yPos + " z: " + zPos);
    //coodinates of piece in array [x][y][z]
    var xArr = gridToArray("X", xPos);
    var yArr = gridToArray("Y", yPos);
    var zArr = gridToArray("Z", zPos);
    console.log("x: " + xArr + " y: " + yArr + " z: " + zArr);
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
    switch (coord.toUpperCase()) {
        case "X":
            return point + ((width - 1) / 2); //x + width/2
            break;
        case "Y":
            return (point - (width - 1) / 2) * -1; //-(y-(width/2))
            break;
        case "Z":
            return point + ((width - 1) / 2); //z + width/2
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
    for (var i = 0; i < grid.length; i++) { //loop for x
        for (var j = 0; j < grid[i].length; j++) { //loop for y
            for (var k = 0; k < grid[i][j].length; k++) { //loop for z
                //if spot on grid is empty but spot on piece is occupied (block is there)...
                if (grid[i][j][k] === false && piece[i][j][k] === true) {
                    grid[i][j][k] = true; //set grid spot to true
                }
            }
        }
    }
}
function checkLayer(layer, grid) {
    var tracker = true; //any discrepancies on the level at all will set tracker to false; layer is not full
    for (var x = 0; x < width; x++) {
        for (var z = 0; z < width; z++) {
            if (grid[x][layer][z] === false) {
                tracker = false;
            }
        }
    }
    return tracker;
}
function clearLayer(y) {
    for (var x = 0; x < width; x++) {
        for (var z = 0; z < width; z++) {
            //TO-DO: Could figure out how to delete blocks...
            blockAt(x, y, z, objectData).isVisible = false; //makes object invisible
            gridData[x][y][z] = false; //sets spot as empty
        }
    }
}
//get the object in that position
function blockAt(x, y, z, objectArray) {
    var mesh = objectArray[x][y][z];
    return mesh;
}
//place object in object array
function placeObject(mesh, array) {
    var xPos = mesh.position.x;
    var yPos = mesh.position.y;
    var zPos = mesh.position.z;
    //coodinates of piece in array [x][y][z]
    var xArr = gridToArray("X", xPos);
    var yArr = gridToArray("Y", yPos);
    var zArr = gridToArray("Z", zPos);
    //sets spot in array to true because that's the spot in the grid that the cube occupies
    array[xArr][yArr][zArr] = mesh;
}
//remove object in object array
function removeObject(mesh, array) {
    var xPos = mesh.position.x;
    var yPos = mesh.position.y;
    var zPos = mesh.position.z;
    //coodinates of piece in array [x][y][z]
    var xArr = gridToArray("X", xPos);
    var yArr = gridToArray("Y", yPos);
    var zArr = gridToArray("Z", zPos);
    //sets spot in array to true because that's the spot in the grid that the cube occupies
    array[xArr][yArr][zArr] = null;
}
//# sourceMappingURL=gridData.js.map