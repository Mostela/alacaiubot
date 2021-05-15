const api = require("axios")
const list_photo = require('../provider/list_photos')

const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`

module.exports = {
    sendMsg: (job_name, error_ex, chat_id) => {
        const data_msg = {
            "chat_id": chat_id,
            "text": `Houve um erro em um dos jobs: \n ${job_name} \n ERRO MSG > ${error_ex}`}

        api.post(`${url}/sendMessage`, data_msg)
    },

    sendPhoto: (chat_id) => {
        const image = list_photo[Math.floor(Math.random() * list_photo.length)]

        data_msg = {
            "chat_id": chat_id,
            "caption": image.caption,
            "photo": image.url
        }
        api.post(`${url}/sendPhoto`, data_msg)
    }
}
