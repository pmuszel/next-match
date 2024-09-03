import CardInnerWrapper from '@/components/CardInnerWrapper';
import { CardBody, CardHeader, Divider } from '@nextui-org/react';
import React from 'react'
import ChatForm from './ChatForm';
import { getMessageThread } from '@/app/actions/messageActions';
import MessageBox from './MessageBox';
import { getAuthUserId } from '@/app/actions/authActions';

export default async function MemberChatPage({params}: {params: {userId: string}}) {
  const messages = await getMessageThread(params.userId);
  const userId = await getAuthUserId();
  const body = (
    <div>
      {messages.length === 0 ? 'No messages to display' : (
        <div>
          {messages.map(m => (
            <MessageBox key={m.id} message={m} currentUserId={userId} />
          ))}
        </div>
      )}
    </div>
  )

    return (
        <CardInnerWrapper header='Chat' body={body} footer={<ChatForm />}/>
      );
}
