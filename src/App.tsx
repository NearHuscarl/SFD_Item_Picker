import React from "react";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "app/store/store";
import { HomePage } from "app/pages/home";
import { ThemeProvider } from "app/providers/ThemeProvider";
import { IndexedDBProvider } from "app/providers/IndexedDBProvider";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider>
            <IndexedDBProvider>
              <HomePage />
            </IndexedDBProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </div>
  );
}

export default App;
