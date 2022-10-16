import Link from 'next/link';
import * as React from 'react';
import * as i from 'types';
import { FaDiscord } from 'react-icons/fa';
import { useServerState } from 'stores/server';
import { ServerLink } from '../ServerLink';
import { useRouter } from 'next/router';
import { AiOutlinePlus } from 'react-icons/ai'

export const Sidebar: React.FC<SidebarProps> = () => {
  const { userServers, setUserServers } = useServerState();
  const router = useRouter();
  const selected = router.asPath.includes('/@me')

  return (
    <nav className='flex flex-shrink-0 w-[76px] bg-[#1f2225] flex-col items-center py-2'>
      <Link href="/channels/@me">
        <div className='w-full h-12 relative flex justify-center group rounded-full mb-2'>
          <div className={`
            absolute left-[-4px] ${selected ? 'w-2 h-8 visible' : 'w-0 h-0 invisible'} bg-white top-[50%] translate-y-[-50%] rounded-full 
            ${!selected && 'group-hover:visible group-hover:h-5 group-hover:w-2'} transition-all duration-300`
          } />
          <div className={`
            bg-[#36393f] w-12 h-full rounded-full flex items-center justify-center ${!selected && 'text-[#dbddde]'} text-3xl
            cursor-pointer transition duration-300 ease-out relative hover:text-white hover:bg-[#5765f2] hover:rounded-2xl
            ${selected && 'bg-[#5765f2] text-white rounded-2xl'}
          `}>
            <FaDiscord className='z-10 relative' />
          </div>
        </div>
      </Link>
      <div className='bg-[#36393f] h-[2px] w-8 mb-2' />
      {userServers?.map(server => (
        <ServerLink key={server.id} server={server.data() as i.Server} id={server.id} />
      ))}
      <div className='w-full h-12 relative flex justify-center group rounded-full mb-2'>
        <div className='
          bg-[#36393f] w-12 h-full rounded-full flex items-center justify-center text-2xl
          cursor-pointer transition duration-300 ease-out relative text-green-600 hover:bg-green-600 hover:rounded-2xl hover:text-white'
        >
          <AiOutlinePlus />
        </div>
      </div>
      <div className='bg-[#36393f] h-[2px] w-8 mb-2' />
    </nav>
  );
};

type SidebarProps = {
  width?: string;
};
