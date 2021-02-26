import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fillTemplate } from "app/helpers/template";
import { ProfileSettings } from "app/types";

function fillTemplateAsync(template: string, settings: ProfileSettings) {
  return new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      resolve(fillTemplate(template, settings));
    });
  });
}

export function useTemplate() {
  const [code, _setCode] = useState("");
  const settings = useSelector((state) => state.profile.current);
  const templateIProfile = useSelector(
    (state) => state.settings.template.IProfile
  );
  const setCode = (template) => {
    fillTemplateAsync(template, settings).then((result) => _setCode(result));
  };

  useEffect(() => {
    setCode(templateIProfile);
  }, [settings]);

  return [code, setCode] as const;
}
