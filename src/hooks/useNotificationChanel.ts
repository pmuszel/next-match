import { pusherClient } from "@/lib/pusher";
import { MessageDTO } from "@/types";
import { usePathname, useSearchParams } from "next/navigation";
import { Channel } from "pusher-js"
import { useCallback, useEffect, useRef } from "react"
import useMessageStore from "./useMessageStore";
import { toast } from "react-toastify";
import { newMessageToast } from "@/components/NewMessageToast";
import { getMemberByUserId } from "@/app/actions/memberActions";


export const useNotificationChannel = (userId: string | null) => {
    const channelRef = useRef<Channel | null>(null);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const {add, updateUnreadCount} = useMessageStore(state =>  ({
        add: state.add,
        updateUnreadCount: state.updateUnreadCount,
    }))

    const handleNewMessage = useCallback((message: MessageDTO) => {
        if(pathname === '/messages' && searchParams.get('container') !== 'outbox') {
            add(message);
            updateUnreadCount(1);
        } else if (pathname !== `/memgers/${message.senderId}/chat`) {
            newMessageToast(message);
            updateUnreadCount(1);
        }
    }, [add, pathname, searchParams, updateUnreadCount]);

    const handleNewLike = useCallback(async (userId: string) => {
        const userInfo = await getMemberByUserId(userId);
        newMessageToast(undefined, `${userInfo?.name} likes you.`, `/members/${userId}`, userInfo?.image);
    }, [])

    useEffect(() => {
        if(!userId) return;

        if(!channelRef.current) {
            channelRef.current = pusherClient.subscribe(`private-${userId}`);
            channelRef.current.bind('message:new', handleNewMessage);
            channelRef.current.bind('like:new', handleNewLike);
        }

        return () => {
            if(channelRef.current && channelRef.current.subscribed) {
                channelRef.current.unsubscribe();
                channelRef.current.unbind('message:new');
                channelRef.current.unbind('like:new');
                channelRef.current = null
            }
        }
    }, [userId, handleNewMessage, handleNewLike])
}