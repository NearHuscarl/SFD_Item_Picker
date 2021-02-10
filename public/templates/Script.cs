public void OnStartup()
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
