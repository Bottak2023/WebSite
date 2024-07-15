const TelegramBot = require('node-telegram-bot-api');

export default async function account(req, res) {

    const token = '7031417747:AAGr4T2ndCANwHiRTrV9RV0S8FjiQJNDeAQ';
    const bot = new TelegramBot(token, { polling: true });

    function sendMSG() {
        bot.sendMessage(6488746167, 'Welcome to the bot...!');
        return bot.stopPolling()
    }

    sendMSG()

}
