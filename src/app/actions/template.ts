import { useEffect, useState } from "react";
import { useSelector } from "app/store/reduxHooks";
import { fillTemplate } from "app/helpers/template";

export function useTemplate() {
  const [code, _setCode] = useState("");
  const settings = useSelector((state) => state.profile.current);
  const templateIProfile = useSelector(
    (state) => state.settings.template.IProfile
  );
  const setCode = (template) => _setCode(fillTemplate(template, settings));

  useEffect(() => {
    setCode(templateIProfile);
  }, [settings]);

  return [code, setCode] as const;
}
