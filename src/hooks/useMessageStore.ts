import { MessageDTO } from "@/types"
import { create } from "zustand"
import { devtools } from "zustand/middleware"

type MessageState = {
    messages: MessageDTO[],
    unreadCount: number,
    add: (message: MessageDTO) => void,
    remove: (id: string) => void,
    set: (messages: MessageDTO[]) => void,
    updateUnreadCount: (amount: number) => void,
}

const useMessageStore = create<MessageState>()(devtools((set) => ({
    messages: [],
    unreadCount: 0,
    add: (message) => set(state => ({
        messages: [message, ...state.messages]
    })),
    remove: (id) => set(state => ({
        messages: state.messages.filter(m => m.id !== id)
    })),
    set: (messages) => set({messages}),
    updateUnreadCount: (amount) => set(state => ({unreadCount: state.unreadCount + amount})),
}), {name: 'messagesStoreDemo'}));

export default useMessageStore;