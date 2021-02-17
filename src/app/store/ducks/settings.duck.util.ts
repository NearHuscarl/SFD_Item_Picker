const IProfile = `new IProfile()
{
    Name = __NAME__,
    Gender = __GENDER__,
    Skin = new IProfileClothingItem(__SKIN__, __SKIN_PRIMARY__, __SKIN_SECONDARY__, __SKIN_TERTIARY__),
    Head = new IProfileClothingItem(__HEAD__, __HEAD_PRIMARY__, __HEAD_SECONDARY__, __HEAD_TERTIARY__),
    ChestOver = new IProfileClothingItem(__CHESTOVER__, __CHESTOVER_PRIMARY__, __CHESTOVER_SECONDARY__, __CHESTOVER_TERTIARY__),
    ChestUnder = new IProfileClothingItem(__CHESTUNDER__, __CHESTUNDER_PRIMARY__, __CHESTUNDER_SECONDARY__, __CHESTUNDER_TERTIARY__),
    Hands = new IProfileClothingItem(__HANDS__, __HANDS_PRIMARY__, __HANDS_SECONDARY__, __HANDS_TERTIARY__),
    Waist = new IProfileClothingItem(__WAIST__, __WAIST_PRIMARY__, __WAIST_SECONDARY__, __WAIST_TERTIARY__),
    Legs = new IProfileClothingItem(__LEGS__, __LEGS_PRIMARY__, __LEGS_SECONDARY__, __LEGS_TERTIARY__),
    Feet = new IProfileClothingItem(__FEET__, __FEET_PRIMARY__, __FEET_SECONDARY__, __FEET_TERTIARY__),
    Accessory = new IProfileClothingItem(__ACCESSORY__, __ACCESSORY_PRIMARY__, __ACCESSORY_SECONDARY__, __ACCESSORY_TERTIARY__),
}`;

const GameScript = `public void OnStartup()
{
    // The game will always call the following method "public void OnStartup()" during a map start (or script activates).
    // No triggers required. This is run before triggers that activate on startup (and before OnStartup triggers).
    Game.ShowPopupMessage("OnStartup is run when the map or script is started.");

    // This is a breakpoint
    // System.Diagnostics.Debugger.Break();
    var firstPlayer = Game.GetPlayers()[0];

    if (firstPlayer != null)
    {
        firstPlayer.SetProfile(__IPROFILE__);
    }
}

public void AfterStartup()
{
    // The game will always call the following method "public void AfterStartup()" after a map start (or script activates).
    // No triggers required. This is run after triggers that activate on startup (and after OnStartup triggers).
}

public void OnShutdown()
{
    // The game will always call the following method "public void OnShutdown()" before a map restart (or script deactivates).
    // Perform some cleanup here or store some final information to Game.Data if needed.
}
`;

export const defaultValue = {
  IProfile,
  GameScript,
};
