import { useRouter } from 'next/router';
import * as React from 'react';
import { useServerState } from 'stores/server';
import * as i from 'types';

export const ChannelLink: React.FC<ChannelLinkProps> = ({ channel, id }) => {
  const { currentServer } = useServerState();
  const router = useRouter();
  const isActive = router.asPath.includes(id)

  return (
    <div 
      className={`text-base menu-button cursor-pointer h-9 flex items-center mb-1.5 ${isActive && 'bg-[#43464d] text-gray-100'}`}
      onClick={() => router.push(`/channels/${currentServer?.id}/${id}`)}
    >
      <span className='text-xl mr-2 text-[#8c8e93]'>#</span>
      {channel.name}
    </div>
  );
};

type ChannelLinkProps = {
  channel: i.ServerChannel;
  id: string;
};
