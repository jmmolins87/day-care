export type GuardianStatus = "active" | "pending";

export type Guardian = {
  initial: string;
  name: string;
  relation: string;
  status: GuardianStatus;
};

export type ChildBadge = { label: string; bg: string; color: string };

export type Child = {
  slug: string;
  initial: string;
  name: string;
  ageLabel: string;
  parentSummary: string;
  badge?: ChildBadge;
  avatar: { bg: string; color: string };
  profile: {
    subtitle: string;
    allergies?: { text: string };
    birthDate: string;
    classroom: string;
    enrollment: string;
    guardians: Guardian[];
  };
};

export const guardianStatusLabel: Record<GuardianStatus, string> = {
  active: "ACTIVA",
  pending: "PENDIENTE",
};

export const children: Child[] = [
  {
    slug: "mateo-fernandez",
    initial: "M",
    name: "Mateo Fernández",
    ageLabel: "3 años",
    parentSummary: "2 padres vinculados",
    badge: { label: "MANÍ", bg: "#FBD8CC", color: "#D9684A" },
    avatar: { bg: "#A9D9E8", color: "#1F7A93" },
    profile: {
      subtitle: "3 años · Sala Soles",
      allergies: {
        text: "Alergia al maní. Evitar frutos secos. Lleva inhalador en la mochila.",
      },
      birthDate: "12 mar 2022",
      classroom: "Soles",
      enrollment: "feb 2025",
      guardians: [
        {
          initial: "L",
          name: "Lucía Fernández",
          relation: "Mamá · activa",
          status: "active",
        },
        {
          initial: "D",
          name: "Diego Fernández",
          relation: "Papá · invitación enviada",
          status: "pending",
        },
      ],
    },
  },
  {
    slug: "sofia-mendez",
    initial: "S",
    name: "Sofía Méndez",
    ageLabel: "2 años",
    parentSummary: "1 padre vinculado",
    avatar: { bg: "#F4B8CC", color: "#C44A7A" },
    profile: {
      subtitle: "2 años · Sala Soles",
      birthDate: "5 ago 2023",
      classroom: "Soles",
      enrollment: "ene 2025",
      guardians: [
        {
          initial: "A",
          name: "Ana Méndez",
          relation: "Mamá · activa",
          status: "active",
        },
      ],
    },
  },
  {
    slug: "benjamin-ruiz",
    initial: "B",
    name: "Benjamín Ruiz",
    ageLabel: "3 años",
    parentSummary: "2 padres vinculados",
    avatar: { bg: "#B9DEC4", color: "#3E8B62" },
    profile: {
      subtitle: "3 años · Sala Soles",
      birthDate: "18 ene 2022",
      classroom: "Soles",
      enrollment: "mar 2025",
      guardians: [
        {
          initial: "P",
          name: "Paula Ruiz",
          relation: "Mamá · activa",
          status: "active",
        },
        {
          initial: "R",
          name: "Roberto Ruiz",
          relation: "Papá · activo",
          status: "active",
        },
      ],
    },
  },
  {
    slug: "valentina-soto",
    initial: "V",
    name: "Valentina Soto",
    ageLabel: "2 años",
    parentSummary: "sin padres vinculados",
    badge: { label: "VINCULAR", bg: "#F9D2DE", color: "#C56486" },
    avatar: { bg: "#F4DC8E", color: "#9A7B1E" },
    profile: {
      subtitle: "2 años · Sala Soles",
      birthDate: "30 abr 2024",
      classroom: "Soles",
      enrollment: "jun 2025",
      guardians: [],
    },
  },
  {
    slug: "tomas-diaz",
    initial: "T",
    name: "Tomás Díaz",
    ageLabel: "3 años",
    parentSummary: "1 padre vinculado",
    badge: { label: "LACTOSA", bg: "#FBD8CC", color: "#D9684A" },
    avatar: { bg: "#C9B6E8", color: "#7B5FC0" },
    profile: {
      subtitle: "3 años · Sala Soles",
      birthDate: "7 sep 2022",
      classroom: "Soles",
      enrollment: "abr 2025",
      guardians: [
        {
          initial: "M",
          name: "Marcela Díaz",
          relation: "Mamá · activa",
          status: "active",
        },
      ],
    },
  },
  {
    slug: "emma-castro",
    initial: "E",
    name: "Emma Castro",
    ageLabel: "2 años",
    parentSummary: "1 padre vinculado",
    avatar: { bg: "#F4B8CC", color: "#C44A7A" },
    profile: {
      subtitle: "2 años · Sala Soles",
      birthDate: "14 dic 2023",
      classroom: "Soles",
      enrollment: "feb 2025",
      guardians: [
        {
          initial: "J",
          name: "Julieta Castro",
          relation: "Mamá · activa",
          status: "active",
        },
      ],
    },
  },
  {
    slug: "lucas-romero",
    initial: "L",
    name: "Lucas Romero",
    ageLabel: "3 años",
    parentSummary: "1 padre vinculado",
    avatar: { bg: "#A9D9E8", color: "#1F7A93" },
    profile: {
      subtitle: "3 años · Sala Soles",
      birthDate: "22 jul 2022",
      classroom: "Soles",
      enrollment: "ene 2025",
      guardians: [
        {
          initial: "G",
          name: "Gustavo Romero",
          relation: "Papá · activo",
          status: "active",
        },
      ],
    },
  },
  {
    slug: "olivia-vega",
    initial: "O",
    name: "Olivia Vega",
    ageLabel: "2 años",
    parentSummary: "1 padre vinculado",
    avatar: { bg: "#B9DEC4", color: "#3E8B62" },
    profile: {
      subtitle: "2 años · Sala Soles",
      birthDate: "9 nov 2023",
      classroom: "Soles",
      enrollment: "mar 2025",
      guardians: [
        {
          initial: "C",
          name: "Camila Vega",
          relation: "Mamá · activa",
          status: "active",
        },
      ],
    },
  },
];
