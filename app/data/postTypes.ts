export type PostTypeKey =
  | "food"
  | "nap"
  | "activity"
  | "achievement"
  | "mood"
  | "photo"
  | "announcement";

export type PostType = {
  key: PostTypeKey;
  label: string;
  soft: { bg: string; color: string };
  solid: string;
};

export const postTypes: PostType[] = [
  { key: "food", label: "Comida", soft: { bg: "#F4DC8E", color: "#9A7B1E" }, solid: "#9A7B1E" },
  { key: "nap", label: "Siesta", soft: { bg: "#E7DCF6", color: "#7B5FC0" }, solid: "#7B5FC0" },
  { key: "activity", label: "Actividad", soft: { bg: "#C7E7F1", color: "#2E89A6" }, solid: "#2E89A6" },
  { key: "achievement", label: "Logro", soft: { bg: "#CFEBD8", color: "#3E9B6C" }, solid: "#3E9B6C" },
  { key: "mood", label: "Ánimo", soft: { bg: "#F9D2DE", color: "#C56486" }, solid: "#C56486" },
  { key: "photo", label: "Foto", soft: { bg: "#FBD8CC", color: "#D9684A" }, solid: "#D9684A" },
  { key: "announcement", label: "Anuncio", soft: { bg: "#CCD8F4", color: "#4E72C8" }, solid: "#4E72C8" },
];
