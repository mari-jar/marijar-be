const excel = require('xlsx');

const httpError = require('http-errors');

module.exports = class {
  async convertToJSON(payload) {
    try {
      const file = excel.readFile(payload.path);
      const sheetNames = file.SheetNames;
      const totalSheets = sheetNames.length;
      let parsedData = [];

      for (let i = 0; i < totalSheets; i++) {
        const tempData = excel.utils.sheet_to_json(file.Sheets[sheetNames[i]]);
        parsedData.push(...tempData);
      }

      return ({ err: false, parsedData });
    }

    catch (err) {
      console.log(err);
      return ({ err: true, msg: httpError.InternalServerError(err) });
    }
  }
}
