import { doc, onSnapshot } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import * as React from 'react';
import * as i from 'types';
import { useUserState } from "stores/user"
import { db } from 'utils/firebase-config';

export const useGetUserData = () => {
  const { data: session } = useSession();
  const { currentUserData, setCurrentUserData } = useUserState();

  return React.useEffect(() => {
    if (currentUserData || !session?.user.uid) return;

    onSnapshot(doc(db, "users", session.user.uid), (snapshot) => {
      setCurrentUserData(snapshot.data() as i.User)
    })
  }, [session?.user, currentUserData])
}