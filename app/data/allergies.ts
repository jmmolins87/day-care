export type AllergyKey =
  | "mani"
  | "lactosa"
  | "gluten"
  | "frutos_secos"
  | "huevos"
  | "mariscos"
  | "soja"
  | "otro";

export type AllergyDef = {
  label: string;
  bg: string;
  color: string;
};

export const allergies: Record<AllergyKey, AllergyDef> = {
  mani: { label: "CACAHUETE", bg: "#FBD8CC", color: "#D9684A" },
  lactosa: { label: "LACTOSA", bg: "#C7E7F1", color: "#2E89A6" },
  gluten: { label: "GLUTEN", bg: "#CFEBD8", color: "#3E9B6C" },
  frutos_secos: { label: "FRUTOS SECOS", bg: "#F7E7A6", color: "#9A7B1E" },
  huevos: { label: "HUEVOS", bg: "#CCD8F4", color: "#4E72C8" },
  mariscos: { label: "MARISCOS", bg: "#E8D5F5", color: "#8B5FBF" },
  soja: { label: "SOJA", bg: "#D5E8D5", color: "#5A8A5A" },
  otro: { label: "OTRO", bg: "#E0D8D0", color: "#7A6E62" },
};
