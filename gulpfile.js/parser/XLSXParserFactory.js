const { XLSX_TYPE_ENUM } = require("./XLSXParserEnum");
const { XLSXParser } = require("./XLSXParser");
const { XLSXStdModuleParser } = require("./XLSXStdModuleParser");

/**
 * XLSXParserFactory XLSXParserFactory.js
 * AUTHOR: J. Pfeifer (c) 2022-2023
 * Created: 20.07.2022
 */
module.exports.XLSXParserFactory = class XLSXParserFactory {

  static parser = null;

  /**
   * Static factory method
   * @param {String} type Enum xlsx parser type
   * @param {Object} template SheetJS result workbook
   * @returns The parsers result values or null
   */
  static create(type, template) {
    console.log("");
    console.log("XLSXParserFactory.create", "type:", type);
    //
    switch (type) {
      case XLSX_TYPE_ENUM.PARSER_STD_MODULE:
        XLSXParserFactory.parser = new XLSXStdModuleParser(template);
        break;
      default:
        XLSXParserFactory.parser = new XLSXParser(template);
        break;
    }
    return XLSXParserFactory.parser.execute();
  }
};
