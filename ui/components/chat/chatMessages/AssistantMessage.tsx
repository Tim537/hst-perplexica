'use client';

/* eslint-disable @next/next/no-img-element */
import React, { MutableRefObject, useEffect, useState } from 'react';
import { Message } from '../types';
import { cn } from '@/lib/utils';
import {
  ArrowRight,
  BookCopy,
  Check,
  Copy as CopyIcon,
  Disc3,
  Image,
  Layers3,
  Loader2,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  StopCircle,
  Video,
  Volume2,
  FileText,
} from 'lucide-react';
import Markdown from 'markdown-to-jsx';
import CopyMessage from '../actions/messageActions/CopyMessage';
import RewriteMessage from '../actions/messageActions/RewriteMessage';
import MessageSources from './MessageSources';
import SearchImages from '../../search/images/SearchImages';
import SearchVideos from '../../search/videos/SearchVideos';
import { useSpeech } from 'react-text-to-speech';
import { toast } from 'sonner';
import GenerateSummary from '../../summaries/GenerateSummary';
import GenerateCards from '../../cards/GenerateCards';
import { CardData } from '../../cards/Card';

const MessageBox = ({
  message,
  messageIndex,
  history,
  loading,
  dividerRef,
  isLast,
  rewrite,
  sendMessage,
}: {
  message: Message;
  messageIndex: number;
  history: Message[];
  loading: boolean;
  dividerRef?: MutableRefObject<HTMLDivElement | null>;
  isLast: boolean;
  rewrite: (messageId: string) => void;
  sendMessage: (message: string) => void;
}) => {
  const [parsedMessage, setParsedMessage] = useState(message.content);
  const [speechMessage, setSpeechMessage] = useState(message.content);
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);
  const [summary, setSummary] = useState<string | null | undefined>(null);

  const [cards, setCards] = useState<CardData[] | null>(null);
  const [summaryId, setSummaryId] = useState<string>('');
  useEffect(() => {
    const regex = /\[(\d+)\]/g;

    if (
      message.role === 'assistant' &&
      message?.sources &&
      message.sources.length > 0
    ) {
      return setParsedMessage(
        message.content.replace(
          regex,
          (_, number) =>
            `<a href="${message.sources?.[number - 1]?.metadata?.url}" target="_blank" className="bg-light-secondary dark:bg-dark-secondary px-1 rounded ml-1 no-underline text-xs text-black/70 dark:text-white/70 relative">${number}</a>`,
        ),
      );
    }

    setSpeechMessage(message.content.replace(regex, ''));
    setParsedMessage(message.content);
  }, [message.content, message.sources, message.role]);

  // Summary
  useEffect(() => {
    const fetchSummary = async () => {
      const chatID = history[history.length - 1].chatId;
      const summary = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/summaries/${chatID}/getSummary`,
      );
      if (summary.status === 200) {
        const data = await summary.json();
        setSummary(data.summary.content);
        setSummaryId(data.summary.id.toString());
      } else {
        setSummary(undefined);
      }
    };
    if (summary === null) {
      fetchSummary();
    }
  }, [history, summary]);

  // Cards
  useEffect(() => {
    const fetchCards = async () => {
      const chatID = history[history.length - 1].chatId;
      const cards = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cards/${chatID}/listStacksByChatId`,
      );
      if (cards.status === 200) {
        const data = await cards.json();
        setCards(data.cards);
      } else {
        setCards([]);
      }
    };
    if (cards === null) {
      fetchCards();
    }
  }, [history, cards]);

  const { speechStatus, start, stop } = useSpeech({ text: speechMessage });

  return (
    <div>
      {message.role === 'user' && (
        <div className={cn('w-full', messageIndex === 0 ? 'pt-16' : 'pt-8')}>
          <h2 className="text-black dark:text-white font-medium text-3xl lg:w-9/12">
            {message.content}
          </h2>
        </div>
      )}

      {message.role === 'assistant' && (
        <div className="flex flex-col space-y-9 lg:space-y-0 lg:flex-row lg:justify-between lg:space-x-9">
          <div
            ref={dividerRef}
            className="flex flex-col space-y-6 w-full lg:w-9/12"
          >
            {message.sources && message.sources.length > 0 && (
              <div className="flex flex-col space-y-2">
                <div className="flex flex-row items-center space-x-2">
                  <BookCopy className="text-black dark:text-white" size={20} />
                  <h3 className="text-black dark:text-white font-medium text-xl">
                    Sources
                  </h3>
                </div>
                <MessageSources sources={message.sources} />
              </div>
            )}
            <div className="flex flex-col space-y-2">
              <div className="flex flex-row items-center space-x-2">
                <Disc3
                  className={cn(
                    'text-black dark:text-white',
                    isLast && loading ? 'animate-spin' : 'animate-none',
                  )}
                  size={20}
                />
                <h3 className="text-black dark:text-white font-medium text-xl">
                  Answer
                </h3>
              </div>
              <Markdown
                className={cn(
                  'prose prose-h1:mb-3 prose-h2:mb-2 prose-h2:mt-6 prose-h2:font-[800] prose-h3:mt-4 prose-h3:mb-1.5 prose-h3:font-[600] dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 font-[400]',
                  'max-w-none break-words text-black dark:text-white',
                )}
              >
                {parsedMessage}
              </Markdown>
              {loading && isLast ? null : (
                <div className="flex flex-row items-center justify-between w-full text-black dark:text-white py-4 -mx-2">
                  <div className="flex flex-row items-center space-x-1">
                    {/*  <button className="p-2 text-black/70 dark:text-white/70 rounded-xl hover:bg-light-secondary dark:hover:bg-dark-secondary transition duration-200 hover:text-black text-black dark:hover:text-white">
                      <Share size={18} />
                    </button> */}
                    <RewriteMessage
                      messageId={message.messageId}
                      onAction={() => rewrite(message.messageId)}
                    />
                  </div>
                  <div className="flex flex-row items-center space-x-1">
                    <CopyMessage
                      initialMessage={message.content}
                      message={message}
                    />
                    <button
                      onClick={() => {
                        if (speechStatus === 'started') {
                          stop();
                        } else {
                          start();
                        }
                      }}
                      className="p-2 hst:hover:bg-[#fcfcf9] hst:hover:text-hst-accent text-black/70 dark:text-white/70 rounded-xl hover:bg-light-secondary dark:hover:bg-dark-secondary transition duration-200 hover:text-black dark:hover:text-white"
                    >
                      {speechStatus === 'started' ? (
                        <StopCircle size={18} />
                      ) : (
                        <Volume2 size={18} />
                      )}
                    </button>
                  </div>
                </div>
              )}
              {isLast &&
                message.suggestions &&
                message.suggestions.length > 0 &&
                message.role === 'assistant' &&
                !loading && (
                  <>
                    <div className="h-px w-full bg-light-secondary dark:bg-dark-secondary" />
                    <div className="flex flex-col space-y-3 text-black dark:text-white">
                      <div className="flex flex-row items-center space-x-2 mt-4">
                        <Layers3 />
                        <h3 className="text-xl font-medium">Related</h3>
                      </div>
                      <div className="flex flex-col space-y-3">
                        {message.suggestions.map((suggestion, i) => (
                          <div
                            className="flex flex-col space-y-3 text-sm"
                            key={i}
                          >
                            <div className="h-px w-full bg-light-secondary dark:bg-dark-secondary" />
                            <div
                              onClick={() => {
                                sendMessage(suggestion);
                              }}
                              className="cursor-pointer flex flex-row justify-between font-medium space-x-2 items-center"
                            >
                              <p className="transition duration-200 hover:text-[#24A0ED] hst:hover:text-hst-accent">
                                {suggestion}
                              </p>
                              <Plus
                                size={20}
                                className="text-[#24A0ED] hst:text-hst-accent flex-shrink-0"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
            </div>
          </div>
          <div className="lg:sticky lg:top-20 flex flex-col items-center space-y-3 w-full lg:w-3/12 z-30 h-full pb-4">
            <SearchImages
              query={history[messageIndex - 1].content}
              chatHistory={history.slice(0, messageIndex - 1)}
            />
            <SearchVideos
              chatHistory={history.slice(0, messageIndex - 1)}
              query={history[messageIndex - 1].content}
            />
            <GenerateSummary
              history={history}
              existingSummary={summary}
              existingSummaryId={summaryId}
            />
            <GenerateCards history={history} existingCards={cards || []} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBox;
