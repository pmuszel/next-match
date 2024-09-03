import { formatShortDateTime } from "./util";
import { MessageDTO, MessageWithSenderRecipient } from "@/types";

export function mapMessageToMessageDTO(message: MessageWithSenderRecipient): MessageDTO {
    return {
        id: message.id,
        text: message.text,
        created: formatShortDateTime(message.created),
        dateRead: message.dateRead ? formatShortDateTime(message.dateRead) : null,
        senderId: message.sender!.userId,
        senderName: message.sender!.name,
        senderImage: message.sender?.image,
        recipientId: message.recipient!.userId,
        recipientName: message.recipient!.name,
        recipientImage: message.recipient?.image
    }
}