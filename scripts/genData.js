require("dotenv").config({ path: ".env.local" });
const path = require("path");
const spawn = require("child_process").spawn;
const fse = require("fs-extra");
const glob = require("glob");
const { parseSFDX } = require("./parseSFDX");
const { prettier, log, logRaw, getLayerText, readImage } = require("./helpers");

const SFD_ITEM_DIR = path.join(process.env.SFD_PATH, "Content/Data/Items");
const SFD_ANI_DIR = path.join(process.env.SFD_PATH, "Content/Data/Animations");
const SFD_COLORS_DIR = path.join(process.env.SFD_PATH, "Content/Data/Colors");
const PROJECT_ROOT = path.join(__dirname, "..");
const SFD_DIR = path.join(PROJECT_ROOT, "public/SFD");
const DATA_DIR = path.join(PROJECT_ROOT, "src/app/data");
const PACK_DIR = path.join(PROJECT_ROOT, "./node_modules/xnbcli/packed");
const UNPACK_DIR = path.join(PROJECT_ROOT, "./node_modules/xnbcli/unpacked");

function unpack() {
  return new Promise((resolve, reject) => {
    const unpack = spawn("npm run unpack", [], {
      cwd: "./node_modules/xnbcli",
      shell: true,
    });
    unpack.stdout.on("data", (data) => logRaw(data.toString()));
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
  const result = {};

  obj.content.animations.forEach((a) => {
    // trim down because the original animation file is huge
    // we only need idle animation for this app
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
    log("Copy {Items,Animations}/*.xnb to pack directory");
    await fse.remove(SFD_DIR);
    await fse.copy(SFD_ITEM_DIR, path.join(PACK_DIR, "Result/Items"));
    await fse.copy(SFD_ANI_DIR, path.join(PACK_DIR, "Result/Animations"));

    log("Start unpacking...");
    await unpack();

    log("Finish unpacking. Cleaning up...");
    await fse.copy(path.join(UNPACK_DIR, "Result"), SFD_DIR);
    await fse.remove(path.join(PACK_DIR, "Result"));
    await fse.remove(path.join(UNPACK_DIR, "Result"));

    log("Generate item data...");
    await generateItemData();

    log("Generate animation data...");
    await generateAnimationData();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

/**
 * @param {any[]} itemArr
 */
function computeGender(itemArr) {
  log("computing gender for items...");

  const male = 0,
    female = 1,
    both = 2;
  function getGender(item) {
    return item.fileName.toLowerCase().endsWith("_fem") ? female : male;
  }

  function getGenderNeutralName(item) {
    if (getGender(item) === female) {
      return item.fileName.substr(0, item.fileName.length - 4);
    }
    return item.fileName;
  }

  for (let i = 0; i < itemArr.length; i++) {
    itemArr[i].gender = both; // initialize gender. Default item can be wore by both genders
  }

  for (let i1 = 0; i1 < itemArr.length; i1++) {
    const item1 = itemArr[i1];

    for (let i2 = i1 + 1; i2 < itemArr.length; i2++) {
      const item2 = itemArr[i2];
      const genderNeutralName1 = getGenderNeutralName(item1);
      const genderNeutralName2 = getGenderNeutralName(item2);

      // if the item has 2 variants, assign to each respective gender
      if (genderNeutralName1 === genderNeutralName2) {
        if (getGender(item1) === male) {
          item1.gender = male;
          item2.gender = female;
        } else {
          item1.gender = female;
          item2.gender = male;
        }
        break;
      }
    }
  }
}

/**
 * @param {any[]} itemArr
 * color level ranges from 0 to 2. it's the number of colors
 * that can be applied to the item texture
 */
async function computeColorLevel(itemArr) {
  log("computing color level for items...");

  for (let i = 0; i < itemArr.length; i++) {
    itemArr[i].colorSlot = [false, false, false];
  }

  const shadeValues = new Set([255, 192, 128]);

  for (let i1 = 0; i1 < itemArr.length; i1++) {
    const item = itemArr[i1];
    const { id, equipmentLayer, fileName } = item;
    const layer = getLayerText(equipmentLayer);

    for (let i2 = 0; i2 < item.data.length; i2++) {
      const type = i2;

      for (let i3 = 0; i3 < item.data[type].length; i3++) {
        const localId = item.data[type][i3];

        const imageFileName = `${fileName}_${type}_${localId}.png`;
        const imagePath = path.join(
          SFD_DIR,
          `Items/${layer}/${id}/${imageFileName}`
        );
        log(`computing color level for ${imageFileName}...`);

        for (let colorSlot = 0; colorSlot < 3; colorSlot++) {
          await readImage(imagePath, (color) => {
            const [r, g, b] = color;

            if (colorSlot === 0 && shadeValues.has(r) && g === 0 && b === 0) {
              item.colorSlot[0] = true;
            }
            if (colorSlot === 1 && shadeValues.has(g) && r === 0 && b === 0) {
              item.colorSlot[1] = true;
            }
            if (colorSlot === 2 && shadeValues.has(b) && r === 0 && g === 0) {
              item.colorSlot[2] = true;
            }
          });
        }
      }
    }
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

        if (!item.canScript) {
          continue;
        }

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
        delete item.export;
        delete item.canEquip;
        delete item.canScript;

        items[id] = item;
        ids.push(`'${id}'`);
      }

      const itemArr = Object.values(items);

      // item array for debugging purpose only
      await fse.outputJson(path.join(SFD_DIR, "items.json"), itemArr);

      computeGender(itemArr);
      await computeColorLevel(itemArr);

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
