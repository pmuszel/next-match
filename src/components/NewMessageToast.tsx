import { transformImageUrl } from '@/lib/util';
import { MessageDTO } from '@/types';
import { Image } from '@nextui-org/react';
import Link from 'next/link';
import React from 'react';
import { toast } from 'react-toastify';

type Props = {
    message?: MessageDTO,
    messageString?: string,
    messageLink?: string,
    messageImage? : string | null | undefined
}

export default function NewMessageToast({message, messageString, messageLink, messageImage}: Props) {
    if(message) {
  return (

      <Link href={`/members/${message.senderId}/chat`} className='flex items-center'>
        <div className='mr-2'>
            <Image 
                src={transformImageUrl(message.senderImage) || '/images/user.png'}
                height={50}
                width={50}
                alt='Sender image'
                />
        </div>
        <div className="flex flex-grow flex-col justify-center">
            <div className="font-semibold">{message.senderName} send you a message</div>
            <div className="text-sm">Click to view</div>
        </div>
    </Link>
  )
} else {
    return (
        <Link href={messageLink || '#'} className='flex items-center'>
        <div className='mr-2'>
            <Image 
                src={transformImageUrl(messageImage) || '/images/user.png'}
                height={50}
                width={50}
                alt='Sender image'
                />
        </div>
        <div className="flex flex-grow flex-col justify-center">
            <div className="font-semibold">{messageString}</div>
            <div className="text-sm">Click to view</div>
        </div>
    </Link>
    )
}
}

export const newMessageToast = (message?: MessageDTO, messageString?: string, messageLink?: string,
    messageImage? : string | undefined | null) => {
    toast(<NewMessageToast message={message} messageString={messageString} messageLink={messageLink} messageImage={messageImage}/>)
}
