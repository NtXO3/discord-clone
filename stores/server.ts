import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot } from 'firebase/firestore';
import * as i from 'types';
import create from "zustand"

export const useServerState = create<ServerState>((set) => ({
  userServers: null,
  setUserServers: (newUserServers) => set({ userServers: newUserServers }),
  currentServer: null,
  setCurrentServer: (newCurrentServer) => set({ currentServer: newCurrentServer }),
  currentChannel: null,
  setCurrentChannel: (newCurrentChannel) => set({ currentChannel: newCurrentChannel })
}))

type ServerState = {
  userServers: QueryDocumentSnapshot<DocumentData>[] | null;
  setUserServers: (newUserServers: QueryDocumentSnapshot<DocumentData>[]) => void;
  currentServer: DocumentSnapshot<DocumentData> | null;
  setCurrentServer: (newCurrentServer: DocumentSnapshot<DocumentData>) => void;
  currentChannel: DocumentSnapshot<DocumentData> | null;
  setCurrentChannel: (newCurrentChannel: DocumentSnapshot<DocumentData>) => void;
}