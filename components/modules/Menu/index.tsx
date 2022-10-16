import { NitroIcon, UserIcon } from 'components/icons';
import { useRouter } from 'next/router';
import * as React from 'react';
import * as i from 'types';
import { AiOutlinePlus } from 'react-icons/ai';
import { useUserState } from 'stores/user';
import { MenuItem } from './components';
import { UserMenu } from './components/UserMenu';
import { collection, DocumentData, getDoc, onSnapshot, query, QueryDocumentSnapshot, where } from 'firebase/firestore';
import { db } from 'utils/firebase-config';
import { UserLink } from './components/UserLink';

export const Menu: React.FC = () => {
  const { currentUserData } = useUserState();
  const [userDms, setUserDms] = React.useState<null | QueryDocumentSnapshot<DocumentData>[]>(null);
  const router = useRouter();

  React.useEffect(() => {
    if (!currentUserData) return;

    const q = query(collection(db, "conversations"), where("uids", "array-contains", currentUserData.uid))
    onSnapshot(q, (snapshot) => {
      setUserDms(snapshot.docs)
    })
  }, [currentUserData])

  return (
    <div className='bg-[#2f3136] flex-shrink-0 w-60 relative'>
      <div className='app-top-bar'>
        <div className='w-full h-6 bg-[#1f2225] rounded-sm px-1.5 text-[13px] flex items-center text-gray-400 font-medium cursor-pointer'>
          Find or start a conversation
        </div>
      </div>

      <div className='p-2.5 flex flex-col'>
        <MenuItem icon={UserIcon} to="/channels/@me">Friends</MenuItem>
        <MenuItem icon={NitroIcon}>Nitro</MenuItem>
      </div>
      <div className='group flex justify-between text-[#8c8e93] my-2 px-3'>
        <div 
          className='flex items-center text-[13px] font-semibold group-hover:text-[#d9d9d9]'
        >
          <span>DIRECT MESSAGES</span>
        </div>
        <button className='cursor-pointer hover:text-[#d9d9d9]'>
          <AiOutlinePlus />
        </button>
      </div>
      <div className='px-2'>
        {userDms?.map((dm) => <UserLink directMessage={dm.data() as i.DirectMessage} key={dm.id} id={dm.id} />)}
      </div>
      {currentUserData && (
        <UserMenu user={currentUserData}  />
      )}
    </div>
  );
};
