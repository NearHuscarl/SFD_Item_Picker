const util = require("util");
const exec = util.promisify(require("child_process").exec);
const chalk = require("chalk");
const fse = require("fs-extra");
const PNG = require("pngjs").PNG;

/**
 * @param {string} path
 */
async function prettier(path) {
  await exec(`prettier --write ${path}`);
}

/**
 * @param {string} message
 */
function log(message) {
  console.log(chalk.magenta(message));
}

const _logRaw = process.stdout.write.bind(process.stdout);
/**
 * @param {string} message
 * like console.log but without printing newline character at the end
 */
function logRaw(message) {
  _logRaw(message);
}

/**
 * @param {number} layerId
 */
function getLayerText(layerId) {
  switch (layerId) {
    case 0:
      return "Skin";
    case 1:
      return "ChestUnder";
    case 2:
      return "Legs";
    case 3:
      return "Waist";
    case 4:
      return "Feet";
    case 5:
      return "ChestOver";
    case 6:
      return "Accessory";
    case 7:
      return "Hands";
    case 8:
      return "Head";
    default:
      throw Error(`layerId ${layerId} is not in range 0-8`);
  }
}

/**
 * @param {string} path
 * @param {function(number: [number, number, number, number]): void} onReadPixel
 */
async function readImage(path, onReadPixel) {
  return new Promise((resolve, reject) => {
    fse
      .createReadStream(path)
      .pipe(new PNG({ filterType: 4 }))
      .on("parsed", function () {
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            const idx = (this.width * y + x) << 2;

            onReadPixel([
              this.data[idx],
              this.data[idx + 1],
              this.data[idx + 2],
              this.data[idx + 3],
            ]);
          }
        }

        resolve();
      })
      .on("error", (error, data) => reject({ error, data }));
  });
}

module.exports = {
  prettier,
  log,
  logRaw,
  getLayerText,
  readImage,
};
