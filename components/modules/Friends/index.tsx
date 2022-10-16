import { Status } from 'components/common';
import { db, storage } from 'utils/firebase-config';
import { addDoc, collection, doc, DocumentData, onSnapshot, orderBy, query, QueryDocumentSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useOutsideClick } from 'hooks/useOutsideClick';
import { useRouter } from 'next/router';
import * as React from 'react';
import { IoIosHelpCircle } from 'react-icons/io';
import { useUserState } from 'stores/user';
import * as i from 'types';
import { Input } from '../Input';
import { Message } from '../Message';
import { ProfileModal } from '../ProfileModal';
import { DateDivider } from '../Server/components/DateDivider';
import { useReverseScroll } from 'hooks/useReverseScroll';

export const Friends: React.FC = () => {
  const router = useRouter();
  const { currentUserData, setSelectedUserId } = useUserState();
  const { messageId } = router.query;
  const [messages, setMessages] = React.useState<QueryDocumentSnapshot<DocumentData>[] | null>(null);
  const [conversationData, setConversationData] = React.useState<i.DirectMessage | null>(null);
  const otherUserId = conversationData?.uids.find((userId) => userId !== currentUserData?.uid);
  const [input, setInput] = React.useState("");
  const messagesListRef = React.useRef<null | HTMLDivElement>(null);
  const [showProfileModal, setShowProfileModal] = React.useState(false);
  const [profileModalPos, setProfileModalPos] = React.useState<null | { x: number, y: number}>(null);
  const [otherUser, setOtherUser] = React.useState<null | i.User>(null);

  useReverseScroll(messagesListRef, messages)

  useOutsideClick(showProfileModal, setShowProfileModal);

  const onShowUserProfile = (e: React.MouseEvent, uid: string) => {
    e.stopPropagation();
    setSelectedUserId(uid);
    setProfileModalPos({ x: e.clientX < 500 ? 400 : 650, y: e.clientY < 700 ? e.clientY : 500 });
    setShowProfileModal(true);
  }

  const onSendMessage = async (e?: React.KeyboardEvent<HTMLTextAreaElement>, attachment?: string | null, setAttachment?: (attachment: string | null) => void, gif?: string) => {
    if ((!input.trim().length && !gif) || !currentUserData) {
      return;
    }
  
    const dbRef = collection(db, "conversations", messageId as string, "messages")
  
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
    const messageToSend = input;
    setInput('')

    const docRef = await addDoc(dbRef, {
      text: messageToSend,
      uid: currentUserData.uid,
      name: currentUserData.name,
      timestamp: serverTimestamp(),
      image: currentUserData.image,
    })

    const attachmentRef = ref(storage, `messages/${messageId}/attachment`);

    if (attachment && setAttachment) {
      await uploadString(attachmentRef, attachment, "data_url")
        .then(async () => {
            const downloadUrl = await getDownloadURL(attachmentRef);
            await updateDoc(doc(db, "conversations", messageId as string, "messages", docRef.id), {
              attachment: downloadUrl,
            })
            setAttachment(null);
        });
    }
  }

  React.useEffect(() => {
    if (!otherUserId) return;

    onSnapshot(doc(db, "users", otherUserId), (snapshot) => {
      setOtherUser(snapshot.data() as i.User)
    })
  }, [otherUserId])

  React.useEffect(() => {
    if (messageId) {
      onSnapshot(query(collection(db, "conversations", messageId as string, "messages"), orderBy("timestamp", "asc")), (snapshot) => {
        setMessages(snapshot.docs)
      })
    }
  }, [messageId])

  React.useEffect(() => {
    if (messageId) {
      onSnapshot(doc(db, "conversations", messageId as string), (snapshot) => {
        setConversationData(snapshot.data() as i.DirectMessage)
      })
    }
  }, [messageId])

  if (messageId) {
    return (
      <div className='flex flex-1 h-screen flex-col'>
        <div className='app-top-bar justify-between px-4'>
          <div className='text-[#ebedef] flex items-center font-semibold text-lg'>
            <span className='text-2xl mr-2 text-[#8c8e93] font-medium'>@</span>
            {otherUser?.name}
            <Status relative status={otherUser?.status ?? 'OFFLINE'} extraClassNames="ml-1.5" />
          </div>
          <div className='flex items-center gap-1'>
            <button className='icon-button text-[24px]'>
              <IoIosHelpCircle />
            </button>
          </div>
        </div>

        <div className='flex justify-end h-screen overflow-hidden'>
          <div className='flex-1 relative h-full max-h-screen pb-[70px] flex flex-col justify-end'>
            <div ref={messagesListRef} className='max-h-full pt-8 overflow-y-scroll'>
              {messages && messages?.length > 0 && <DateDivider date={messages[0]?.data().timestamp} />}
              {messages && messages.map((message, index) => {
                const prevMessageDate = new Date(messages[index-1]?.data()?.timestamp?.seconds * 1000)
                return (
                  <>
                    {prevMessageDate.getDate() < new Date(message.data()?.timestamp?.seconds * 1000).getDate() && (
                      <DateDivider key={message.data()?.timestamp?.seconds} date={messages[index]?.data().timestamp} />
                    )}
                    <Message 
                      message={message.data() as i.Message} 
                      key={message.id} id={message.id} 
                      onShowUserProfile={onShowUserProfile} 
                      documentRef={doc(db, "conversations", messageId as string, "messages", message.id)}
                    />
                  </>
                )
              })}
            </div>

            {showProfileModal && (
              <ProfileModal profileModalPos={profileModalPos} />
            )}
            
            <Input isDm userDmName={otherUser?.name} message={input} setMessage={setInput} onSend={onSendMessage} />

          </div>
        </div>
      </div>
    )
  }

  return (
    <h1>Friends</h1>
  );
};
