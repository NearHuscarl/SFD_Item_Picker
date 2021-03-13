# [SFD Profile Editor](https://profile-editor.vercel.app)

## Introduction

An internal tool I created to generate C# code for my game script when editing the user profile in [SFD](http://mythologicinteractive.com/SuperfightersDeluxe)

## Project Structure

```
/actions??
  |__ Action and Selector wrappers for to access the redux store
/data
  |__ IndexedDB CRUD and related helpers
/helpers
  |__ Utility pure methods that can be used anywhere (think Service)
/migrations
  |__ Migration scripts to update the database based on the current version
/pages
  |__ React page components and any other components that are page-dependent
/providers
  |__ Settings that can be accessed across different components (think DI)
/store
  /ducks
  | |__ slice definitions which will be combined to create the final store state
  |__ redux methods to initialize, persist store
/types
  |__ General type definitions
/widgets
  |__ Shared React components
```

* IndexedDB: Used to store the app data (player clothes, color palette, color values)
* Redux Store + Local Storage: Used to store user settings

