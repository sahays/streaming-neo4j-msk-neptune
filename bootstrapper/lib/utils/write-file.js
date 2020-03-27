const fs = require("fs");

const appendToFile = (path, text) => {
  try {
    fs.appendFileSync(path, text);
  } catch (e) {
    console.log(e, path, text);
  }
};
const overwriteFile = (path, text) => {
  try {
    fs.writeFileSync(path, text);
  } catch (e) {
    console.log(e, path, text);
  }
};

module.exports = { appendToFile, overwriteFile };
