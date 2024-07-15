const TelegramBot = require('node-telegram-bot-api');

export default async function account(req, res) {

    const token = '6674000394:AAE5B5t7BpDI-RLD4C5zdbYyRqmG7h_1Uac';
    const bot = new TelegramBot(token, { polling: true });

    function sendMSG() {
        bot.sendMessage(6488746167, 'Welcome to the bot...!');
        return bot.stopPolling()
    }

    sendMSG()

}
