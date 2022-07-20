/**
 * XLSXParser XLSXParser.js
 * AUTHOR: J. Pfeifer (c) 2022
 * Created: 20.07.2022
 */
module.exports.XLSXParser = class XLSXParser {
  constructor(template) {
    this._template = template;
    this._value = {};
    console.log("XLSXParser constructor");
  }

  get template() {
    return this._template;
  }

  set template(value) {
    this._template = value;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
  }

  parse(value) {
    this.value = value;
    this._parse();
  }

  _parse() {
    //let subclasses override this protected member function
  }

  _setFieldValue(module, key, name, type, splitter) {
    console.log("XLSXParser _setFieldValue");
  }

};
