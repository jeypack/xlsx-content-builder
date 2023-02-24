const { col } = require("../console-col");

/**
 * XLSXParser XLSXParser.js
 * AUTHOR: J. Pfeifer (c) 2022
 * Created: 20.07.2022
 */
class XLSXParser {
  constructor(template) {
    this._template = template;
    this._elems = {};
    this._failed = 0;
    console.log("XLSXParser constructor");
  }

  get failed() {
    return this._failed;
  }

  set failed(value) {
    throw new TypeError("XLSXParser - Attempted to assign to readonly property 'failed'.");
  }

  get template() {
    return this._template;
  }

  set template(value) {
    this._template = value;
  }

  get parsed() {
    return this._elems;
  }

  set parsed(value) {
    throw new TypeError("XLSXParser - Attempted to assign to readonly property 'parsed'.");
  }

  execute() {
    //this.value = value;
    this._parse();
    return this._elems;
  }

  /**
   * Abstract member with default content.
   * Let subclasses override this protected member function.
   */
  _parse() {
    //we set a default value
    this._elems.module1 = {
      headline: { key: "Y4", name: "headline", value: "Default Headline Text" },
    };
  }

  /**
   * Protected member - parse field values
   * @param {String} module Module key
   * @param {String} key The workbook object key
   * @param {String} name The variable name for output
   * @param {String} type The type of object to parse
   * @param {String} splitter An optional delimiter to split text
   */
  _setFieldValue(module, key, name, type, splitter) {
    //flightweight - create if not exists
    if (!this._elems[module]) {
      this._elems[module] = {};
    }
    //allways add a default delimiter
    if (typeof splitter === "undefined") {
      splitter = "\n\n";
    }
    //fallback(!) nur wenn kein key angegeben wurde
    const nVal = typeof name !== "undefined" ? name : key;
    let obj = null;
    try {
      let tplField = this._template[key];
      let value = key === "BLANK" ? "" : tplField.v || "";
      obj = { key: key, value: value };
      //special case 'TABLE'
      if (type && type === "TABLE") {
        //create if not exists
        if (!this._elems[module].table) {
          this._elems[module].table = [];
        }
        //nVal is index if TABLE
        if (!this._elems[module].table[nVal]) {
          this._elems[module].table[nVal] = [];
        }
        this._elems[module].table[nVal].push(obj);
        //console.log("_setFieldValue", "nVal:", nVal, "obj:", obj);
      } else if (type && type === "ARRAY") {
        //create if not exists
        if (!this._elems[module][nVal]) {
          this._elems[module][nVal] = [];
        }
        //splitting is default on copy/text
        if (nVal === "copy") {
          obj.spl = value.split(splitter);
        }
        this._elems[module][nVal].push(obj);
      } else {
        this._elems[module][nVal] = obj;
      }
    } catch (error) {
      //console.log('\x1b[36m%s\x1b[0m', 'I am cyan');
      this._failed++;
      console.log(
        col.dim,
        "** setFieldValue",
        col.reset,
        col.fg.yellow,
        "catch ERROR : try to read key:",
        col.fg.magenta,
        key,
        col.reset,
        col.dim,
        "inside template ** failed:",
        col.reset,
        this.failed,
        col.reset
      );
    }
    return obj;
  }
}

module.exports.XLSXParser = XLSXParser;
