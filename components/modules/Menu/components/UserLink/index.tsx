import { Status } from 'components/common';
import { db } from 'utils/firebase-config';
import { doc, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useUserState } from 'stores/user';
import * as i from 'types';

export const UserLink: React.FC<UserLinkProps> = ({ directMessage, id }) => {
  const { currentUserData } = useUserState();
  const router = useRouter();
  const otherUserId = directMessage.uids.find((userId) => userId !== currentUserData?.uid);
  const isActive = router.asPath === `/channels/@me/${id}`;
  const [otherUser, setOtherUser] = React.useState<null | i.User>(null);

  React.useEffect(() => {
    if (!otherUserId) return;

    onSnapshot(doc(db, "users", otherUserId), (snapshot) => {
      setOtherUser(snapshot.data() as i.User)
    })
  }, [otherUserId])

  return (
    <div
      className={`menu-button cursor-pointer h-10 flex items-center mb-1.5 ${isActive && 'bg-[#43464d] text-gray-100'}`}
      onClick={() => router.push(`/channels/@me/${id}`)}
    >
      <div className='relative mr-2.5'>
        <img src={otherUser?.image} className="w-8 h-8 rounded-full object-cover" />
        <Status status={otherUser?.status ?? "OFFLINE"} />
      </div>
      <span className={`text-[16px] mr-2 ${isActive ? 'text-gray-100' : 'text-[#8c8e93]'}`}>{otherUser?.name}</span>
    </div>
  );
};

type UserLinkProps = {
  directMessage: i.DirectMessage;
  id: string;
};
