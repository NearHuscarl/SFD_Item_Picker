import { createContext, PropsWithChildren, useContext, useState } from "react";
import Dexie from "dexie";
import throttle from "lodash/throttle";
import { __PRODUCTION__ } from "app/constants";
import { migrate } from "app/migrations";
import { useOnMount } from "app/helpers/hooks";
import { useSnackbar } from "notistack";
import { ProgressSnackbar } from "app/widgets/ProgressSnackbar";
import { useDispatch } from "react-redux";
import { globalActions } from "app/store/rootDuck";

type IndexedDBPContextValues = {
  db: Dexie;
  isLoadingDB: boolean;
};

const EMPTY_INDEXED_DB_CONTEXT = Object.freeze({} as any);
export const IndexedDBContext = createContext<IndexedDBPContextValues>(
  EMPTY_INDEXED_DB_CONTEXT
);

export function IndexedDBProvider({ children }: PropsWithChildren<{}>) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [value, setValue] = useState<IndexedDBPContextValues>(() => ({
    db: new Dexie("AppDB"),
    isLoadingDB: true,
  }));
  const dispatch = useDispatch();

  useOnMount(() => {
    setValue((state) => ({ ...state, isLoadingDB: true }));

    const { db } = value;
    const onMigrate = (version) => {
      enqueueSnackbar(`Update IndexedDB version ${version}`, {
        key: "indexed-db-progress",
        preventDuplicate: true,
        persist: true,
        content: (key, message) => (
          <ProgressSnackbar id={key} title={message} />
        ),
      });
    };
    const onProgress = throttle((message, progress) => {
      dispatch(globalActions.setIndexedDBProgress({ message, progress }));
    }, 115);

    // onMigrate(1);

    // fast refresh make this hook runs again. reopen connection
    if (db.isOpen()) {
      db.close();
    }
    migrate(db, { onMigrate, onProgress }).then(() => {
      setValue((state) => ({ ...state, isLoadingDB: false }));
      closeSnackbar("indexed-db-progress");
    });
  });

  return (
    <IndexedDBContext.Provider value={value}>
      {children}
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
