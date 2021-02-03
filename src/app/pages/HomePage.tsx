import { Button } from "@material-ui/core";
import { Item } from "app/widgets/ItemPart";
import { useEffect } from "react";

export function HomePage() {
  return (
    <div>
      <img
        src="SFD/Items/Skin/Normal/Normal_0_0.png"
        width={16}
        height={16}
        style={{ width: 100, height: 100, imageRendering: "pixelated" }}
      />
      <Item layer="Accessory" id={"one"} />
      <Button>Test</Button>
    </div>
  );
}
