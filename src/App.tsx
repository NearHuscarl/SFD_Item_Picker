import React from "react";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "app/store/store";
import { HomePage } from "app/pages/HomePage";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <HomePage />
        </PersistGate>
      </Provider>
    </div>
  );
}

export default App;
