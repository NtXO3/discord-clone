import * as React from 'react';
import * as i from 'types';

export const Status: React.FC<StatusProps> = ({ status, relative, extraClassNames }) => {
  const styles = {
    'DO_NOT_DISTURB': 'bg-red-500',
    'ONLINE': 'bg-green-500',
    'IDLE': 'bg-orange-400',
    'OFFLINE': 'bg-gray-700',
  }
  

  return (
    <div className={`${styles[status]}
      ${!relative && 'absolute left-[60%] top-[60%]'} w-4 h-4 rounded-full border-[#292b2f] border-2
      flex justify-center items-center text-[#292b2f] text-[18px] ${extraClassNames}
    `}>
      {status === 'DO_NOT_DISTURB' && <div className='w-2 h-0.5 bg-[#292b2f] rounded-3xl' />}
      {status === 'OFFLINE' && <div className='w-full h-full border-[#676b76] border-[3px] bg-[#292b2f] rounded-full' />}
    </div>
  );
};

type StatusProps = {
  status: i.UserStatus;
  relative?: boolean;
  extraClassNames?: string;
};
