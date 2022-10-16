import { Status } from 'components/common';
import * as React from 'react';
import { User } from 'types';
import { FiLogOut } from 'react-icons/fi';
import { signOut } from 'next-auth/react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from 'utils/firebase-config';

export const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const handleSignOut = async () => {
    await updateDoc(doc(db, "users", user.uid), {
      status: 'OFFLINE'
    })
    signOut()
  }

  return (
    <div className='absolute bottom-0 w-full py-1.5 px-1.5 bg-[#292b2f] flex items-center justify-between'>
      <div className='p-1 flex items-center hover__animation rounded-md'>
        <div className='relative mr-2.5'>
          <img src={user.image} className="w-8 h-8 rounded-full object-cover" />
          <Status status={user.status} />
        </div>
        <div className='text-[#dbddde] font-semibold text-[13px] leading-[1] mr-4'>
          <h5>{user.tag.split("#")[0]}</h5>
          <span className='text-[12px] text-gray-400 font-normal'>#{user.tag.split('#')[1]}</span>
        </div>
      </div>

      <button className='icon-button' onClick={handleSignOut}>
        <FiLogOut />
      </button>
    </div>
  );
};

type UserMenuProps = {
  user: User
}