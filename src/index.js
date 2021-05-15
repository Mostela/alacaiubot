const { Telegraf } = require('telegraf')
const connection = require('./provider/remotemysql')

const bot = new Telegraf(process.env.BOT_TOKEN)

// Create chat_id to bot send msgs
bot.start((ctx) => {
    connection.query(`INSERT INTO chats (CHAT_ID) VALUES ('${ctx.message.chat.id}')`, function (error){
        if(error){
            ctx.telegram.sendMessage(ctx.message.chat.id, "Tivemos problemas no seu cadastro ou você já está cadastrado")
        }else{
            ctx.telegram.sendMessage(ctx.message.chat.id, "Você foi cadastrado com sucesso! Pode seguir com seu dia, obrigado! Envie test para receber um exemplo")
        }
    })
})

bot.hears("test", (ctx) => {
    sendMsg("TESTE (NAO PRODUCAO)", "print('hello word')", ctx.message.chat.id)
    sendPhoto(ctx.message.chat.id)
})

// Server to send msg to Telegram
const Koa = require('koa');
const {sendPhoto} = require("./service/telegram");
const {sendMsg} = require("./service/telegram");
const app = new Koa();

app.use(async ctx => {
    if (ctx.method === "POST"){
        if (ctx.request.path === "/JOB"){
            if (ctx.request.query){
                const query = ctx.request.query
                connection.query("SELECT CHAT_ID FROM chats ORDER BY created DESC", function (error, results) {
                    for (const chatid of results) {
                        sendMsg(query.name, query.error, chatid.CHAT_ID)
                        sendPhoto(chatid.CHAT_ID)
                    }
                })
            }
        }
        ctx.status = 201
    }
});

app.listen( process.env.PORT, () => {
    console.log("Koa is run!")
})

bot.launch().then(() => {
    console.log("Bot is run!")
})
