export type PostTipo = "achievement" | "activity" | "announcement";

export type Post = {
  id: string;
  type: PostTipo;
  author: string;
  avatarInitial?: string;
  postedTime: string;
  postedBy: string;
  recipients: string;
  content: string;
  photo?: { caption: string };
  likes: number;
  comments: number;
};

export type PostCardProps = { post: Post };

export const currentUser = {
  initial: "C",
  name: "Caro Giménez",
  role: "Maestra · Soles",
};

export const classroom = {
  name: "Sala Soles",
  childCount: 12,
  date: "martes 17 jun",
};

export const posts: Post[] = [
  {
    id: "1",
    type: "achievement",
    author: "Mateo",
    avatarInitial: "M",
    postedTime: "14:20",
    postedBy: "publicado por vos",
    recipients: "familia de Mateo",
    content:
      "¡Usó el orinal solito por primera vez! Estaba feliz de contárselo a todos. Un gran paso.",
    likes: 3,
    comments: 1,
  },
  {
    id: "2",
    type: "activity",
    author: "Mateo",
    avatarInitial: "M",
    postedTime: "09:40",
    postedBy: "publicado por vos",
    recipients: "familia de Mateo",
    content:
      "Pintamos con témperas esta mañana. Mateo eligió el azul para todo y se concentró un montón mezclando colores.",
    photo: { caption: "Foto · pintando con témperas" },
    likes: 5,
    comments: 2,
  },
  {
    id: "3",
    type: "announcement",
    author: "Anuncio general",
    postedTime: "07:50",
    postedBy: "publicado por vos",
    recipients: "toda la sala",
    content:
      "El viernes salimos al parque por la mañana. Recuerden mandar gorra y una botellita de agua.",
    likes: 8,
    comments: 0,
  },
];

export const typeLabel: Record<PostTipo, string> = {
  achievement: "LOGRO",
  activity: "ACTIVIDAD",
  announcement: "ANUNCIO",
};
