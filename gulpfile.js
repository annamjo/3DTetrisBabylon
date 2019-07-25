var gulp = require("gulp");
var webserver = require("gulp-webserver");

/**
 * Embedded webserver for test convenience.
 */
gulp.task("default", function () {
    var options = {
        port: 8000, //change if changing port
        livereload: false
    };

    gulp.src(".").pipe(webserver(options));
});