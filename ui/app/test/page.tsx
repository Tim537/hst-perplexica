'use client';

import { Clock, Edit, Share } from 'lucide-react';
import DeleteChat from '@/components/chat/actions/chatActions/DeleteChat';
import { useState } from 'react';
import Memories from '@/components/memories';

const Test = () => {
  //const [chats, setChats] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  return (
    /*
    <div className="fixed z-40 top-0 left-0 right-0 px-4 lg:pl-[104px] lg:pr-6 lg:px-8 flex flex-row items-center justify-between w-full py-4 text-sm text-black dark:text-white/70 border-b bg-light-primary dark:bg-dark-primary border-light-100 dark:border-dark-200">
      <a
        href="/"
        className="active:scale-95 transition duration-100 cursor-pointer lg:hidden"
      >
        <Edit size={17} />
      </a>
      <div className="hidden lg:flex flex-row items-center justify-center space-x-2">
        <Clock size={17} />
        <p className="text-xs">ago</p>
      </div>
      <p className="relative left-[8rem]">chat title</p>

      <div className="relative left-[15.4rem]">
        <Share
          size={17}
          className="active:scale-95 transition duration-100 cursor-pointer"
        />
      </div>
      <DeleteChat chatId={''} chats={[]} setChats={() => {}} />
    </div>
    */
    <>
      <br />
      <br />
      <br />
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Close Memories' : 'Open Memories'}
      </button>
      <br />
      <br />
      <br />
      <div>{isOpen && <Memories />}</div>
    </>
  );
};

export default Test;
