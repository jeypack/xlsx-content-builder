const { XLSX_TYPE_ENUM } = require("../gulp-xlsx-helper");
/**
 * XLSXParserFactory XLSXParserFactory.js
 * AUTHOR: J. Pfeifer (c) 2022
 * Created: 20.07.2022
 */
module.exports.XLSXParserFactory = class XLSXParserFactory {
  static create(type) {
    switch (type) {
      case XLSX_TYPE_ENUM.ORAL_B_KIDS_1_4_4_1_FLEX_3:
        break;

      case XLSX_TYPE_ENUM.ORAL_B_PRO3_1_4_4_1_FLEX_4:
        break;
      default:
        break;
    }
  }
};
