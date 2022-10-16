import { useRouter } from 'next/router';
import * as React from 'react';

export const MenuItem: React.FC<MenuItemProps> = ({ children, icon: Icon, to }) => {
  const router = useRouter();

  return (
    <button 
      onClick={() => to && router.push(to)}
      className={`menu-button text-base ${to && router.asPath === to && 'bg-[#43464d] text-gray-100'}`}
    >
      <div className='w-9'>
        <Icon className='h-full w-6' />
      </div>
      {children}
    </button>
  );
};

type MenuItemProps = {
  children: React.ReactNode;
  icon: any;
  to?: string;
};
