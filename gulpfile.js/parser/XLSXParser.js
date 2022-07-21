/**
 * XLSXParser XLSXParser.js
 * AUTHOR: J. Pfeifer (c) 2022
 * Created: 20.07.2022
 */
class XLSXParser {
  constructor(template) {
    this._template = template;
    this._elems = {};
    console.log("XLSXParser constructor");
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

  execute() {
    //this.value = value;
    this._parse();
    return this._elems;
  }

  //abstract let subclasses override this protected member function
  _parse() {
    //we set a default value
    this._elems.module = { headline: { key: 'Y4', value: 'Default Headline Text' } };
  }

  _setFieldValue(module, key, name, type, splitter) {
    //console.log("XLSXParser _setFieldValue");
    if (!this._elems[module]) {
      this._elems[module] = {};
    }
    if (typeof splitter === "undefined") {
      splitter = "\n\n";
    }
    //fallback(!) nur wenn kein key angegeben wurde
    const nVal = typeof name !== "undefined" ? name : key;
    //setFieldValue("module5", "BLANK", "table-0", "ARRAY");
    //setFieldValue("module5", "AC36", "table-0", "ARRAY");
    try {
      let value = key === "BLANK" ? "" : this._template[key].v || "";
      let obj = { key: key, value: value };

      /* if (typeof splitter !== "undefined") {
        obj.spl = value.split(splitter);
      } */
      if (type && type === "TABLE") {
        if (!this._elems[module].table) {
          this._elems[module].table = [];
        }
        //make array, if not allready exists!
        //nVal is index if TABLE
        if (!this._elems[module].table[nVal]) {
          this._elems[module].table[nVal] = [];
        }
        this._elems[module].table[nVal].push(obj);
        //console.log("setFieldValue", "nVal:", nVal, "obj:", obj);
      } else if (type && type === "ARRAY") {
        console.log("_setFieldValue", "nVal:", nVal, "obj:", obj);
        //make array, if not allready exists!
        if (!this._elems[module][nVal]) {
          this._elems[module][nVal] = [];
        }
        if (nVal === "copy") {
          obj.spl = value.split(splitter);
        }
        this._elems[module][nVal].push(obj);
      } else {
        this._elems[module][nVal] = obj;
      }
    } catch (error) {
      console.log("* setFieldValue catch");
      console.log(
        "*** Try to read key:",
        "'" + key + "' inside this._template - we SKIP this one! ***"
      );
      console.log("*** ERROR:", error.message);
      console.log("*");
    }
  }
}

module.exports.XLSXParser = XLSXParser;
