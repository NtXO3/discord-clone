import { useRouter } from 'next/router';
import * as React from 'react';
import * as i from 'types';

export const ServerLink: React.FC<ServerLinkProps> = ({ server, id }) => {
  const router = useRouter();
  const selected = router.asPath.includes(id);

  if (!server.image) {
    return (
      <div 
        className='w-full h-12 relative flex justify-center group rounded-full mb-2'
        onClick={() => router.push(`/channels/${id}/${server.firstChannel}`)}
      >
        <div className={`
          absolute left-[-4px] ${selected ? 'visible w-2 h-8' : 'invisible w-0 h-0'} bg-white top-[50%] translate-y-[-50%] rounded-full 
          group-hover:visible group-hover:h-5 group-hover:w-2 transition-all duration-300`
        } />
        <div className={`
            bg-[#36393f] w-12 h-full rounded-full flex items-center justify-center text-[#dbddde] text-2xl
            cursor-pointer transition duration-300 ease-out relative hover:bg-[#5765f2] hover:rounded-2xl capitalize font-medium text-[15px] sm:text-lg
            ${selected && 'bg-[#5765f2] rounded-2xl'}
        `}>
          {server.name.split(" ")[0][0]}
          {server.name.split(" ")[1][0]}
        </div>
      </div>
    )
  }

  return (
    <div 
      className='w-full h-12 relative flex justify-center group rounded-full mb-2'
      onClick={() => router.push(`/channels/${id}/${server.firstChannel}`)}
    >
      <div className={`
        absolute left-[-4px] w-0 h-5 bg-white top-[50%] translate-y-[-50%] rounded-full invisible 
        group-hover:visible group-hover:w-2 transition-all ${selected && 'visible w-2'}`
      } />
      <div className='
        bg-[#36393f] w-12 h-full rounded-full flex items-center justify-center text-[#dbddde] text-2xl
        cursor-pointer transition duration-300 ease-out relative hover:bg-[#5765f2] hover:rounded-2xl
      '>
        <img src={server.image} className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

type ServerLinkProps = {
  server: i.Server;
  id: string;
};
