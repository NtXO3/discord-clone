import { Sidebar } from 'components/modules/Sidebar';
import * as i from 'types';
import { db } from 'utils/firebase-config';
import { collection, getDoc, onSnapshot } from 'firebase/firestore';
import { GetServerSidePropsContext, NextPage } from 'next';
import { getProviders, getSession, useSession } from 'next-auth/react';
import * as React from 'react';
import { useServerState } from 'stores/server';
import { useGetUserServers } from 'hooks';
import { App } from 'components/modules/App';
import { useGetUserData } from 'hooks/useGetUserData';
import Head from 'next/head';

const HomeMe: NextPage = () => {

  useGetUserServers();
  useGetUserData();

  return (
    <div className='w-full h-screen bg-[#37393f] flex'>
      <Head>
        <title>Discord | Friends</title>
      </Head>
      <Sidebar />

      <App />
    </div>
  );
};

export default HomeMe;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx);

  if (!session?.user) {
    return {
      redirect: {
        destination: '/login',
      }
    }
  }

  return {
    props: {
      session,
    }
  }
}