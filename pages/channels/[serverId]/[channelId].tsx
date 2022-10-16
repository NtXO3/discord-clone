import * as React from 'react';
import * as i from 'types';
import { Sidebar } from "components/modules/Sidebar";
import { useGetUserServers } from "hooks";
import { GetServerSidePropsContext, NextPage } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { collection, doc, DocumentData, onSnapshot } from 'firebase/firestore';
import { db } from 'utils/firebase-config';
import { App } from 'components/modules/App';
import { useGetUserData } from 'hooks/useGetUserData';
import { useServerState } from 'stores/server';
import Head from 'next/head';

const ServerChannel: NextPage = () => {
  const router = useRouter();
  const { currentServer, setCurrentServer, currentChannel, setCurrentChannel } = useServerState();
  const { serverId, channelId } = router.query;
  const [channel, setChannel] = React.useState<DocumentData | undefined>({});

  useGetUserData();
  useGetUserServers();

  React.useEffect(() => {
    onSnapshot(doc(db, "servers", serverId as string, "channels", channelId as string), (snapshot) => {
      setCurrentChannel(snapshot)
    })
  }, [channelId, serverId])

  React.useEffect(() => {
    onSnapshot(doc(db, "servers", serverId as string), (snapshot) => {
      setCurrentServer(snapshot)
    })
  }, [serverId])

  return (
    <div className='w-full h-screen bg-[#37393f] flex overflow-hidden'>
      <Head>
        <title>Discord | #{currentChannel?.data()?.name} | {currentServer?.data()?.name}</title>
      </Head>
      <Sidebar />
      <App />
    </div>
  );
};

export default ServerChannel;

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