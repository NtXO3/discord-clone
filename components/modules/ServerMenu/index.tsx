import * as React from 'react';
import * as i from 'types';
import { useServerState } from 'stores/server';
import { useUserState } from 'stores/user';
import { UserMenu } from '../Menu/components/UserMenu';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa';
import { AiOutlinePlus } from 'react-icons/ai';
import { ChannelLink } from './components';
import { collection, doc, DocumentData, onSnapshot, QueryDocumentSnapshot, updateDoc } from 'firebase/firestore';
import { db, storage } from 'utils/firebase-config';
import { useSession } from 'next-auth/react';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';

export const ServerMenu: React.FC = () => {
  const { currentUserData } = useUserState();
  const { data: session } = useSession();
  const { currentServer, currentChannel } = useServerState();
  const [serverChannels, setServerChannels] = React.useState<null | QueryDocumentSnapshot<DocumentData>[]>(null)
  const [isExpanded, setIsExpanded] = React.useState(true);

  React.useEffect(() => {
    if (!currentServer) return;
    onSnapshot(collection(db, "servers", currentServer?.id as string, "channels"), (snapshot) => {
      setServerChannels(snapshot.docs)
    })
  }, [currentServer])

  return (
    <div className='bg-[#2f3136] flex-shrink-0 w-56 relative'>
      <div className='app-top-bar text-[#ebedef] font-semibold px-4 text-[15px] justify-between hover__animation'>
        <h4>{currentServer?.data()?.name}</h4>
        <FaAngleDown />
      </div>
      <div className='pt-6 px-2'>
        <div className='group flex justify-between text-[#8c8e93] cursor-pointer mb-2'>
          <div 
            className='flex items-center text-[12px] font-semibold group-hover:text-[#d9d9d9]'
            onClick={() => setIsExpanded(prev => !prev)}
          >
            {isExpanded ? <FaAngleDown className='mr-1' /> : <FaAngleRight className='mr-1' />} <span>TEXT CHANNELS</span>
          </div>
          <button>
            <AiOutlinePlus />
          </button>
        </div>
        {isExpanded ? (
          serverChannels?.map(channel => (
            <ChannelLink id={channel.id} key={channel.id} channel={channel.data() as i.ServerChannel} />
          ))
        ) : currentChannel ? (
          <ChannelLink id={currentChannel.id} channel={currentChannel.data() as i.ServerChannel} />
        ) : null}
      </div>
      {currentUserData && (
        <UserMenu user={currentUserData} />
      )}
    </div>
  );
};
