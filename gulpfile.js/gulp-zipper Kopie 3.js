/**
 * GULP ZIPPER PLUGIN
 * AUTHOR: J. Pfeifer (c) 2020-2022
 * LICENSE: GNU GENERAL PUBLIC LICENSE
 * Installation: npm i --save-dev events fs plugin-error plugin-error path zip-local
 */
const fs = require("fs");
const PluginError = require("plugin-error");
const through = require("through2");
const path = require("path");
const zipper = require("zip-local");

const PLUGIN_NAME = "gulp-zipper";

const createDirectory = (dir, cb) => {
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
};

// see 'Writing a plugin'
// https://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/README.md

/**
 *
 * @param {Object} opts An object with property: destination and config
 * @param {*} callback
 * @returns
 */
module.exports = (opts, callback) => {
  const { destination, name } = opts;
  //console.log(gulp-zipper module.exports destination:', destination);

  if (!destination || !destination.length || typeof destination !== "string") {
    throw new PluginError(PLUGIN_NAME, "Missing destination string!");
  }

  if (callback && typeof callback !== "function") {
    throw new PluginError(
      PLUGIN_NAME,
      "Param callback has to be type of function!"
    );
  }

  //
  let countFiles = 0;

  /**
   *
   * @param {File} file
   * @param {String} encoding encoding could be e.e. utf8
   * @param {Function} cb Callback for every file transform
   * @returns gulp ignores any return value of your transform function
   */
  function handleFile(file, encoding, cb) {
    let that = this,
      parseObj = path.parse(file.path),
      countFiles = 0;

    //console.log("gulp-zipper file name:", parseObj.name, "destination:", destination);
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
                  if (callback) {
                    callback(
                      file,
                      destination,
                      !error ? " saved successfully !" : " saved failed !"
                    );
                  }
                  console.log("");
                  cb();
                }
              );
            }
          });
        } catch (err) {
          console.log("Unable to zip file/directory:", parseObj.base);
          callback(file, destination, " saved failed !");
        }
      } else {
        that.emit("error", new PluginError(PLUGIN_NAME, { message: err }));
        return cb();
      }
    });
  }

  // processing non-binary streams
  return through.obj(handleFile, (cb) => {
    zipper.zip(destination, function (error, zipped) {
      //console.log('gulp-zipper zipper.zip', error, zipped);
      if (!error) {
        // compress before exporting
        zipped.compress();
        let jsonStr = JSON.stringify([{ date: new Date() }]),
          json = JSON.parse(jsonStr),
          stamp = json[0].date;
        // or save the zipped file to disk
        zipped.save(
          destination + name + "-" + stamp + ".zip",
          function (error) {
            if (!callback) {
              //console.log(greenBright('gulp-zipper ' + countFiles + ' files/directories successfully zipped!'));
              console.log(
                "ZIPPER    ✔ ",
                countFiles,
                " files/directories successfully zipped :)"
              );
            }
            cb();
          }
        );
      }
    });
  });
};
