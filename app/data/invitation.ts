export type Invitation = {
  childName: string;
  classroom: string;
  initial: string;
  avatar: { bg: string; color: string };
  code: string;
  email: string;
};

export const invitation: Invitation = {
  childName: "Mateo",
  classroom: "Sala Soles",
  initial: "M",
  avatar: { bg: "#A9D9E8", color: "#1F7A93" },
  code: "7K4P9",
  email: "lucia.fernandez@gmail.com",
};
