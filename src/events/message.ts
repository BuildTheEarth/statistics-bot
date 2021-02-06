import Discord from "discord.js"
import Client from "../struct/Client"

export default async function message(
    this: Client,
    message: Discord.Message
): Promise<unknown> {
    if (message.author.bot) return
    if (!message.content.startsWith(this.config.prefix)) return

    const body = message.content.slice(this.config.prefix.length).trim()
    const split = body.split(" ")
    const name = split[0].toLowerCase()
    const options = split.slice(1).join(" ").trim()
    options // unused variable placeholder

    const command = this.commands.find(c => c.name === name || c.aliases.includes(name))
    if (!command) return
    if (command.dev && !this.config.devs.includes(message.author.id)) return

    await command.run(message, {})
}
