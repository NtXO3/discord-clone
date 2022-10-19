import * as i from 'types';
import * as React from 'react';
import { useServerState } from 'stores/server';
import { HiUsers } from 'react-icons/hi';
import { IoIosHelpCircle } from 'react-icons/io'
import { UsersList } from './components';
import { BsFillPlusCircleFill, BsFillEmojiSmileFill } from 'react-icons/bs';
import { GifIcon } from '@heroicons/react/24/solid';
import TextareaAutosize from 'react-textarea-autosize';
import { addDoc, collection, doc, DocumentData, onSnapshot, orderBy, query, QueryDocumentSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from 'utils/firebase-config';
import { useUserState } from 'stores/user';
import { Message } from '../Message';
import { DateDivider } from './components/DateDivider';
import { MdGif, MdModeEdit } from 'react-icons/md';
import { AiOutlineGif } from 'react-icons/ai';
import { Input } from '../Input';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useSession } from 'next-auth/react';
import { ProfileModal } from '../ProfileModal';
import { useOutsideClick } from 'hooks/useOutsideClick';
import { useReverseScroll } from 'hooks/useReverseScroll';

export const Server: React.FC<ServerProps> = () => {
  const { currentChannel, currentServer } = useServerState();
  const { data: session } = useSession();
  const { currentUserData, setSelectedUserId } = useUserState();
  const [showUsers, setShowUsers] = React.useState(true);
  const [messages, setMessages] = React.useState<null | QueryDocumentSnapshot<DocumentData>[]>(null);
  const [message, setMessage] = React.useState('');
  const messagesListRef = React.useRef<null | HTMLDivElement>(null);
  const [showProfileModal, setShowProfileModal] = React.useState(false);
  const [profileModalPos, setProfileModalPos] = React.useState<null | { x: number, y: number}>(null)

  useOutsideClick(showProfileModal, setShowProfileModal);

  const onShowUserProfile = (e: React.MouseEvent, uid: string) => {
    e.stopPropagation();
    setSelectedUserId(uid);
    setProfileModalPos({ x: e.clientX < 500 ? 400 : 650, y: e.clientY < 700 ? e.clientY : 500 });
    setShowProfileModal(true);
  }

  useReverseScroll(messagesListRef, messages)

  const onSendMessage = async (e?: React.KeyboardEvent<HTMLTextAreaElement>, attachment?: string | null, setAttachment?: (attachment: string | null) => void, gif?: string) => {
    if ((!message.trim().length && !gif) || !currentChannel || !currentServer || !currentUserData) {
      return;
    }
  
    const dbRef = collection(db, "servers", currentServer?.id as string, "channels", currentChannel?.id as string, 'messages');
  
    if (gif) {
      e?.preventDefault();
      await addDoc(dbRef, {
        uid: currentUserData?.uid,
        name: currentUserData.name,
        timestamp: serverTimestamp(),
        image: currentUserData.image,
        gif: gif,
      })
    }
  
    if (e?.key !== 'Enter' || e.shiftKey) return;

    e?.preventDefault();
    const messageToSend = message;
    setMessage('')

    const docRef = await addDoc(dbRef, {
      text: messageToSend,
      uid: currentUserData.uid,
      name: currentUserData.name,
      timestamp: serverTimestamp(),
      image: currentUserData.image,
    })

    const attachmentRef = ref(storage, `messages/${docRef.id}/attachment`);

    if (attachment && setAttachment) {
      await uploadString(attachmentRef, attachment, "data_url")
        .then(async () => {
            const downloadUrl = await getDownloadURL(attachmentRef);
            await updateDoc(doc(db, 'servers', currentServer.id, "channels", currentChannel?.id, "messages", docRef.id), {
              attachment: downloadUrl,
            })
            setAttachment(null)
        });
    }
  }

  React.useEffect(() => {
    if (!currentChannel || !currentServer) return;

    onSnapshot(query(collection(db, "servers", currentServer.id, "channels", currentChannel.id, 'messages'), orderBy("timestamp", "asc")), (snapshot) => {
      setMessages(snapshot.docs);
    })
  }, [currentChannel, currentServer])

  return (
    <div className='flex-1 flex flex-col h-screen'>
      <div className='app-top-bar justify-between px-4'>
        <div className='text-[#ebedef] flex items-center font-semibold'>
          <span className='text-2xl mr-2 text-[#8c8e93] font-medium'>#</span>
          {currentChannel?.data()?.name}
        </div>
        <div className='flex items-center gap-1'>
          <button className='icon-button text-[22px]' onClick={() => setShowUsers(prev => !prev)}>
            <HiUsers />
          </button>
          <button className='icon-button text-[22px]'>
            <IoIosHelpCircle />
          </button>
        </div>
      </div>

      <div className='flex justify-end h-screen overflow-hidden'>
        <div className='flex-1 relative h-full max-h-screen pb-[86px] flex flex-col justify-end'>
          <div ref={messagesListRef} className='max-h-full pt-8 overflow-y-auto dc-scrollbar'>
            <div className='px-4 mb-4 text-[#ebedef]'>
              <div className='w-14 h-14 flex items-center justify-center bg-[#4f545c] text-[40px] rounded-full mb-3'>#</div>
              <h2 className='text-3xl font-bold mb-1'>Welcome to #{currentChannel?.data()?.name}!</h2>
              <p className='text-gray-400 text-sm mb-4'>This is the start of the #{currentChannel?.data()?.name} channel!</p>
              {currentServer?.data()?.members.find((member: i.ServerMember) => member.role === 'owner').uid === session?.user.uid && (
                <button className='flex items-center text-blue-500 hover__animation hover:text-blue-500 px-2 py-1 rounded-lg'>
                  <MdModeEdit className='mr-2' /> Edit channel
                </button>
              )}
            </div>
            {messages && messages?.length > 0 && <DateDivider date={messages[0]?.data().timestamp} />}
            {messages && messages.map((message, index) => {
              const prevMessageDate = new Date(messages[index-1]?.data()?.timestamp?.seconds * 1000)
              return (
                <>
                  {prevMessageDate.getDate() < new Date(message.data()?.timestamp?.seconds * 1000).getDate() && (
                    <DateDivider key={message.data()?.timestamp?.seconds} date={messages[index]?.data().timestamp} />
                  )}
                  <Message message={message.data() as i.Message} key={message.id} id={message.id} onShowUserProfile={onShowUserProfile} />
                </>
              )
            })}
          </div>

          {showProfileModal && (
            <ProfileModal profileModalPos={profileModalPos} />
          )}
          
          <Input message={message} setMessage={setMessage} onSend={onSendMessage} />

        </div>
        {showUsers && <UsersList onShowUserProfile={onShowUserProfile} />}
      </div>
    </div>
  );
};

type ServerProps = {
  width?: string;
};
