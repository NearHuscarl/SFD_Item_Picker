// reason #1001 why I hate Javascript ecosystem
// https://stackoverflow.com/a/46215202/9449426
export function copy(text: string) {
  const input = document.createElement("textarea");
  input.innerHTML = text;
  document.body.appendChild(input);
  input.select();
  const result = document.execCommand("copy");
  document.body.removeChild(input);
  return result;
}
