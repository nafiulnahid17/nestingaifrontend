import { renderToString } from "react-dom/server";
import { App } from "./main";

export function renderHome() {
  return renderToString(<App />);
}
