import { db, storage } from 'utils/firebase-config';
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useUserState } from 'stores/user';
import * as i from 'types';

export const ProfileModal: React.FC<ProfileModalProps> = ({ profileModalPos }) => {
  const router = useRouter();
  const { currentUserData } = useUserState();
  const { data: session } = useSession();
  const { selectedUserId } = useUserState();
  const inputRef = React.useRef<null | HTMLInputElement>(null)
  const [user, setUser] = React.useState<i.User | null>(null);
  const [message, setMessage] = React.useState("");
  const isCurrentUser = selectedUserId === currentUserData?.uid;
  const fileInputRef = React.useRef<null | HTMLInputElement>(null);

  const changeUserProfilePic = async (file: string) => {
    if (!currentUserData) return;
  
    const attachmentRef = ref(storage, `users/${currentUserData?.uid}/profileImage`);

    await uploadString(attachmentRef, file, "data_url")
      .then(async () => {
          const downloadUrl = await getDownloadURL(attachmentRef);
          await updateDoc(doc(db, 'users', currentUserData.uid), {
            image: downloadUrl,
          })
      });
    }

  const addAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    const reader = new FileReader();
    const file = e.target?.files[0]

    if (file) {
      reader.readAsDataURL(file)
    }

    reader.onload = (readerEvent => {
      changeUserProfilePic(readerEvent.target?.result as string)
    })
  }

  const onSendDirectMessage = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || !currentUserData || !user) return;

    const q = query(collection(db, "conversations"), where("uids", "array-contains", currentUserData.uid))
    const messageDocs = await getDocs(q)
    const messageDoc = messageDocs.docs.find(doc => doc.data().uids.includes(user?.uid))
    if (!messageDoc) {
      const docRef = await addDoc(collection(db, "conversations"), {
        uids: [currentUserData?.uid, user?.uid],
      })
      await addDoc(collection(db, "conversations", docRef.id, "messages"), {
        text: message,
        uid: currentUserData.uid,
        name: currentUserData.name,
        timestamp: serverTimestamp(),
        image: currentUserData.image,
      })
      router.push(`/channels/@me/${docRef.id}`)
      return;
    }
    await addDoc(collection(db, "conversations",  messageDoc.id, "messages"), {
      text: message,
      uid: currentUserData.uid,
      name: currentUserData.name,
      timestamp: serverTimestamp(),
      image: currentUserData.image,
    }).then(() => router.push(`/channels/@me/${messageDoc.id}`))
  }

  React.useEffect(() => {
    if (!selectedUserId) return;
    onSnapshot(doc(db, "users", selectedUserId), (snapshot) => {
      setUser(snapshot.data() as i.User)
    })
  }, [selectedUserId])

  React.useEffect(() => {
    if (inputRef?.current) {
      inputRef?.current.focus();
    }
  }, [inputRef])

  return (
    <div 
      className={`fixed bg-[#292b2f] pb-4 w-[340px] text-white rounded-md translate-x-[25%] translate-y-[-20%] z-10`} 
      onClick={(e) => e.stopPropagation()}
      style={{ top: profileModalPos?.y, left: profileModalPos?.x }}
    >
      <div className='w-full h-24 bg-blue-400 rounded-t-md' />
      <div className='px-2 pt-14 relative'>
        <div 
          className={`w-24 h-24 border-[#292b2f] border-4 absolute rounded-full left-4 top-0 translate-y-[-50%]
          ${isCurrentUser && 'group'}`}
        >
          {isCurrentUser && (
            <div className='absolute w-full h-full rounded-full bg-black opacity-0 invisible 
              group-hover:opacity-50 group-hover:visible cursor-pointer transition-all flex items-center justify-center text-sm text-gray-100'
              onClick={() => fileInputRef?.current && fileInputRef.current.click()}
            >
              CHANGE
            </div>
          )}
          <img src={user?.image} className="w-full h-full rounded-full object-cover" />
          <input 
            ref={fileInputRef} 
            hidden 
            type="file" 
            accept="image/png, image/jpeg, image/jpg" 
            onChange={addAttachment}
          />
        </div>
        <div className='bg-[#19191c] w-full p-2 rounded-md'>
          <div className='border-b border-gray-700 text-[#ebedef] pb-1 font-semibold text-[20px] mb-2'>
            {user?.tag.split('#')[0]}
            <span className='text-gray-400'>#{user?.tag.split('#')[1]}</span>
          </div>
          <p className='text-[#ebedef] font-bold text-[13px]'>
            ABOUT ME
          </p>
          <p className='text-sm font-light text-gray-300 mb-4'>
            {user?.description || 'No description yet'}
          </p>
          {user?.uid !== session?.user.uid && (
            <input 
              className='border border-gray-700 bg-transparent w-full outline-none rounded-sm text-[15px] py-1.5 px-2 mb-2'
              placeholder={`Message @${user?.tag}`}
              ref={inputRef}
              onKeyUp={onSendDirectMessage}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

type ProfileModalProps = {
  profileModalPos: null | { x: number, y: number};
};
