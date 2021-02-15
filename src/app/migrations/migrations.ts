import Dexie from "dexie";
import { getTextureTable, TextureData, TextureTable } from "app/data/textures";
import { urlDataToImageData } from "app/helpers/urlDataToImageData";
import pLimit from "p-limit";

const SFD_DIR = `${process.env.PUBLIC_URL}/SFD`;

function fetchTextures() {
  return fetch(`${SFD_DIR}/Items/image-data.json`).then((r) => r.json());
}

export function migrate(db: Dexie) {
  db.version(1).stores({
    textures: "name",
  });

  const initTextures = async (textureTable: TextureTable, textures: object) => {
    const limit = pLimit(100);
    const names = Object.keys(textures);
    const data: TextureData[] = await Promise.all(
      names.map((name) =>
        limit(async () => ({
          name,
          texture: await urlDataToImageData(textures[name]),
        }))
      )
    );

    textureTable.bulkAdd(data);
  };

  return new Promise((resolve, reject) => {
    db.open();
    db.on("ready", () => {
      // on('ready') event will fire when database is open but
      // before any other queued operations start executing.
      // By returning a Promise from this event,
      // the framework will wait until promise completes before
      // resuming any queued database operations.
      // Let's start by using the count() method to detect if
      // database has already been populated.
      const textureTable = getTextureTable(db);

      return textureTable
        .count()
        .then((count) => {
          if (count === 0) {
            console.log("Database is empty. Populating...");
            console.log("Fetching textures...");

            return fetchTextures()
              .then((textures) => {
                console.log("Init textures...");
                return initTextures(textureTable, textures);
              })
              .then(() => {
                console.log("Finished populating...");
                resolve(undefined);
              });
          } else {
            resolve(undefined);
          }
        })
        .catch(reject);
    });
  });
}
