import type { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { getSession, useSession } from 'next-auth/react';
import { Logo } from 'components/common';
import { NavLink } from 'components/common/NavLink';
import { FiDownload } from 'react-icons/fi';
import HomeOverlay from 'public/vectors/home-overlay.svg';
import ForegroundLeft from 'public/vectors/foreground-left.svg';
import ForegroundRight from 'public/vectors/foreground-right.svg'
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>Discord Clone | Your Place To Talk and Hang Out</title>
        <meta name="description" content="Discord is the easiest way to talk over voice, video, and text. Talk, chat, hang out, and stay close with your friends and communities." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className='w-full bg-[#404eed] relative'>
        <nav className='w-full max-w-5xl flex justify-between items-center py-5 mx-auto'>
          <Logo className='text-white cursor-pointer w-28' />
          <div className='flex items-center gap-8'>
            <NavLink>Download</NavLink>
            <NavLink>Nitro</NavLink>
            <NavLink>Discover</NavLink>
            <NavLink>Safety</NavLink>
            <NavLink>Support</NavLink>
            <NavLink>Blog</NavLink>
            <NavLink>Careers</NavLink>
          </div>
          <button className='dsc-button sm:text-[13px]' onClick={() => router.push(session?.user ? '/channels/@me' : '/login')}>
            {session?.user ? 'Open Discord' : 'Login'}
          </button>
        </nav>
        <div className='py-28 max-w-5xl w-full flex flex-col items-center justify-center mx-auto z-10 relative'>
          <h1 className='text-center text-[60px] font-headline leading-[0.9] text-white uppercase mb-8'>Imagine A Place...</h1>
          <p className='text-white max-w-2xl text-center text-[18px] mb-8'>
            ...where you can belong to a school club, a gaming group, or a worldwide art community. Where just you and a handful of friends can spend time together. A place that makes it easy to talk every day and hang out more often.
          </p>
          <div className='flex justify-center gap-6'>
            <a href="//discord.com/api/download?platform=osx" target="_blank" rel="noreferrer" className='dsc-button flex items-center text-[18px] py-4 px-8'>
              <FiDownload className='text-[18px] mr-2'/> Download For Mac
            </a>
            <button 
              className='dsc-button text-[18px] text-white bg-gray-800 rounded-full px-8 hover:text-white hover:shadow-none hover:bg-gray-700'
              onClick={() => router.push(session?.user ? '/channels/@me' : '/login')}
            >
              Open Discord In Your Browser
            </button>
          </div>
        </div>
        <img src={HomeOverlay.src} className='absolute bottom-0 left-0 w-full h-auto' alt="Overlay" />
        <img src={ForegroundLeft.src} className="absolute left-[50%] ml-[-1000px] bottom-0" />
        <img src={ForegroundRight.src} className="absolute right-[50%] mr-[-900px] bottom-0" />
      </header>
    </div>
  )
}

export default Home;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession();

  return {
    props: {
      session
    }
  }
}
