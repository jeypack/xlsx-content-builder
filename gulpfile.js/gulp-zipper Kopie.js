/**
 * GULP ZIPPER PLUGIN
 * AUTHOR: J. Pfeifer (c) 2020-2022
 * LICENSE: GNU GENERAL PUBLIC LICENSE
 * Installation: npm i --save-dev events fs plugin-error plugin-error path zip-local
*/
const EventEmitter = require('events');
const fs = require('fs');
const PluginError = require('plugin-error');
const through = require('through2');
const path = require("path");
const zipper = require("zip-local");

const PLUGIN_NAME = "gulp-zipper";

const createDirectory = (dir, cb) => {
    fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) {
            // ignore the error if the folder already exists
            if (err.code == 'EEXIST') {
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
  const errorEmitter = new EventEmitter();

  if (!destination || !destination.length || typeof destination !== "string") {
    errorEmitter.emit(
      "error",
      new PluginError("gulp-zipper", {
        message: "Param 'destination' has to be type of string",
      })
    );
  }
  if (callback && typeof callback !== "function") {
    errorEmitter.emit(
      "error",
      new PluginError("gulp-zipper", {
        message: "Param 'callback' has to be type of function",
      })
    );
  }

  //
  let countFiles = 0,
    // encoding could be e.g. utf8
    handleFile = function (file, encoding, next) {
      let that = this,
        isDirectory = file.isNull(),
        parseObj = path.parse(file.path),
        handle = function (f, p) {
          //console.log('gulp-zipper handle:', p.base);
          if (f) {
            that.push(f);
          }
          if (callback) {
            callback(
              f,
              destination,
              p ? " saved successfully !" : "save failed !"
            );
          }
          next();
        };
      console.log(
        "gulp-zipper file",
        "dir:",
        isDirectory,
        "name:",
        parseObj.name,
        "destination:",
        destination
      );
      if (file.isStream()) {
        that.emit(
          "error",
          new PluginError("gulp-zipper", { message: "Streaming not supported" })
        );
        //console.log('gulp-zipper file.isStream');
        return next();
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
                      countFiles++;
                      handle(file, parseObj);
                    } else {
                      handle(null, parseObj);
                    }
                  }
                );
              }
            });
          } catch (err) {
            console.log("Unable to zip file/directory:", parseObj.base);
            handle(null, parseObj);
          }
        } else {
          that.emit("error", new PluginError("gulp-zipper", { message: err }));
          return next();
        }
      });
    };

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
