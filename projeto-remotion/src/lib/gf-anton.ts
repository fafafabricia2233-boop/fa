// Shim offline para @remotion/google-fonts/Anton
import { loadAnton } from "./localFonts";
export const loadFont = (..._args: unknown[]) => loadAnton();
export const getInfo = () => ({ fontFamily: "Anton" });
export default { loadFont, getInfo };
