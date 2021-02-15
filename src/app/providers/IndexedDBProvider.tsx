import { createContext, PropsWithChildren, useContext, useState } from "react";
import Dexie from "dexie";
import { __PRODUCTION__ } from "app/constants";
import { migrate } from "app/migrations";
import { useOnMount } from "app/helpers/hooks";

type IndexedDBPContextValues = {
  db: Dexie;
};

export const EMPTY_INDEXED_DB_CONTEXT = Object.freeze({} as any);
export const IndexedDBContext = createContext<IndexedDBPContextValues>(
  EMPTY_INDEXED_DB_CONTEXT
);

export function IndexedDBProvider({ children }: PropsWithChildren<{}>) {
  const [loading, setLoading] = useState(true);
  const [value] = useState<IndexedDBPContextValues>(() => ({
    db: new Dexie("AppDB"),
  }));

  useOnMount(() => {
    setLoading(true);
    const { db } = value;

    // fast refresh make this hook runs again. reopen connection
    if (db.isOpen()) {
      db.close();
    }
    migrate(db).then(() => {
      setLoading(false);
    });
  });

  return (
    <IndexedDBContext.Provider value={value}>
      {/*TODO: add proper loading screen*/}
      {loading ? <div>Loading...</div> : children}
    </IndexedDBContext.Provider>
  );
}

export function useIndexedDB() {
  const contextValue = useContext(IndexedDBContext);

  if (!__PRODUCTION__) {
    if (contextValue === EMPTY_INDEXED_DB_CONTEXT) {
      throw new Error(
        "could not find IndexedDB context value; please ensure the component is wrapped in a <IndexedDBProvider>"
      );
    }
  }

  return contextValue;
}
