// Shim offline para @remotion/google-fonts/Montserrat
import { loadMontserratLocal } from "./localFonts";
export const loadFont = (..._args: unknown[]) => loadMontserratLocal();
export const getInfo = () => ({ fontFamily: "Montserrat" });
export default { loadFont, getInfo };
