/**
 * GULP ZIPPER PLUGIN
 * AUTHOR: J. Pfeifer (c) 2022
 * LICENSE: GNU GENERAL PUBLIC LICENSE
 * Installation: npm i --save-dev through2 plugin-error fs path zip-local
 */
const through = require("through2");
const PluginError = require("plugin-error");
const fs = require("fs");
const path = require("path");
const zipper = require("zip-local");

const PLUGIN_NAME = "gulp-zipper";

function createDirectory(dir, cb) {
  fs.mkdir(dir, { recursive: true }, (err) => {
    if (err) {
      // ignore the error if the folder already exists
      if (err.code == "EEXIST") {
        cb(null);
      } else {
        // something else went wrong
        cb(err);
      }
    } else {
      // successfully created folder
      cb(null);
    }
  });
}

/**
 * gulpZipper
 * @param {Object} opts An object with destination and name properties^
 * @param {Function} onFileComplete A function to be called after
 * @returns
 */
function gulpPlugin(opts, onFileComplete, onAllFilesComplete) {
  const { destination, name } = opts;

  let countFiles = 0;

  if (!destination || !destination.length || typeof destination !== "string") {
    throw new PluginError(PLUGIN_NAME, "Missing destination string!");
  }

  if (onFileComplete && typeof onFileComplete !== "function") {
    throw new PluginError(
      PLUGIN_NAME,
      "Param onFileComplete has to be type of function!"
    );
  }

  if (onAllFilesComplete && typeof onAllFilesComplete !== "function") {
    throw new PluginError(
      PLUGIN_NAME,
      "Param onAllFilesComplete has to be type of function!"
    );
  }

  /**
   *
   * @param {File} file
   * @param {String} encoding encoding could be e.e. utf8
   * @param {Function} cb Callback for every file transform
   * @returns gulp ignores any return value of your transform function
   */
  function handleFile(file, encoding, cb) {
    let that = this,
      isDirectory = file.isNull(),
      parseObj = path.parse(file.path);

    //console.log("gulp-zipper", "file name:", parseObj.name, "destination:", destination);
    /* if (file.isNull()) {
      // nothing to do
      return cb(null, file);
    } */

    if (file.isStream()) {
      this.emit(
        "error",
        new PluginError(PLUGIN_NAME, "Streaming not supported!")
      );
      return cb();
    }

    // create directory even if it does not exists
    createDirectory(destination, (err) => {
      if (!err) {
        // try zipping a file
        try {
          //console.log('gulp-zipper createDirectory file.path:', file.path);
          zipper.zip(file.path, function (error, zipped) {
            //console.log('gulp-zipper zipper.zip', error, zipped);
            if (!error) {
              // compress before exporting
              zipped.compress();
              // get the zipped file as a Buffer
              //let buff = zipped.memory();
              // or save the zipped file to disk
              zipped.save(
                destination + parseObj.base + ".zip",
                function (error) {
                  if (!error) {
                    that.push(file);
                    countFiles++;
                  }
                  if (onFileComplete) {
                    onFileComplete({
                      file: file,
                      destination: destination,
                      isDirectory: isDirectory,
                      index: countFiles,
                      message: !error
                        ? " saved successfully !"
                        : " saved failed !",
                    });
                  }
                  cb();
                }
              );
            }
          });
        } catch (err) {
          console.log("Unable to zip file/directory:", parseObj.base);
          if (onFileComplete) {
            onFileComplete({
              file: file,
              destination: destination,
              isDirectory: isDirectory,
              index: countFiles,
              message: "Unable to zip file/directory: " + parseObj.base,
            });
          }
        }
      } else {
        that.emit("error", new PluginError(PLUGIN_NAME, { message: err }));
        return cb();
      }
    });
  }

  // creating a stream through which each file will pass
  // processing non-binary streams
  const stream = through.obj(handleFile, (cb) => {
    zipper.zip(destination, function (error, zipped) {
      //console.log('gulp-zipper zipper.zip', error, zipped);
      if (!error) {
        // compress before exporting
        zipped.compress();
        const jsonStr = JSON.stringify([{ date: new Date() }]);
        const json = JSON.parse(jsonStr);
        const stamp = json[0].date;
        // or save the zipped file to disk
        zipped.save(destination + name + "-" + stamp + ".zip", function (err) {
          console.log("ZIPPER    ✔ ", countFiles, "files/directories successfully zipped :)");
          if (onAllFilesComplete) {
            onAllFilesComplete({
              file: destination + name + "-" + stamp + ".zip",
              destination: destination,
              isDirectory: true,
              index: countFiles,
              message: countFiles + " files/directories successfully zipped :)",
            });
          }
          cb();
        });
      }
    });
  });

  // returning the file stream
  return stream;
}

// exporting the plugin main function
module.exports = gulpPlugin;
