import { useEffect, useState } from "react";
import { useSelector } from "app/store/reduxHooks";
import { fillTemplate, getTemplate, TemplateName } from "app/helpers/template";

export function useTemplate(name: TemplateName) {
  const [template, _setTemplate] = useState("");
  const settings = useSelector((state) => state.profile.current);
  const setTemplate = (template) =>
    _setTemplate(fillTemplate(template, settings));

  useEffect(() => {
    getTemplate(name).then(setTemplate);
  }, [settings]);

  return [template, setTemplate] as const;
}
