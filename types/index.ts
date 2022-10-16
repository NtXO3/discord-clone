import { DocumentData, FieldValue } from "firebase/firestore";

export type Server = {
  name: string;
  image?: string;
  members: ServerMember[];
  firstChannel: string;
}

export type ServerMember = {
  uid: string;
  role: 'owner' | 'admin' | '@everyone';
}

export type DirectMessage = {
  uids: string[];
}

export type Message = {
  text?: string;
  uid: string;
  attachment?: string;
  image: string;
  name: string;
  timestamp: { seconds: number };
  gif?: string;
}

export type ServerChannel = {
  index: number;
  name: string;
}

export type UserStatus = 'ONLINE' | 'IDLE' | 'DO_NOT_DISTURB' | 'OFFLINE'

export type User = {
  email: string;
  image: string;
  name: string;
  tag: string;
  uid: string;
  status: UserStatus;
  description?: string;
}

export type GifCategories = 'trending' | 'search'