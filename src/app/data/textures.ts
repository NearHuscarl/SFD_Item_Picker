import { Database, Table } from "dexie";
import { useIndexedDB } from "app/providers/IndexedDBProvider";

export type TextureTable = Table<TextureData, TextureName>;

export type TextureData = { name: TextureName; texture: ImageData };

export type TextureName = string;

export function useTextureData() {
  const { db } = useIndexedDB();

  return {
    getTexture: (name: TextureName) => getTexture(db, name),
  };
}

function getTexture(db: Database, name: TextureName) {
  const table = getTextureTable(db);
  return table.get({ name });
}

export function getTextureTable(db: Database): TextureTable {
  return db.table<TextureData, TextureName>("textures");
}
