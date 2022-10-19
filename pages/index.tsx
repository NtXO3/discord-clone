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
import Image from 'next/image';
import Home1 from 'public/static/home1.svg';
import Home2 from 'public/static/home2.svg';
import Home3 from 'public/static/home3.svg';
import Home4 from 'public/static/home4.svg';
import { BsTwitter, BsInstagram, BsYoutube, BsFacebook } from 'react-icons/bs';
import { IoLogoFacebook } from 'react-icons/io'
import { FooterMenuList } from 'components/common/FooterMenuList';

const Home: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className='overflow-x-hidden'>
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

      <main>
        <section id="invite-only" className='bg-white'>
          <div className='home__container'>
            <figure className='w-[60%]'>
              <Image src={Home1} layout="responsive" alt="Create an Invite Only Place" />
            </figure>
            <div className='w-[40%]'>
              <h1 className='font-bold text-6xl pr-12 leading-[1.1] mb-6 text-[#23272a]'>Create an invite-only place where you belong</h1>
              <p className='font-regular text-[20px] leading-[1.6] text-[#23272a]'>
                Discord servers are organized into topic-based channels where you can collaborate, share, and just talk about your day without clogging up a group chat.
              </p>
            </div>
          </div>
        </section>
        <section id="hanging-out" className='bg-[#f6f6f6]'>
          <div className='home__container flex-row-reverse'>
            <figure className='w-[60%]'>
              <Image src={Home2} layout="responsive" alt="Create an Invite Only Place" />
            </figure>
            <div className='w-[40%]'>
              <h1 className='font-bold text-6xl pr-12 leading-[1.1] mb-6 text-[#23272a]'>Where hanging out is easy</h1>
              <p className='font-regular text-[20px] leading-[1.6] text-[#23272a] max-w-[380px]'>
                Grab a seat in a voice channel when you’re free. Friends in your server can see you’re around and instantly pop in to talk without having to call.
              </p>
            </div>
          </div>
        </section>
        <section id="fandom" className='bg-white'>
          <div className='home__container flex-row'>
            <figure className='w-[60%]'>
              <Image src={Home3} layout="responsive" alt="Create an Invite Only Place" />
            </figure>
            <div className='w-[40%]'>
              <h1 className='font-bold text-6xl pr-12 leading-[1.1] mb-6 text-[#23272a]'>From few to a fandom</h1>
              <p className='font-regular text-[20px] leading-[1.6] text-[#23272a] max-w-[380px]'>
                Get any community running with moderation tools and custom member access. Give members special powers, set up private channels, and more.
              </p>
            </div>
          </div>
        </section>
        <section id="reliable" className='bg-[#f6f6f6]'>
          <div className='py-24 flex flex-col items-center justify-center w-full max-w-[1180px] mx-auto'>
            <h1 className='font-headline text-5xl text-[#23272a] mb-6'>RELIABLE TECH FOR STAYING CLOSE</h1>
            <p className='font-regular text-[20px] leading-[1.6] text-[#23272a] max-w-[980px] text-center'>
              Low-latency voice and video feels like you’re in the same room. Wave hello over video, watch friends stream their games, or gather up and have a drawing session with screen share.
            </p>
            <figure className='w-full mt-4'>
              <Image src={Home4} layout="responsive" alt="Create an Invite Only Place" />
            </figure>
            <div className='py-12 flex flex-col items-center justify-center'>
              <h1 className='font-bold text-4xl mb-8'>Ready to start your journey?</h1>
              <a href="//discord.com/api/download?platform=osx" target="_blank" rel="noreferrer" className='dsc-button flex items-center text-[20px] py-5 px-9 bg-[#404eed] text-white hover:text-white'>
                <FiDownload className='text-[18px] mr-2'/> Download For Mac
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className='bg-[#23272a]'>
        <div className='w-full max-w-[1200px] pt-32 flex items-start border-b border-[#5765f2] pb-8 mx-auto'>
          <div className='w-[33%]'>
            <h2 className='font-headline text-[#5765f2] mb-8 text-4xl'>IMAGINE A <br /> PLACE</h2>
            <div className="flex items-center gap-8">
              <div className='text-white text-2xl'>
                <BsTwitter />
              </div>
              <div className='text-white text-2xl'>
                <BsInstagram />
              </div>
              <div className='text-white text-2xl'>
                <IoLogoFacebook />
              </div>
              <div className='text-white text-2xl'>
                <BsYoutube />
              </div>
            </div>
          </div>

          <FooterMenuList title="Product" items={["Download", "Nitro", "Status"]} />
          <FooterMenuList title="Company" items={["About", "Jobs", "Branding", "Newsroom"]} />
          <FooterMenuList title="Resources" items={["College", "Support", "Safety", "Blog", "Feedback", "Developers", "Streamkit"]} />
          <FooterMenuList title="Policies" items={["Terms", "Privacy", "Cookie Settings", "Guidelines", "Acknowledgments", "Licenses", "Moderation"]} />
        </div>

        <div className='home__container justify-between py-8'>
          <Logo className='text-white' />
          <button className='dsc-button sm:text-[15px] py-2.5 px-6 bg-[#5765f2] text-white' onClick={() => router.push(session?.user ? '/channels/@me' : '/login')}>
            {session?.user ? 'Open Discord' : 'Login'}
          </button>
        </div>
      </footer>
    </div>
  )
}

export default Home;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx);

  return {
    props: {
      session
    }
  }
}
