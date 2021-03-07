import { Template, TemplateRecords } from "app/types";

const defaultTemplate = `// __LINK__
var profile = new IProfile()
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
    Accesory = new IProfileClothingItem(__ACCESSORY__, __ACCESSORY_PRIMARY__, __ACCESSORY_SECONDARY__, __ACCESSORY_TERTIARY__),
};`;
const iprofileTemplate = `new IProfile()
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
    Accesory = new IProfileClothingItem(__ACCESSORY__, __ACCESSORY_PRIMARY__, __ACCESSORY_SECONDARY__, __ACCESSORY_TERTIARY__),
}`;
const oneLineTemplate = `new IProfile(){Name=__NAME__,Gender=__GENDER__,Skin=new IProfileClothingItem(__SKIN__,__SKIN_PRIMARY__,__SKIN_SECONDARY__,__SKIN_TERTIARY__),Head=new IProfileClothingItem(__HEAD__,__HEAD_PRIMARY__,__HEAD_SECONDARY__,__HEAD_TERTIARY__),ChestOver=new IProfileClothingItem(__CHESTOVER__,__CHESTOVER_PRIMARY__,__CHESTOVER_SECONDARY__,__CHESTOVER_TERTIARY__),ChestUnder=new IProfileClothingItem(__CHESTUNDER__,__CHESTUNDER_PRIMARY__,__CHESTUNDER_SECONDARY__,__CHESTUNDER_TERTIARY__),Hands=new IProfileClothingItem(__HANDS__,__HANDS_PRIMARY__,__HANDS_SECONDARY__,__HANDS_TERTIARY__),Waist=new IProfileClothingItem(__WAIST__,__WAIST_PRIMARY__,__WAIST_SECONDARY__,__WAIST_TERTIARY__),Legs=new IProfileClothingItem(__LEGS__,__LEGS_PRIMARY__,__LEGS_SECONDARY__,__LEGS_TERTIARY__),Feet=new IProfileClothingItem(__FEET__,__FEET_PRIMARY__,__FEET_SECONDARY__,__FEET_TERTIARY__),Accesory=new IProfileClothingItem(__ACCESSORY__,__ACCESSORY_PRIMARY__,__ACCESSORY_SECONDARY__,__ACCESSORY_TERTIARY__),}`;

export const DefaultTemplate: Template = Object.freeze({
  ID: 0,
  name: "Default",
  template: defaultTemplate,
  readonly: true, // default template cannot be deleted
});

export const defaultTemplates: TemplateRecords = {
  [DefaultTemplate.ID]: DefaultTemplate,
  1: {
    ID: 1,
    name: "IProfile",
    template: iprofileTemplate,
  },
  2: {
    ID: 2,
    name: "One Line",
    template: oneLineTemplate,
  },
};
