const spawn = require("child_process").spawn;
const path = require("path");
const fse = require("fs-extra");
const { logRaw } = require("./helpers");

const PROJECT_ROOT = path.join(__dirname, "..");
const XNB_PATH = path.join(PROJECT_ROOT, "node_modules/xnbcli");
const PACK_DIR = path.join(XNB_PATH, "packed/Result");
const UNPACK_DIR = path.join(XNB_PATH, "unpacked/Result");

async function cleanUp() {
  await fse.remove(PACK_DIR);
  await fse.remove(UNPACK_DIR);
}

function unpack() {
  return new Promise((resolve, reject) => {
    const unpack = spawn("npm run unpack", [], {
      cwd: XNB_PATH,
      shell: true,
    });
    unpack.stdout.on("data", (data) => logRaw(data.toString()));
    unpack.on("error", (error) => reject(error));
    unpack.on("close", (code) => {
      if (code !== 0) {
        reject(`unpack process exited with code ${code}`);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  unpack,
  cleanUp,
  PACK_DIR,
  UNPACK_DIR,
};
