import ChatWindow from '@/components/chat/chatComponents/chatContainer/ChatWindow';

const Page = ({ params }: { params: { chatId: string } }) => {
  return <ChatWindow id={params.chatId} />;
};

export default Page;
