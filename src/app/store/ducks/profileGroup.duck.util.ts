import { ProfileCardInfo, ProfileGroupRecords } from "app/types";

export interface ProfileGroupState {
  entities: ProfileGroupRecords;
  selectedProfile: ProfileCardInfo;
}

export function validateProfile(
  state: ProfileGroupState,
  payload: ProfileCardInfo
) {
  const { groupName, profileName } = payload;
  const profiles = state.entities[groupName];

  if (!profiles) {
    throw new Error(`There is no group name '${groupName}' in profile group`);
  }

  if (!profiles[profileName]) {
    throw new Error(
      `There is no profile name '${profileName}' in profile group '${groupName}'`
    );
  }
}

export const defaultProfileGroup: ProfileGroupRecords = {
  None: {},
  Default: {
    one: {
      name: "one",
      gender: 0,
      skin: {
        id: "Normal",
        colors: ["Skin3", null, null],
      },
      chestUnder: {
        id: "SleevelessShirt",
        colors: [null, null, null],
      },
      legs: {
        id: "PantsBlack",
        colors: ["ClothingPurple", null, null],
      },
      waist: {
        id: "None",
        colors: [null, null, null],
      },
      feet: {
        id: "ShoesBlack",
        colors: ["ClothingBrown", null, null],
      },
      chestOver: {
        id: "Coat",
        colors: ["ClothingLightBlue", "ClothingYellow", null],
      },
      accessory: {
        id: "None",
        colors: [null, null, null],
      },
      hands: {
        id: "None",
        colors: [null, null, null],
      },
      head: {
        id: "None",
        colors: [null, null, null],
      },
    },
    two: {
      name: "two",
      gender: 0,
      skin: {
        id: "Warpaint",
        colors: ["Skin4", "ClothingLightCyan", null],
      },
      chestUnder: {
        id: "MilitaryShirt",
        colors: ["ClothingDarkCyan", "ClothingRed", null],
      },
      legs: {
        id: "Pants",
        colors: ["ClothingBrown", null, null],
      },
      waist: {
        id: "Sash",
        colors: ["ClothingDarkBlue", null, null],
      },
      feet: {
        id: "Boots",
        colors: ["ClothingLightRed", null, null],
      },
      chestOver: {
        id: "MilitaryJacket",
        colors: ["ClothingDarkYellow", "ClothingLightGreen", null],
      },
      accessory: {
        id: "Vizor",
        colors: ["ClothingCyan", "ClothingLightBrown", null],
      },
      hands: {
        id: "FingerlessGloves",
        colors: ["ClothingGreen", null, null],
      },
      head: {
        id: "FLDisguise",
        colors: ["ClothingCyan", "ClothingLightBrown", null],
      },
    },
    three: {
      name: "three",
      gender: 0,
      skin: {
        id: "Zombie",
        colors: [null, null, null],
      },
      chestUnder: {
        id: "LeatherJacketBlack",
        colors: ["ClothingDarkGray", "ClothingBrown", null],
      },
      legs: {
        id: "TornPants",
        colors: ["ClothingRed", null, null],
      },
      waist: {
        id: "Belt",
        colors: ["ClothingBrown", "ClothingDarkGreen", null],
      },
      feet: {
        id: "BootsBlack",
        colors: ["ClothingDarkOrange", null, null],
      },
      chestOver: {
        id: "SuitJacket",
        colors: ["ClothingCyan", null, null],
      },
      accessory: {
        id: "GasMask",
        colors: ["ClothingGray", "ClothingLightPurple", null],
      },
      hands: {
        id: "SafetyGlovesBlack",
        colors: ["ClothingPink", null, null],
      },
      head: {
        id: "RiceHat",
        colors: [null, null, null],
      },
    },
    four: {
      name: "four",
      gender: 0,
      skin: {
        id: "Normal",
        colors: ["Skin2", "ClothingLightYellow", null],
      },
      chestUnder: {
        id: "SleevelessShirtBlack",
        colors: ["ClothingDarkBlue", null, null],
      },
      legs: {
        id: "None",
        colors: [null, null, null],
      },
      waist: {
        id: "Sash",
        colors: ["ClothingLightOrange", null, null],
      },
      feet: {
        id: "Shoes",
        colors: ["ClothingLightGreen", null, null],
      },
      chestOver: {
        id: "Poncho2",
        colors: ["ClothingLightBrown", "ClothingRed", null],
      },
      accessory: {
        id: "GasMask",
        colors: ["ClothingBlue", "ClothingLightGray", null],
      },
      hands: {
        id: "SafetyGlovesBlack",
        colors: ["ClothingLightBlue", null, null],
      },
      head: {
        id: "SergeantHat",
        colors: ["ClothingDarkRed", "ClothingDarkGreen", null],
      },
    },
    five: {
      name: "five",
      gender: 0,
      skin: {
        id: "Normal",
        colors: ["Skin1", "ClothingLightPurple", null],
      },
      chestUnder: {
        id: "SleevelessShirt",
        colors: ["ClothingDarkBrown", null, null],
      },
      legs: {
        id: "None",
        colors: [null, null, null],
      },
      waist: {
        id: "SatchelBelt",
        colors: ["ClothingDarkBlue", null, null],
      },
      feet: {
        id: "None",
        colors: [null, null, null],
      },
      chestOver: {
        id: "BlazerWithShirt",
        colors: ["ClothingLightPink", "ClothingLightPurple", null],
      },
      accessory: {
        id: "ClownMakeup",
        colors: ["ClothingDarkRed", null, null],
      },
      hands: {
        id: "FingerlessGloves",
        colors: ["ClothingLightGreen", null, null],
      },
      head: {
        id: "Sombrero2",
        colors: ["ClothingLightRed", null, null],
      },
    },
    six: {
      name: "six",
      gender: 0,
      skin: {
        id: "Zombie",
        colors: [null, null, null],
      },
      chestUnder: {
        id: "ShirtWithBowtie",
        colors: ["ClothingRed", "ClothingDarkCyan", null],
      },
      legs: {
        id: "None",
        colors: [null, null, null],
      },
      waist: {
        id: "Belt",
        colors: ["ClothingYellow", "ClothingBlue", null],
      },
      feet: {
        id: "None",
        colors: [null, null, null],
      },
      chestOver: {
        id: "AmmoBelt",
        colors: ["ClothingGray", null, null],
      },
      accessory: {
        id: "DominoMask",
        colors: [null, "ClothingDarkOrange", null],
      },
      hands: {
        id: "FingerlessGlovesBlack",
        colors: ["ClothingLightBrown", null, null],
      },
      head: {
        id: "Sombrero2",
        colors: ["ClothingPurple", null, null],
      },
    },
    seven: {
      name: "seven",
      gender: 0,
      skin: {
        id: "Normal",
        colors: ["Skin1", "ClothingDarkCyan", null],
      },
      chestUnder: {
        id: "BodyArmor",
        colors: ["ClothingDarkPurple", null, null],
      },
      legs: {
        id: "Skirt",
        colors: ["ClothingDarkPink", null, null],
      },
      waist: {
        id: "SatchelBelt",
        colors: ["ClothingYellow", null, null],
      },
      feet: {
        id: "BootsBlack",
        colors: ["ClothingOrange", null, null],
      },
      chestOver: {
        id: "KevlarVest",
        colors: ["ClothingDarkRed", null, null],
      },
      accessory: {
        id: "Mask",
        colors: ["ClothingLightYellow", null, null],
      },
      hands: {
        id: "None",
        colors: [null, null, null],
      },
      head: {
        id: "WeldingHelmet",
        colors: ["ClothingLightBrown", null, null],
      },
    },
    eight: {
      name: "eight",
      gender: 0,
      skin: {
        id: "Warpaint",
        colors: ["Skin2", "ClothingLightCyan", null],
      },
      chestUnder: {
        id: "UnbuttonedShirt",
        colors: ["ClothingGreen", null, null],
      },
      legs: {
        id: "Shorts",
        colors: ["ClothingDarkPurple", null, null],
      },
      waist: {
        id: "SatchelBelt",
        colors: ["ClothingYellow", null, null],
      },
      feet: {
        id: "BootsBlack",
        colors: ["ClothingLightBlue", null, null],
      },
      chestOver: {
        id: "AmmoBelt",
        colors: ["ClothingDarkCyan", null, null],
      },
      accessory: {
        id: "AgentSunglasses",
        colors: [null, "ClothingLightGreen", null],
      },
      hands: {
        id: "FingerlessGlovesBlack",
        colors: ["ClothingLightGreen", null, null],
      },
      head: {
        id: "Flatcap",
        colors: ["ClothingDarkPurple", null, null],
      },
    },
    nine: {
      name: "nine",
      gender: 0,
      skin: {
        id: "Tattoos",
        colors: ["Skin2", "ClothingLightCyan", null],
      },
      chestUnder: {
        id: "SweaterBlack",
        colors: ["ClothingYellow", null, null],
      },
      legs: {
        id: "PantsBlack",
        colors: ["ClothingDarkGray", null, null],
      },
      waist: {
        id: "SatchelBelt",
        colors: ["ClothingOrange", null, null],
      },
      feet: {
        id: "HighHeels",
        colors: ["ClothingLightCyan", null, null],
      },
      chestOver: {
        id: "StripedSuitJacket",
        colors: ["ClothingLightOrange", null, null],
      },
      accessory: {
        id: "StuddedLeatherMask",
        colors: ["ClothingDarkGreen", null, null],
      },
      hands: {
        id: "SafetyGloves",
        colors: ["ClothingBlue", null, null],
      },
      head: {
        id: "PithHelmet",
        colors: ["ClothingDarkPurple", "ClothingDarkPurple", null],
      },
    },
    ten: {
      name: "ten",
      gender: 0,
      skin: {
        id: "Warpaint",
        colors: ["Skin4", "ClothingPurple", null],
      },
      chestUnder: {
        id: "None",
        colors: [null, null, null],
      },
      legs: {
        id: "StripedPants",
        colors: ["ClothingDarkPurple", null, null],
      },
      waist: {
        id: "CombatBelt",
        colors: ["ClothingDarkOrange", null, null],
      },
      feet: {
        id: "RidingBoots",
        colors: ["ClothingLightBlue", null, null],
      },
      chestOver: {
        id: "SuitJacketBlack",
        colors: ["ClothingDarkBlue", null, null],
      },
      accessory: {
        id: "StuddedLeatherMask",
        colors: ["ClothingDarkPurple", null, null],
      },
      hands: {
        id: "None",
        colors: [null, null, null],
      },
      head: {
        id: "Flatcap",
        colors: ["ClothingLightBrown", null, null],
      },
    },
    eleven: {
      name: "eleven",
      gender: 0,
      skin: {
        id: "Tattoos",
        colors: ["Skin5", "ClothingRed", null],
      },
      chestUnder: {
        id: "SleevelessShirtBlack",
        colors: ["ClothingGray", null, null],
      },
      legs: {
        id: "TornPants",
        colors: ["ClothingDarkPink", null, null],
      },
      waist: {
        id: "SmallBelt",
        colors: ["ClothingDarkBlue", "ClothingDarkYellow", null],
      },
      feet: {
        id: "RidingBootsBlack",
        colors: ["ClothingBlue", null, null],
      },
      chestOver: {
        id: "Poncho",
        colors: ["ClothingGreen", "ClothingDarkGreen", null],
      },
      accessory: {
        id: "DogTag",
        colors: [null, null, null],
      },
      hands: {
        id: "FingerlessGloves",
        colors: ["ClothingLightGreen", null, null],
      },
      head: {
        id: "FLDisguise",
        colors: ["ClothingLightGreen", "ClothingLightGreen", null],
      },
    },
    twelve: {
      name: "twelve",
      gender: 0,
      skin: {
        id: "Zombie",
        colors: [null, null, null],
      },
      chestUnder: {
        id: "PoliceShirt",
        colors: ["ClothingLightPurple", null, null],
      },
      legs: {
        id: "CamoPants",
        colors: ["ClothingCyan", "ClothingLightPurple", null],
      },
      waist: {
        id: "AmmoBeltWaist",
        colors: ["ClothingDarkOrange", null, null],
      },
      feet: {
        id: "BootsBlack",
        colors: ["ClothingDarkYellow", null, null],
      },
      chestOver: {
        id: "Robe",
        colors: ["ClothingDarkYellow", null, null],
      },
      accessory: {
        id: "Mask",
        colors: ["ClothingLightBrown", null, null],
      },
      hands: {
        id: "GlovesBlack",
        colors: ["ClothingRed", null, null],
      },
      head: {
        id: "WeldingHelmet",
        colors: ["ClothingPink", null, null],
      },
    },
  },
  MyGroup: {
    group1: {
      name: "group1",
      gender: 0,
      skin: {
        id: "Normal",
        colors: ["Skin2", "ClothingDarkYellow", null],
      },
      chestUnder: {
        id: "UnbuttonedShirt",
        colors: ["ClothingLightPink", null, null],
      },
      legs: {
        id: "Skirt",
        colors: ["ClothingYellow", null, null],
      },
      waist: {
        id: "SmallBelt",
        colors: ["ClothingLightPink", "ClothingLightRed", null],
      },
      feet: {
        id: "RidingBootsBlack",
        colors: ["ClothingLightPurple", null, null],
      },
      chestOver: {
        id: "Poncho2",
        colors: ["ClothingLightGray", "ClothingBrown", null],
      },
      accessory: {
        id: "Earpiece",
        colors: [null, null, null],
      },
      hands: {
        id: "GlovesBlack",
        colors: ["ClothingDarkPink", null, null],
      },
      head: {
        id: "None",
        colors: [null, null, null],
      },
    },
    group2: {
      name: "group2",
      gender: 0,
      skin: {
        id: "Warpaint",
        colors: ["Skin5", "ClothingDarkGray", null],
      },
      chestUnder: {
        id: "SweaterBlack",
        colors: ["ClothingOrange", null, null],
      },
      legs: {
        id: "CamoPants",
        colors: ["ClothingDarkPurple", "ClothingLightBrown", null],
      },
      waist: {
        id: "None",
        colors: [null, null, null],
      },
      feet: {
        id: "HighHeels",
        colors: ["ClothingCyan", null, null],
      },
      chestOver: {
        id: "GrenadeBelt",
        colors: [null, null, null],
      },
      accessory: {
        id: "GoalieMask",
        colors: [null, null, null],
      },
      hands: {
        id: "FingerlessGloves",
        colors: ["ClothingDarkBlue", null, null],
      },
      head: {
        id: "Helmet2",
        colors: ["ClothingLightBlue", null, null],
      },
    },
    group3: {
      name: "group3",
      gender: 0,
      skin: {
        id: "Tattoos",
        colors: ["Skin1", "ClothingDarkCyan", null],
      },
      chestUnder: {
        id: "LeatherJacket",
        colors: ["ClothingLightGreen", "ClothingCyan", null],
      },
      legs: {
        id: "None",
        colors: [null, null, null],
      },
      waist: {
        id: "SatchelBelt",
        colors: ["ClothingDarkRed", null, null],
      },
      feet: {
        id: "ShoesBlack",
        colors: ["ClothingDarkBrown", null, null],
      },
      chestOver: {
        id: "MetroLawJacket",
        colors: ["ClothingGreen", "ClothingDarkYellow", null],
      },
      accessory: {
        id: "SmallMoustache",
        colors: ["ClothingOrange", null, null],
      },
      hands: {
        id: "FingerlessGlovesBlack",
        colors: ["ClothingDarkBrown", null, null],
      },
      head: {
        id: "Mohawk",
        colors: ["ClothingDarkYellow", null, null],
      },
    },
  },
  Abc: {
    sf1: {
      name: "sf1",
      gender: 0,
      skin: {
        id: "Normal",
        colors: ["Skin1", "ClothingBrown", null],
      },
      chestUnder: {
        id: "Sweater",
        colors: ["ClothingCyan", null, null],
      },
      legs: {
        id: "TornPants",
        colors: ["ClothingGray", null, null],
      },
      waist: {
        id: "None",
        colors: [null, null, null],
      },
      feet: {
        id: "None",
        colors: [null, null, null],
      },
      chestOver: {
        id: "Vest",
        colors: ["ClothingDarkPurple", "ClothingDarkPurple", null],
      },
      accessory: {
        id: "GoalieMask",
        colors: [null, null, null],
      },
      hands: {
        id: "SafetyGloves",
        colors: ["ClothingYellow", null, null],
      },
      head: {
        id: "Mohawk",
        colors: ["ClothingDarkBrown", null, null],
      },
    },
    sf2: {
      name: "sf2",
      gender: 0,
      skin: {
        id: "Warpaint",
        colors: ["Skin3", "ClothingPink", null],
      },
      chestUnder: {
        id: "None",
        colors: [null, null, null],
      },
      legs: {
        id: "CamoPants",
        colors: ["ClothingDarkGreen", "ClothingGreen", null],
      },
      waist: {
        id: "SmallBelt",
        colors: ["ClothingCyan", "ClothingYellow", null],
      },
      feet: {
        id: "ShoesBlack",
        colors: ["ClothingLightBrown", null, null],
      },
      chestOver: {
        id: "AviatorJacket",
        colors: ["ClothingDarkPurple", "ClothingDarkPurple", null],
      },
      accessory: {
        id: "GasMask",
        colors: ["ClothingOrange", "ClothingLightPurple", null],
      },
      hands: {
        id: "Gloves",
        colors: ["ClothingDarkYellow", null, null],
      },
      head: {
        id: "CowboyHat",
        colors: ["ClothingLightPink", "ClothingLightGreen", null],
      },
    },
    sf3: {
      name: "sf3",
      gender: 0,
      skin: {
        id: "Zombie",
        colors: [null, null, null],
      },
      chestUnder: {
        id: "BodyArmor",
        colors: ["ClothingDarkPink", null, null],
      },
      legs: {
        id: "CamoPants",
        colors: ["ClothingDarkRed", "ClothingRed", null],
      },
      waist: {
        id: "SmallBelt",
        colors: ["ClothingDarkRed", "ClothingLightPurple", null],
      },
      feet: {
        id: "RidingBoots",
        colors: ["ClothingDarkYellow", null, null],
      },
      chestOver: {
        id: "SuitJacket",
        colors: ["ClothingGreen", null, null],
      },
      accessory: {
        id: "Vizor",
        colors: ["ClothingCyan", "ClothingLightPurple", null],
      },
      hands: {
        id: "FingerlessGlovesBlack",
        colors: ["ClothingBrown", null, null],
      },
      head: {
        id: "Sombrero",
        colors: ["ClothingRed", null, null],
      },
    },
    sf4: {
      name: "sf4",
      gender: 0,
      skin: {
        id: "Tattoos",
        colors: ["Skin5", "ClothingPurple", null],
      },
      chestUnder: {
        id: "StuddedLeatherSuit",
        colors: ["ClothingRed", null, null],
      },
      legs: {
        id: "PantsBlack",
        colors: ["ClothingPurple", null, null],
      },
      waist: {
        id: "SatchelBelt",
        colors: ["ClothingGreen", null, null],
      },
      feet: {
        id: "None",
        colors: [null, null, null],
      },
      chestOver: {
        id: "SuitJacketBlack",
        colors: ["ClothingPurple", null, null],
      },
      accessory: {
        id: "Mask",
        colors: ["ClothingLightBlue", null, null],
      },
      hands: {
        id: "Gloves",
        colors: ["ClothingPurple", null, null],
      },
      head: {
        id: "SpikedHelmet",
        colors: ["ClothingLightPurple", null, null],
      },
    },
    sf5: {
      name: "sf5",
      gender: 0,
      skin: {
        id: "Zombie",
        colors: [null, null, null],
      },
      chestUnder: {
        id: "TrainingShirt",
        colors: ["ClothingLightBrown", null, null],
      },
      legs: {
        id: "Pants",
        colors: ["ClothingLightGreen", null, null],
      },
      waist: {
        id: "AmmoBeltWaist",
        colors: ["ClothingDarkCyan", null, null],
      },
      feet: {
        id: "Boots",
        colors: ["ClothingLightYellow", null, null],
      },
      chestOver: {
        id: "StripedSuitJacket",
        colors: ["ClothingDarkYellow", null, null],
      },
      accessory: {
        id: "GasMask",
        colors: ["ClothingDarkBlue", "ClothingLightGreen", null],
      },
      hands: {
        id: "FingerlessGloves",
        colors: ["ClothingLightGreen", null, null],
      },
      head: {
        id: "HazmatMask",
        colors: ["ClothingRed", "ClothingBrown", null],
      },
    },
  },
  Def: {
    def1: {
      name: "def1",
      gender: 0,
      skin: {
        id: "Zombie",
        colors: [null, null, null],
      },
      chestUnder: {
        id: "TrainingShirt",
        colors: ["ClothingDarkYellow", null, null],
      },
      legs: {
        id: "Skirt",
        colors: ["ClothingDarkOrange", null, null],
      },
      waist: {
        id: "SatchelBelt",
        colors: ["ClothingCyan", null, null],
      },
      feet: {
        id: "RidingBootsBlack",
        colors: ["ClothingCyan", null, null],
      },
      chestOver: {
        id: "VestBlack",
        colors: ["ClothingPink", "ClothingDarkBrown", null],
      },
      accessory: {
        id: "SantaMask",
        colors: [null, null, null],
      },
      hands: {
        id: "GlovesBlack",
        colors: ["ClothingYellow", null, null],
      },
      head: {
        id: "BaseballCap",
        colors: ["ClothingLightCyan", "ClothingDarkYellow", null],
      },
    },
    def2: {
      name: "def2",
      gender: 0,
      skin: {
        id: "Warpaint",
        colors: ["Skin3", "ClothingDarkRed", null],
      },
      chestUnder: {
        id: "LeatherJacketBlack",
        colors: ["ClothingDarkOrange", "ClothingPink", null],
      },
      legs: {
        id: "Skirt",
        colors: ["ClothingDarkBlue", null, null],
      },
      waist: {
        id: "None",
        colors: [null, null, null],
      },
      feet: {
        id: "None",
        colors: [null, null, null],
      },
      chestOver: {
        id: "None",
        colors: [null, null, null],
      },
      accessory: {
        id: "StuddedLeatherMask",
        colors: ["ClothingDarkCyan", null, null],
      },
      hands: {
        id: "Gloves",
        colors: ["ClothingOrange", null, null],
      },
      head: {
        id: "Mohawk",
        colors: ["ClothingDarkOrange", null, null],
      },
    },
    def3: {
      name: "def3",
      gender: 0,
      skin: {
        id: "Zombie",
        colors: [null, null, null],
      },
      chestUnder: {
        id: "ShirtWithBowtie",
        colors: ["ClothingLightRed", "ClothingPurple", null],
      },
      legs: {
        id: "ShortsBlack",
        colors: ["ClothingBrown", null, null],
      },
      waist: {
        id: "AmmoBeltWaist",
        colors: ["ClothingGray", null, null],
      },
      feet: {
        id: "RidingBootsBlack",
        colors: ["ClothingLightPink", null, null],
      },
      chestOver: {
        id: "MilitaryJacket",
        colors: ["ClothingGray", "ClothingDarkPurple", null],
      },
      accessory: {
        id: "Moustache",
        colors: ["ClothingDarkOrange", null, null],
      },
      hands: {
        id: "None",
        colors: [null, null, null],
      },
      head: {
        id: "None",
        colors: [null, null, null],
      },
    },
  },
};
