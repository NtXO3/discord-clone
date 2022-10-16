import * as React from 'react';
import * as i from 'types';
import Moment from 'react-moment';
import { useSession } from 'next-auth/react';
import { TbTrash } from 'react-icons/tb';
import { MdModeEdit } from 'react-icons/md'
import { deleteDoc, doc, DocumentData, DocumentReference, getDoc, updateDoc } from 'firebase/firestore';
import { db } from 'utils/firebase-config';
import { useServerState } from 'stores/server';
import TextareaAutosize from 'react-textarea-autosize';

export const Message: React.FC<MessageProps> = ({ message, id, onShowUserProfile, documentRef }) => {
  const { data: session } = useSession();
  const { currentServer, currentChannel} = useServerState();
  const [isEditing, setIsEditing] = React.useState(false);
  const [messageText, setMessageText] = React.useState(message.text);
  const [user, setUser] = React.useState<i.User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
  const formatedText = message?.text?.replace(/(?:\r\n|\r|\n)/g, '<br>');

  const onCancel = () => {
    setIsEditing(false)
    setMessageText(message.text)
  }

  const defaultRef = doc(db, "servers", currentServer?.id as string ?? "", "channels", currentChannel?.id as string ?? "", "messages", id);

  const onEditMessage = async (ref: DocumentReference<DocumentData>, e?: React.KeyboardEvent<HTMLTextAreaElement>, click?: boolean) => {
    if (!messageText?.trim().length) {
      return;
    }

    if (e?.key === 'Escape') {
      return onCancel();
    }

    if (!click && e?.key !== 'Enter' || e?.shiftKey || !currentChannel || !currentServer) return;

    await updateDoc(ref, {
      text: messageText,
    })
    setIsEditing(false)
  }

  const onDeleteMessage = async () => {
    if (!currentServer || !currentChannel) return;

    await deleteDoc(documentRef ?? defaultRef)
  }

  const getUser = async () => {
    setIsLoading(true)
    const data = await getDoc(doc(db, "users", message.uid));
    setUser(data.data() as i.User)
  }

  React.useEffect(() => {
    if (!message) return;
  
    getUser()
  }, [message])

  return (
    <div className='flex relative w-full mb-3 group hover:bg-[#3a3d43] pl-4 pr-32 py-2 transition duration-200 ease-in-out'>
      <div className='mr-3'>
        <img src={user?.image} className="w-8 h-8 rounded-full object-cover" alt="profile image" />
      </div>

      <div className='flex flex-col text-[#ebedef] w-full relative items-start'>
        <div className='flex items-center font-semibold text-[15px] mb-1 relative pr-2'>
          <h4 className='mr-2 cursor-pointer hover:underline' onClick={(e) => onShowUserProfile(e, message.uid)}>
            {user?.name}
          </h4>
          <span className='text-[11px] leading-1 text-gray-400 font-medium'>
            <Moment calendar>{message?.timestamp?.seconds * 1000}</Moment>
          </span>
        </div>
        {messageText ? isEditing ? (
          <div className='w-full'>
            <div className='bg-[#40444b] rounded-md p-2 w-full my-1'>
              <TextareaAutosize 
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className='bg-transparent resize-none flex-1 outline-none pl-1 
                    text-[15px] placeholder-gray-500 text-[#ebedef] w-full'
                onKeyUp={(e) => onEditMessage(documentRef ?? defaultRef, e, false)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && e.preventDefault()}
                rows={1}
              />
            </div>
            <p className='text-[12px]'>
              escape to &nbsp;
              <span className='text-blue-400 hover:underline cursor-pointer' onClick={onCancel}>
                cancel&nbsp;
              </span> • enter to&nbsp;
              <span className='text-blue-400 hover:underline cursor-pointer' onClick={() => onEditMessage(documentRef ?? defaultRef, undefined, true)}>
                save
              </span>
            </p>
          </div>
        ) : (
          <div>
            <p className='text-base' dangerouslySetInnerHTML={{ __html: formatedText ?? "" }}></p>
            {message.attachment && (
              <img 
                src={message.attachment} alt="Attachment" 
                className='h-[280px] object-cover mt-2' 
              />
            )}
          </div>
        ) : null}
        {message.gif && (
          <img src={message.gif} alt="gif" className='h-[240px] object-cover mt-1' />
        )}
      </div>  

      {message.uid === session?.user.uid && !isEditing && (
        <div className='flex items-center invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all ease-in-out duration-200 bg-[#2e3035]
        absolute right-8 translate-y-[-50%] top-0 rounded-md'>
          <button className='text-xl p-2 text-gray-400 hover:bg-[#3b3f46]'>
            <MdModeEdit onClick={() => setIsEditing(true)} />
          </button>
          <button className='text-xl p-2 text-gray-400 hover:bg-[#3b3f46]' onClick={onDeleteMessage}>
            <TbTrash />
          </button>
        </div>
      )}
    </div>
  );
};

type MessageProps = {
  message: i.Message;
  id: string;
  onShowUserProfile: (e: React.MouseEvent, uid: string) => void;
  documentRef?: DocumentReference<DocumentData>;
};
