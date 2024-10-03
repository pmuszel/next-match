'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react'
import MessageBox from './MessageBox';
import { MessageDTO } from '@/types';
import { pusherClient } from '@/lib/pusher';
import { formatShortDateTime } from '@/lib/util';
import { Channel } from 'pusher-js';
import useMessageStore from '@/hooks/useMessageStore';


type Props = {
    initialMessages: {messages: MessageDTO[], readCount: number},
    currentUserId: string,
    chatId: string,
}

export default function MessageList({initialMessages, currentUserId, chatId}: Props) {
  const setReadCount = useRef(false);
    const [messages, setMessages] = useState(initialMessages.messages);
    const channelRef = useRef<Channel | null>(null);
    const {updateUnreadCount} = useMessageStore(state => ({
      updateUnreadCount: state.updateUnreadCount,
    }));

    useEffect(() => {
      if(!setReadCount.current) {
        updateUnreadCount(-initialMessages.readCount);
        setReadCount.current = true;
      }
    }, [initialMessages.readCount, updateUnreadCount])

    const handleNewMessage = useCallback((message: MessageDTO) => {
        setMessages(prevState => {
            return [...prevState, message];
        });
    }, []);

    const handleReadMessages = useCallback((messageIds: string[]) => {
        setMessages(prevState => {
            return prevState.map(m => messageIds.includes(m.id) 
                ? {...m, dateRead: formatShortDateTime(new Date())}
                : m)
        });
    }, []);

    useEffect(() => {
        if(!channelRef.current) {
            channelRef.current = pusherClient.subscribe(chatId);
    
            channelRef.current.bind('message:new', handleNewMessage);
            channelRef.current.bind('messages:read', handleReadMessages);
        }

        return () => {
            if(channelRef.current && channelRef.current.subscribed) {
                channelRef.current.unsubscribe();
                channelRef.current.unbind('message:new', handleNewMessage);
                channelRef.current.unbind('messages:read', handleReadMessages);
            }
        }
    }, [chatId, handleNewMessage, handleReadMessages]);
  return (
    <div>
      {messages.length === 0 ? 'No messages to display' : (
        <div>
          {messages.map(m => (
            <MessageBox key={m.id} message={m} currentUserId={currentUserId} />
          ))}
        </div>
      )}
    </div>
  )
}
