export const __DEV__ = process.env.NODE_ENV === "development";
export const __PRODUCTION__ = process.env.NODE_ENV === "production";

export const ItemPartType = {
  Head: 0,
  Body: 1,
  Arm: 2,
  Fist: 3,
  Tail: 4,
} as const;

export const EquipmentLayer = {
  Skin: 0,
  ChestUnder: 1,
  Legs: 2,
  Waist: 3,
  Feet: 4,
  ChestOver: 5,
  Accessory: 6,
  Hands: 7,
  Head: 8,
} as const;
