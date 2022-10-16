import { GetServerSidePropsContext, NextPage } from "next";
import { Provider } from "next-auth/providers";
import { getProviders, getSession, signIn, useSession } from "next-auth/react";
import Head from "next/head";
import LoginBg from 'public/vectors/login-bg.svg';
import { getProviderIcon } from "utils";

const Login: NextPage<LoginProps> = ({ providers }) => {
  const { data: session } = useSession();

  console.log(session)
  return (
    <div className="w-full h-screen relative">
      <Head>
        <title>Login - Discord Clone</title>
      </Head>
  
      <img src={LoginBg.src} className="w-full h-full" />

      <div className="absolute center-absolute p-10 bg-gray-700 rounded-2xl w-full max-w-[420px] flex flex-col justify-center items-center">
        <h1 className="text-white font-bold text-2xl text-center">Welcome Back!</h1>
        <p className="text-gray-400 text-center mb-4">
          We&apos;re so excited to see you again!
        </p>
        {Object.values(providers).map(provider => (
          <button 
            key={provider.id} 
            className="flex items-center px-8 py-2.5 bg-gray-600 rounded-xl text-[#d9d9d9] font-medium cursor-pointer hover:scale-105 transition-all ease"
            onClick={() => signIn(provider.id, { callbackUrl: '/channels/@me' })}
          >
            <img src={getProviderIcon(provider.name)} alt={provider.name} className="w-6 h-6 mr-2" />
            Log In With {provider.name}
          </button>
        ))}
      </div>
    </div>
  )
}

type LoginProps = {
  providers: Provider[];
}

export default Login;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx);
  const providers = await getProviders();

  if (session?.user) {
    console.log('this ran')
    return {
      redirect: {
        destination: '/channels/@me',
      }
    }
  }

  return {
    props: {
      session,
      providers,
    }
  }
}