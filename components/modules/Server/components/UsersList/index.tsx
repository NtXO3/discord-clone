import { Status } from 'components/common';
import { db } from 'utils/firebase-config';
import { collection, DocumentData, onSnapshot, QueryDocumentSnapshot } from 'firebase/firestore';
import * as React from 'react';
import * as i from 'types';
import { useServerState } from 'stores/server';

export const UsersList: React.FC<PageProps> = ({ onShowUserProfile }) => {
  const [serverMembers, setServerMembers] = React.useState<null | QueryDocumentSnapshot<DocumentData>[]>(null);
  const { currentServer } = useServerState();
  const onlineMembers = serverMembers?.filter(doc => doc.data().status !== 'OFFLINE')
  const offlineMembers = serverMembers?.filter(doc => doc.data().status === 'OFFLINE')

  React.useEffect(() => {
    if (!currentServer) return;
  
    onSnapshot(collection(db, "users"), (snapshot) => {
      const filtered = snapshot.docs.filter(doc => Boolean(currentServer?.data()?.members.find((member: i.ServerMember) => member.uid === doc.data().uid)))
      setServerMembers(filtered)
    })
  }, [currentServer])

  return (
    <div className='bg-[#2f3136] w-56 h-full pt-6 px-4'>
      <div className='text-[#8c8e93] text-[13px] font-semibold mb-3'>
        ONLINE - {onlineMembers?.length ?? 0}
      </div>
      {onlineMembers?.map(member => (
        <div key={member.id} className="flex items-center hover__animation py-1 px-1 rounded-lg" >
          <div className='relative mr-3'>
            <img src={member.data().image} className="w-9 h-9 rounded-full object-cover" alt={member.data()?.name} />
            <Status status={member.data().status} />
          </div>
          <span className='text-gray-400 font-medium text-base'>
            {member.data().name}
          </span>
        </div>
      ))}
      <div className='text-[#8c8e93] text-[13px] font-semibold my-3.5'>
        OFFLINE - {offlineMembers?.length ?? 0}
      </div>
      {offlineMembers?.map(member => (
        <div key={member.id} className="flex items-center hover__animation py-1 px-1 rounded-lg">
          <div className='relative mr-3'>
            <img src={member.data().image} className="w-9 h-9 rounded-full object-cover" alt={member.data()?.name} />
            <Status status={member.data().status} />
          </div>
          <span className='text-gray-400 font-medium text-base'>
            {member.data().name}
          </span>
        </div>
      ))}
    </div>
  );
};

type PageProps = {
  onShowUserProfile: (e: React.MouseEvent, uid: string) => void;
};
