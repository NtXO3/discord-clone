import { UserIcon } from 'components/icons/User';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { Friends } from '../Friends';
import { Menu } from '../Menu';
import { Server } from '../Server';
import { ServerMenu } from '../ServerMenu';

export const App: React.FC<AppProps> = () => {
  const router = useRouter();

  return (
    <div className='flex h-screen w-full'>
      {router.asPath.includes('@me') ? <Menu /> : <ServerMenu />}
      {router.asPath.includes('@me') ? <Friends /> : <Server />}
    </div>
  );
};

type AppProps = {
  width?: string;
};
