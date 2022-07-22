const { XLSX_TYPE_ENUM } = require("./XLSXParserEnum");
const { XLSXParser } = require("./XLSXParser");
const { XLSX1441f3 } = require("./XLSX-1-4-4-1-f-3");
const { XLSX1441f4 } = require("./XLSX-1-4-4-1-f-4");
const { XLSX1331f4 } = require("./XLSX-1-3-3-1-f-4");
const { XLSX1144f6 } = require("./XLSX-1-1-4-4-f-6");

/**
 * XLSXParserFactory XLSXParserFactory.js
 * AUTHOR: J. Pfeifer (c) 2022
 * Created: 20.07.2022
 */
module.exports.XLSXParserFactory = class XLSXParserFactory {
  /**
   * Static factory method
   * @param {String} type Enum xlsx parser type
   * @param {Object} template SheetJS result workbook
   * @returns The parsers result values or null
   */
  static create(type, template) {
    console.log("");
    console.log("XLSXParserFactory.create", "type:", type);
    let parser = null;
    switch (type) {
      case XLSX_TYPE_ENUM.P_1_4_4_1_FLEX_3:
        parser = new XLSX1441f3(template);
        break;
      case XLSX_TYPE_ENUM.P_1_4_4_1_FLEX_4:
        parser = new XLSX1441f4(template);
        break;
      case XLSX_TYPE_ENUM.P_1_3_3_1_FLEX_4:
        parser = new XLSX1331f4(template);
        break;
      case XLSX_TYPE_ENUM.P_1_1_4_4_FLEX_6:
        parser = new XLSX1144f6(template);
        break;
      default:
        parser = new XLSXParser(template);
        break;
    }
    return parser.execute();
  }
};
