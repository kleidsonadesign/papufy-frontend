export type JobStatus = "OPEN" | "CLOSED";

export type ListingType = "BICO" | "PRODUTO";
export type ListingStatus = "OPEN" | "CLOSED";

export interface User {
  id: string;
  nome: string;
  email: string;
  telefone?: string | null;
  cidade?: string | null;
  uf?: string | null;
  curriculoUrl?: string | null;
  createdAt?: string;
}

export interface ListingImage {
  id: string;
  url: string;
  ordem: number;
}

export interface Listing {
  id: string;
  userId: string;
  tipo: ListingType;
  titulo: string;
  descricao: string;
  preco: number | null;
  aCombinar: boolean;
  categoria: string;
  status: ListingStatus;
  cep?: string | null;
  cidade: string;
  bairro?: string | null;
  uf: string;
  telefone?: string;
  createdAt: string;
  criador?: {
    id: string;
    nome: string;
    cidade?: string | null;
    uf?: string | null;
  };
  imagens?: ListingImage[];
  imagemCapa?: string | null;
  isOwner?: boolean;
}

export interface Certificate {
  id: string;
  userId: string;
  nome: string;
  arquivoUrl: string;
  createdAt: string;
}

export interface ListingsPage {
  listings: Listing[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface Job {
  id: string;
  titulo: string;
  descricao: string;
  preco: number | null;
  aCombinar: boolean;
  categoria: string;
  status: JobStatus;
  cep?: string | null;
  cidade: string;
  bairro?: string | null;
  uf: string;
  telefone?: string;
  userId?: string;
  createdAt: string;
  criador?: {
    id: string;
    nome: string;
    cidade?: string | null;
    uf?: string | null;
    telefone?: string | null;
    email?: string;
  };
  interesses?: number;
  isOwner?: boolean;
  myConversationId?: string | null;
}

export interface JobInterestItem {
  id: string;
  createdAt: string;
  profissional: {
    id: string;
    nome: string;
    telefone?: string | null;
    cidade?: string | null;
    uf?: string | null;
  };
  conversationId: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ContactInfo {
  telefone: string;
  whatsappLink: string;
  contratante?: {
    nome: string;
    telefone?: string | null;
    email?: string;
    cidade?: string | null;
    uf?: string | null;
  };
}

export interface InterestResponse {
  conversationId: string;
  contato: ContactInfo;
  mensagem: string;
}

export interface CreateJobPayload {
  titulo: string;
  descricao: string;
  preco?: number | null;
  aCombinar: boolean;
  categoria: string;
  cep?: string;
  cidade: string;
  bairro?: string;
  uf: string;
  telefone: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  content: string;
  senderId: string;
  senderNome: string;
  createdAt: string;
  isMine: boolean;
}

export interface ConversationSummary {
  id: string;
  jobId: string;
  jobTitulo: string;
  jobCategoria: string;
  otherUser: { id: string; nome: string };
  lastMessage: {
    content: string;
    createdAt: string;
    isMine: boolean;
  } | null;
  unread: number;
  updatedAt: string;
}

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}
