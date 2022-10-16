import * as i from 'types';
import create from "zustand"

export const useUserState = create<UserState>((set) => ({
  currentUserData: null,
  setCurrentUserData: (newUserData) => set({ currentUserData: newUserData }),
  selectedUserId: null,
  setSelectedUserId: (newUid) => set({ selectedUserId: newUid })
}))

type UserState = {
  currentUserData: i.User | null;
  setCurrentUserData: (newUserData: i.User) => void;
  selectedUserId: string | null,
  setSelectedUserId: (newUid: string | null) => void;
}