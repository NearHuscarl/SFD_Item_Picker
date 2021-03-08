import { ProfileSettings } from "app/types";
import { isArrayEqual } from "app/helpers/index";

export function isProfileEqual(
  profile1: ProfileSettings,
  profile2: ProfileSettings
) {
  return (
    profile1.name === profile2.name &&
    profile1.gender === profile2.gender &&
    profile1.skin.id === profile2.skin.id &&
    isArrayEqual(profile1.skin.colors, profile2.skin.colors) &&
    profile1.chestUnder.id === profile2.chestUnder.id &&
    isArrayEqual(profile1.chestUnder.colors, profile2.chestUnder.colors) &&
    profile1.legs.id === profile2.legs.id &&
    isArrayEqual(profile1.legs.colors, profile2.legs.colors) &&
    profile1.waist.id === profile2.waist.id &&
    isArrayEqual(profile1.waist.colors, profile2.waist.colors) &&
    profile1.feet.id === profile2.feet.id &&
    isArrayEqual(profile1.feet.colors, profile2.feet.colors) &&
    profile1.chestOver.id === profile2.chestOver.id &&
    isArrayEqual(profile1.chestOver.colors, profile2.chestOver.colors) &&
    profile1.accessory.id === profile2.accessory.id &&
    isArrayEqual(profile1.accessory.colors, profile2.accessory.colors) &&
    profile1.hands.id === profile2.hands.id &&
    isArrayEqual(profile1.hands.colors, profile2.hands.colors) &&
    profile1.head.id === profile2.head.id &&
    isArrayEqual(profile1.head.colors, profile2.head.colors)
  );
}
