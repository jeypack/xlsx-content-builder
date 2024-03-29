const { col } = require("../console-col");

/**
 * XLSXParser XLSXParser.js
 * AUTHOR: J. Pfeifer (c) 2022-2023
 * Created: 20.07.2022
 */
class XLSXParser {
  static MOD_TYPE_STD = "STD";
  static MOD_TYPE_ARRAY = "ARRAY";
  static MOD_TYPE_TABLE = "TABLE";

  constructor(template) {
    this._template = template;
    this._elems = {};
    this._captionStartNums = [];
    this._failed = 0;
  }

  get failed() {
    return this._failed;
  }
  set failed(value) {
    throw new TypeError(
      "XLSXParser - Attempted to assign to readonly property 'failed'."
    );
  }

  get template() {
    return this._template;
  }
  set template(value) {
    this._template = value;
  }

  get captionStartNums() {
    return this._captionStartNums;
  }
  set captionStartNums(value) {
    throw new TypeError(
      "XLSXParser - Attempted to assign to readonly property 'captionStartNums'."
    );
  }

  /**
   * Template method - subclasses should call not override!
   * @returns An array of all modules listed by key name, id and type
   */
  addModules() {
    const elems = this._elems;
    const modules = [];
    for (let key in elems) {
      if (elems.hasOwnProperty(key) && key.indexOf("module") !== -1) {
        let elem = elems[key];
        let type = XLSXParser.MOD_TYPE_STD;
        //moduleTypeSTD moduleTypeARRAY moduleTypeTABLE
        if (elem.hasOwnProperty("moduleTypeARRAY")) {
          type = XLSXParser.MOD_TYPE_ARRAY;
        } else if (elem.hasOwnProperty("moduleTypeTABLE")) {
          type = XLSXParser.MOD_TYPE_TABLE;
          elems.numSliderCols = elem.table[0].length - 1;
        }
        //add to modules
        modules.push({
          name: key,
          id: modules.length + 1,
          type: type,
          elem: elem,
        });
      }
    }
    elems.modules = modules;
    return modules;
  }

  /**
   * Public Template method
   * @returns An parsed object from xlsx and all modules listed by key name, id and type
   */
  execute() {
    //this.value = value;
    this._parse();
    return this._elems;
  }

  /**
   * Abstract Protected member with default content.
   * Leave this to subclasses to override this member function.
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
      /* console.log(
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
      ); */
    }
    return obj;
  }
}

module.exports.XLSXParser = XLSXParser;
