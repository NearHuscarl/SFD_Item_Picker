require("dotenv").config({ path: ".env.local" });
const path = require("path");
const spawn = require("child_process").spawn;
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fse = require("fs-extra");
const chalk = require("chalk");
const { parseSFDX } = require("./parseSFDX");
const glob = require("glob");

const SFD_ITEM_DIR = path.join(process.env.SFD_PATH, "Content/Data/Items");
const SFD_ANI_DIR = path.join(process.env.SFD_PATH, "Content/Data/Animations");
const SFD_COLORS_DIR = path.join(process.env.SFD_PATH, "Content/Data/Colors");
const PROJECT_ROOT = path.join(__dirname, "..");
const SFD_DIR = path.join(PROJECT_ROOT, "public/SFD");
const DATA_DIR = path.join(PROJECT_ROOT, "src/app/data");
const PACK_DIR = path.join(PROJECT_ROOT, "./node_modules/xnbcli/packed");
const UNPACK_DIR = path.join(PROJECT_ROOT, "./node_modules/xnbcli/unpacked");

/**
 * @param {string} path
 */
async function prettier(path) {
  await exec(`prettier --write ${path}`);
}

function unpack() {
  const log = process.stdout.write.bind(process.stdout); // console.log but without printing newline

  return new Promise((resolve, reject) => {
    const unpack = spawn("npm run unpack", [], {
      cwd: "./node_modules/xnbcli",
      shell: true,
    });
    unpack.stdout.on("data", (data) => log(data.toString()));
    unpack.stderr.on("data", (data) => reject(data.toString()));
    unpack.on("close", (code) => {
      if (code !== 0) {
        reject(`unpack process exited with code ${code}`);
      } else {
        resolve();
      }
    });
  });
}

async function generateAnimationData() {
  const animationPath = path.join(SFD_DIR, "Animations/char_anims.json");
  const outputPath = path.join(DATA_DIR, "animations.ts");
  const template = await fse.readFile(
    path.join(__dirname, "templates/animations.ts"),
    "utf8"
  );
  const obj = await fse.readJson(animationPath);

  // trim down because the original animation file is huge, we only need idle animation
  // for this app
  const result = {};

  obj.content.animations.forEach((a) => {
    if (a.name === "BaseIdle" || a.name === "UpperIdle") {
      result[a.name] = a.frames;
    }
  });

  await fse.outputFile(
    outputPath,
    template.replace("__ANIMATIONS__", JSON.stringify(result)),
    "utf8"
  );
  await Promise.all([
    prettier("src/app/data/animations.ts"),
    fse.remove(path.join(SFD_DIR, "Animations")),
  ]);
}

async function unpackItemsAndAnimations() {
  try {
    console.log(
      chalk.magenta("Copy {Items,Animations}/*.xnb to pack directory")
    );
    await fse.remove(SFD_DIR);
    await fse.copy(SFD_ITEM_DIR, path.join(PACK_DIR, "Result/Items"));
    await fse.copy(SFD_ANI_DIR, path.join(PACK_DIR, "Result/Animations"));

    console.log(chalk.magenta("Start unpacking..."));
    await unpack();

    console.log(chalk.magenta("Finish unpacking. Cleaning up..."));
    await fse.copy(path.join(UNPACK_DIR, "Result"), SFD_DIR);
    await fse.remove(path.join(PACK_DIR, "Result"));
    await fse.remove(path.join(UNPACK_DIR, "Result"));

    console.log(chalk.magenta("Generate item data..."));
    await generateItemData();

    console.log(chalk.magenta("Generate animation data..."));
    await generateAnimationData();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function generateItemData() {
  return new Promise((resolve, reject) => {
    glob(path.join(SFD_DIR, "Items/**/*.json"), async (error, paths) => {
      if (error) {
        return reject(error);
      }

      const resultPath = path.join(DATA_DIR, "items.ts");
      const ids = [];
      const template = await fse.readFile(
        path.join(__dirname, "templates/items.ts"),
        "utf8"
      );
      const items = {};

      for (const path of paths) {
        const obj = await fse.readJson(path);
        const item = obj.content;
        const id = item.id;
        const data = [];

        item.export.data.forEach((itemPart) => {
          const { type, textures } = itemPart;

          if (!data[type]) data[type] = [];

          textures.forEach((texture, i) => {
            const localId = i;
            if (texture) {
              data[type].push(localId);
            }
          });
        });

        item.data = data;
        delete item.id;
        delete item.export;

        items[id] = item;
        ids.push(`'${id}'`);
      }

      await fse.outputFile(
        resultPath,
        template
          .replace("__ITEM_ID__", ids.join("|"))
          .replace("__ITEMS__", JSON.stringify(items)),
        "utf8"
      );
      await prettier(resultPath);
      resolve();
    });
  });
}

async function generateItemPalettes() {
  const inputPath = path.join(SFD_COLORS_DIR, "Palettes/ItemPalettes.sfdx");
  const dataNodes = await parseSFDX(inputPath);
  const palettes = {};

  for (const node of dataNodes) {
    const { value, children } = node;
    const colors = {
      primary: [],
      secondary: [],
      tertiary: [],
    };

    for (const child of children) {
      switch (child.property.toUpperCase()) {
        case "COLORS1": {
          colors.primary = child.value.split(",");
          break;
        }
        case "COLORS2": {
          colors.secondary = child.value.split(",");
          break;
        }
        case "COLORS3": {
          colors.tertiary = child.value.split(",");
          break;
        }
        default:
      }
    }

    palettes[value] = colors;
  }

  await generatePaletteData(palettes);
}

/**
 * @param {object} palettes
 * @return {Promise<void>}
 */
async function generatePaletteData(palettes) {
  const resultPath = path.join(DATA_DIR, "palettes.ts");
  const paletteNames = Object.keys(palettes).map((k) => `'${k}'`);
  const template = await fse.readFile(
    path.join(__dirname, "templates/palettes.ts"),
    "utf8"
  );

  await fse.outputFile(
    resultPath,
    template
      .replace("__PALETTES__", JSON.stringify(palettes))
      .replace("__PALETTE_NAMES__", paletteNames.join("|")),
    "utf8"
  );
  await prettier(resultPath);
}

async function generateItemColors() {
  const inputPath = path.join(SFD_COLORS_DIR, "Colors/ItemColors.sfdx");
  const dataNodes = await parseSFDX(inputPath);
  const colors = {};

  for (const node of dataNodes) {
    const { value, children } = node;

    for (const child of children) {
      const colorValues = child.value
        // '(135,83,48) ,(116,  71,41),(96,58,34)'
        .replace(/\s/g, "")
        // '(135,83,48),(116,71,41),(96,58,34)'
        .replace(/\),/g, ") ")
        // '(135,83,48) (116,71,41) (96,58,34)'
        .split(/[\s\(\)]/)
        // ["", "135,83,48", "", "", "116,71,41", "", "", "96,58,34", ""]
        .filter(Boolean)
        // ["135,83,48", "116,71,41", "96,58,34"]
        .map((c) => c.split(",").map(Number));

      if (child.property.toUpperCase() === "C") {
        colors[value] = colorValues;
      }
    }
  }

  await generateColorData(colors);
}

/**
 * @param {object} colors
 * @return {Promise<void>}
 */
async function generateColorData(colors) {
  const resultPath = path.join(DATA_DIR, "colors.ts");
  const colorNames = Object.keys(colors).map((k) => `'${k}'`);
  const template = await fse.readFile(
    path.join(__dirname, "templates/colors.ts"),
    "utf8"
  );

  await fse.outputFile(
    resultPath,
    template
      .replace("__COLORS__", JSON.stringify(colors))
      .replace("__COLOR_NAMES__", colorNames.join("|")),
    "utf8"
  );
  await prettier(resultPath);
}

async function main() {
  if (!process.env.SFD_PATH) {
    throw new Error(
      "process.env.SFD_PATH is not set. Please set SFD_PATH to your current" +
        "SFD installation path to continue"
    );
  }
  await Promise.all([
    unpackItemsAndAnimations(),
    generateItemPalettes(),
    generateItemColors(),
  ]);
}

main().then();
