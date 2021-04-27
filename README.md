# [SFD Profile Editor](https://profile-editor.vercel.app)

[comment]: <> (![Demo]&#40;&#41;)

## Introduction

**SFD Profile Editor** is a web application to help [SFD] scripters generate profile code for their scripts. Main
features:

* **Generate** the profile code when editing user profile.
* **Create** and **share** profiles without having to open SFD (for non-scripters).
* **Download** the preview image of your profile (png).
* **Manage** your profiles in groups. By default, there are 34 groups and 249 profiles for you to reference.

Before this project is created. Every time I wanted to assign a new profile using the game's ScriptAPI, I had to:

* Open and switch to
  the [`BotProfiles.sdfm`](https://github.com/NearHuscarl/BotExtended/blob/master/templates/BotProfiles.sfdm) map which
  contains all profiles for my particular script.
* Edit the profile in a crappy winform dialog. It's slow, inconvenient and not very interactive
  (you can't preview the item and color before selecting, unlike the profile editor in the game itself).
* Open the 'show script output' window.
* Hit F5 to run the map and execute
  my [converter script](https://github.com/NearHuscarl/BotExtended/blob/master/src/BotExtended.Script/ProfileConverter.cs)
  to generate the C# code.
* Copy that string.
* Go back to the map where I test my script.
* Paste the profile string to my script and hit F5.

One day, I decided that the process of switching between 2 maps every time I want to modify a small piece of profile
code is too cumbersome and affects my metal health, so I made this project.

## Getting Started

### Requirements

In order to use this tool, you'll need the following things:

* A web browser with internet connection: To run the application. I only test this in Chrome, but it should work fine in
  any modern browsers.
* Superfighters Deluxe: To compile your game scripts and play the game.
* Visual Studio (optional): I heavily recommend this IDE to write SFD scripts instead of the beyond awful script editor
  provided in the game.
    * If you use Visual Studio, you have to copy the code in Visual Studio to the game editor to compile and run the
      map. I have written [ScriptLinker] which automate those tasks to ease the development process.

### Usage

Open the application at https://profile-editor.vercel.app.

If you open this for the first time, it'll attempt to load all item textures and store it in Indexed DB. This takes
around 30-45 seconds on my computer.

[comment]: <> (## Workflows)

[comment]: <> (## Terminologies)

[comment]: <> (### SFD)

[comment]: <> (Shorthand for [Superfighters Deluxe]&#40;https://www.youtube.com/watch?v=9YtiRsJWx6w&#41; - an indie game written by 2 Swedish)

[comment]: <> (nerds. This is one of the most fun game I've ever played. I put this game on the same level with other highly)

[comment]: <> (participated game like Rimworld or Factorio. Unfortunately, the game doesn't really take off due to the terrible)

[comment]: <> (priority in marketing)

[comment]: <> (### Profile)

[comment]: <> (### Item)

[comment]: <> (### Layer)

[comment]: <> (### Animation Index)

## Project Structure

```
/actions
  |__ Action and Selector wrappers to access the redux store
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

[SFD]: http://mythologicinteractive.com/SuperfightersDeluxe

[ScriptLinker]: https://github.com/nearhuscarl/scriptlinker


