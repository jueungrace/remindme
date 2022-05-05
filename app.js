const { App } = require('@slack/bolt');

require('dotenv').config();

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});

const startApp = async () => {

    try {
        await app.start(0809);
        console.log('> App successfully started!')
    } catch (error) {
        console.error('> Ran into error while starting app: ', error);
    }

}

/**
 * Generates array of UTC format dates from today to `lastDay`
 * @param {string} lastDay - Date String
 */
const generateDates = (start, end) => {

    const dates = []
    const date = new Date(start);
    let dateString = '';
    const endDate = new Date(end);
    endDate.setHours(9,0,0);
    const endDateString = endDate.toUTCString();

    while (dateString !== endDateString) {
        date.setDate(date.getDate() + 1); // increment the day
        date.setHours(9,0,0); // set hours to be 9am
        dateString = date.toUTCString();
        dates.push(new Date(date).getTime() / 1000);
    }
    
    return dates;

}

const scheduleMessages = async (userId, message, dateArray) => {

    for (let date of dateArray) {

        try {
            const response = await app.client.chat.scheduleMessage({
                channel: userId,
                text: message,
                post_at: date,
            });
            console.log(response)
        } catch (error) {
            console.error('> Ran into error scheduling message for ', date, JSON.stringify(error));
        }
        
    };

    return;

}

const listScheduledMessages = async () => {

    const messages = [];

    try {
        const response = await app.client.chat.scheduledMessages.list();
        for (let message of response.scheduled_messages) {
            messages.push(message)
        }
    } catch (error) {
        console.log('> Ran into error listing scheduled messages: ', error);
    }

    console.log(messages.length)
    return messages;
}

const deleteScheduledMessages = async (messageArray) => {
    for (let message of messageArray) {
        try {
            const response = await app.client.chat.deleteScheduledMessage({
                channel: message.channel_id,
                scheduled_message_id: message.id
            });
            console.log(response);
        } catch (error) {
            console.log('> Ran into error while canceling message ID', message.id, error);
        }
    }
}

startApp()
    .then(() => generateDates('May 5, 2022','July 30, 2022'))
    .then(dates => scheduleMessages('U03E7M91A3F', 'testing ah', dates))
    .then(() => listScheduledMessages())
    .then(() => console.log('> All done!'))
    // .then(messages => deleteScheduledMessages(messages));