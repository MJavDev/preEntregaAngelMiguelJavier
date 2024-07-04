import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);// nos da la ruta desde donde se esta haciendo el import
const __dirname = path.dirname(__filename);

export default __dirname;