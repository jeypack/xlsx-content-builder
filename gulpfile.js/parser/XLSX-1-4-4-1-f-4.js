const { XLSXParser } = require("./XLSXParser");
/**
 * XLSX1441f4 XLSX1441f4.js
 * AUTHOR: J. Pfeifer (c) 2022
 * Created: 20.07.2022
 */
module.exports.default = class XLSX1441f4 extends XLSXParser {
  
  _parse() {
    //let subclasses override this protected member function
    console.log("XLSX1441f4 extends XLSXParser - call protected method _parse");
  }

};
