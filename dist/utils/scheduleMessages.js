var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const scheduleMessages = (id, message, dateArray, token, client) => __awaiter(void 0, void 0, void 0, function* () {
    const messageIds = [];
    for (const date of dateArray) {
        try {
            const response = yield client.chat.scheduleMessage({
                channel: id,
                text: message,
                post_at: date,
                token,
            });
            if (response.scheduled_message_id)
                messageIds.push([response.scheduled_message_id, id]);
        }
        catch (error) {
            console.error('> Ran into error scheduling message for', date, JSON.stringify(error));
        }
    }
    return messageIds;
});
export default scheduleMessages;
