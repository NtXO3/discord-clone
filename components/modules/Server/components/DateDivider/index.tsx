import * as React from 'react';
import Moment from 'react-moment';

export const DateDivider: React.FC<DateDividerProps> = ({ date }) => {

  return (
    <div className='w-full flex mb-4 items-center'>
      <div className='flex-1 h-[2px] bg-[#43464e]' />
      <p className='px-2 font-semibold text-gray-400 text-[11px]'>
        <Moment format='MMMM DD, YYYY'>
          {new Date(date?.seconds * 1000)}
        </Moment>
      </p>
      <div className='flex-1 h-[2px] bg-[#43464e]' />
    </div>
  );
};

type DateDividerProps = {
  date: { seconds: number};
};
