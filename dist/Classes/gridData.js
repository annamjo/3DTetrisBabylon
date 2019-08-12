/*
 *  The grid data is separate from the 3D aspect of the game. This would be considered the backend of the
 *  game. This file will house a 3D array that stores boolean values of whether the index has an object or
 *  does not have an object.
 */
//generates 3d array, size: width x height x width; boolean values are defaulted to false (empty)
function generateArray(width, height) {
    var array = new Array(width); //1d array
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
;
//# sourceMappingURL=gridData.js.map