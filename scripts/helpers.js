const util = require("util");
const exec = util.promisify(require("child_process").exec);
const chalk = require("chalk");
const _glob = require("glob");

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
 *
 * @param {ImageData} imageData
 * @param {function(number: [number, number, number, number]): void} onPixel
 */
function forEachPixel(imageData, onPixel) {
  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      const idx = (imageData.width * y + x) << 2;

      onPixel([
        imageData.data[idx],
        imageData.data[idx + 1],
        imageData.data[idx + 2],
        imageData.data[idx + 3],
      ]);
    }
  }
}

/**
 *
 * @param {string} path
 * @return {Promise<string[]>}
 */
function glob(path) {
  return new Promise((resolve, reject) => {
    _glob(path, async (error, paths) => {
      if (error) {
        return reject(error);
      }
      return resolve(paths);
    });
  });
}

module.exports = {
  prettier,
  log,
  logRaw,
  getLayerText,
  forEachPixel,
  glob,
};
