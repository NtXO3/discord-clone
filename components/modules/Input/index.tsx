import * as React from 'react';
import * as i from 'types';
import { AiOutlineGif } from 'react-icons/ai';
import { BsFillEmojiSmileFill, BsFillPlusCircleFill } from 'react-icons/bs';
import { TbTrash } from 'react-icons/tb';
import TextareaAutosize from 'react-textarea-autosize';
import { useServerState } from 'stores/server';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useOutsideClick } from 'hooks/useOutsideClick';
import { Grid } from '@giphy/react-components';
import { GiphyFetch } from '@giphy/js-fetch-api';

export const Input: React.FC<InputProps> = ({ message, setMessage, onSend, isDm, userDmName }) => {
  const { currentChannel } = useServerState();
  const addFileRef = React.useRef<null | HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = React.useState<string | null>(null);
  const [showEmojis, setShowEmojis] = React.useState(false);
  const [showGifPicker, setShowGifPicker] = React.useState(false);
  const [gifCategory, setGifCategory] = React.useState<i.GifCategories>('trending');
  const [gifSearchQuery, setGifSearchQuery] = React.useState("");
  const API_KEY = process.env.GIPHY_API_KEY;

  const gf = new GiphyFetch('JAGwQpdlZL5W5TRFFbQUGWZoNElPc0xV');

  const fetchGifs = (offset: number) => gf.trending({ offset, limit: 20 });
  
  useOutsideClick(showEmojis, setShowEmojis);
  useOutsideClick(showGifPicker, setShowGifPicker)

  const addAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    const reader = new FileReader();
    const file = e.target?.files[0]

    if (file) {
        reader.readAsDataURL(file)
    }

    reader.onload = (readerEvent => {
        setSelectedFile(readerEvent.target?.result as string)
    })
  }

  const addEmoji = (e: any) => {
    const sym = e.unified.split('-');
    let codesArray: any = [];
    sym.forEach((el: string) => codesArray.push("0x" + el))
    const emoji = String.fromCodePoint(...codesArray)
    setMessage(message + emoji)
  }

  const gifProps = {
    width: 400,
    columns: 3,
    noLink: true,
    hideAttribution: true,
    onGifClick: (gif: any) => onSend(undefined, undefined, undefined, gif.images.downsized_medium.url),
  }

  React.useEffect(() => {
    if (gifSearchQuery.length) {
      return setGifCategory('search')
    }
    setGifCategory('trending')
  }, [gifSearchQuery])

  return (
    <div className='bg-[#37393f] w-full absolute bottom-0 py-6 px-4'>
      <div className='bg-[#40444b] py-2 px-4 rounded-md'>
        {selectedFile && (
          <div className='border-b border-[#4d515a] py-2 mb-4 flex w-full justify-start'>
            <div className='rounded-md h-[240px] px-4 py-2 bg-[#2f3136] relative'>
              <img src={selectedFile} className="h-full object-cover rounded-md" />
              <div 
                className='absolute text-lg text-red-500 top-0 right-0 translate-x-[8px] rounded translate-y-[-8px] bg-[#37393f] p-2 cursor-pointer hover:bg-[#45484f]'
                onClick={() => setSelectedFile(null)}
              >
                <TbTrash />
              </div>
            </div>
          </div>
        )}
        <div className='flex items-start justify-between'>
          <div className='flex items-start flex-1'>
            <div 
              className='text-[20px] text-gray-400 cursor-pointer hover:text-[#ebedef]'
              onClick={() => addFileRef?.current && addFileRef?.current.click()}
            >
              <BsFillPlusCircleFill />
              <input 
                ref={addFileRef} 
                type="file" 
                hidden
                accept="image/png, image/jpeg, image/jpg, .mp4, .mp3, .avi, .mov"
                onChange={addAttachment}
              />
            </div>
            <TextareaAutosize
              className='bg-transparent resize-none flex-1 outline-none pl-4 
              text-base placeholder-gray-500 text-[#ebedef]' 
              rows={1}
              placeholder={isDm ? `Message @${userDmName}` : `Message #${currentChannel?.data()?.name}`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyUp={(e) => onSend(e, selectedFile, setSelectedFile)}
              minRows={1}
              maxRows={10}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && e.preventDefault()}
            />
          </div>

          <div className='flex items-center gap-x-4 relative'>
            <button className='text-[20px] text-gray-400 cursor-pointer hover:text-[#ebedef]' onClick={(e) => {
              e.stopPropagation();
              setShowGifPicker(false);
              setShowEmojis(!showEmojis)
            }}>
              <BsFillEmojiSmileFill />
            </button>
            <button className='text-2xl text-gray-400 cursor-pointer hover:text-[#ebedef]' onClick={(e) => {
              e.stopPropagation()
              setShowEmojis(false)
              setShowGifPicker(!showGifPicker)
            }}>
              <AiOutlineGif />
            </button>

            {showEmojis && (
              <div className={`absolute top-[-16px] translate-y-[-100%] right-0 `} onClick={(e) => e.stopPropagation()} >
                <Picker 
                  data={data}
                  onEmojiSelect={addEmoji}
                />
              </div>
            )}

            {showGifPicker && (
              <div 
                className='absolute top-[-16px] translate-y-[-100%] right-0 bg-[#292b2f] h-[420px] overflow-y-scroll rounded-md p-4'
                onClick={(e) => e.stopPropagation()}
              >
                <div className='flex mb-2'>
                  <button className='bg-[#35383d] mr-4 px-3 text-[#ebedef] cursor-pointer rounded-md' onClick={() => setGifCategory('trending')}>Trending</button>
                  <input 
                    className='px-2 bg-[#35383d] text-[#ebedef] rounded-md py-1 flex-1 outline-none'
                    value={gifSearchQuery}
                    onChange={(e) => setGifSearchQuery(e.target.value)}
                    placeholder="Search for Gifs"
                  />
                </div>
                {gifCategory === 'trending' && (
                  <Grid 
                    fetchGifs={fetchGifs}
                    {...gifProps}
                  />
                )}
                {gifCategory === 'search' && (
                  <Grid
                    key={gifSearchQuery}
                    fetchGifs={() => gf.search(gifSearchQuery)}
                    {...gifProps}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

type InputProps = {
  onSend: (e?: React.KeyboardEvent<HTMLTextAreaElement>, selectedFile?: string | null, setSelectedFile?: (selectedFile: string | null) => void, gif?: string) => Promise<void>;
  message: string;
  setMessage: (message: string) => void;
  isDm?: boolean;
  userDmName?: string;
};
