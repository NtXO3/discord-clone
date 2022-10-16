import * as React from 'react';

export const NavLink: React.FC<NavLinkProps> = ({ children }) => {

  return (
    <p className='text-white font-semibold cursor-not-allowed hover:underline text-sm sm:text-[15px]'>
      {children}
    </p>
  );
};

type NavLinkProps = {
  children: React.ReactNode;
};
