import { collection, onSnapshot } from "firebase/firestore";
import { useSession } from "next-auth/react";
import * as React from "react";
import * as i from 'types';
import { useServerState } from "stores/server";
import { db } from "utils/firebase-config";

export const useGetUserServers = () => {
  const { userServers, setUserServers } = useServerState();
  const { data: session } = useSession();

  return (
    React.useEffect(() => {
      if (userServers && userServers.length > 0) return;
    
      onSnapshot(
        collection(db, "servers"),
        (snapshot) => {
          const filteredServers = snapshot.docs.filter(doc => {
            return Boolean(doc.data().members.find((member: i.ServerMember) => member.uid === session?.user.uid));     
          })
          setUserServers(filteredServers);
        }
      )
    }, [session?.user.id, userServers])
  );
};
