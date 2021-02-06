import Discord from "discord.js"
import Command from "../struct/Command"

export default class PingCommand extends Command {
    name = "ping"
    description = "Ping the bot."
    aliases = ["pong"]
    options = []

    async run(message: Discord.Message): Promise<void> {
        const pinger = await message.channel.send("\\🏓 Pong!")
        const ping = pinger.createdTimestamp - message.createdTimestamp
        await pinger.edit(`${pinger.content} **${ping.toLocaleString()}ms**.`)
    }
}
