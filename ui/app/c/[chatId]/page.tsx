import ChatWindow from '@/components/chat/chatContainer/ChatWindow';

const Page = ({ params }: { params: { chatId: string } }) => {
  return <ChatWindow id={params.chatId} />;
};

export default Page;
