import { MenuMeta } from "../interface";
import ImageFlattenMeta from "./imageFlatten/meta";
import ImageRenameMeta from "./imageRename/meta";

const FileMetas: MenuMeta[] = [
  ImageRenameMeta,
  ImageFlattenMeta
]
export default FileMetas;