import Discord from "discord.js"
import Client from "../struct/Client"
import Yargs from "yargs"

// * https://stackoverflow.com/a/16261693

export default async function message(
    this: Client,
    message: Discord.Message
): Promise<unknown> {
    if (message.author.bot) return
    if (!message.content.startsWith(this.config.prefix)) return

    const body = message.content.slice(this.config.prefix.length).trim()
    const split = Array.from(body.match(/(?:[^\s"]+|"[^"]*")+/g)) // *
    const parsed = Yargs(split).help(false).argv

    parsed._ = parsed._.map(String)
    const name = (parsed._.shift() as string).toLowerCase()

    let command = this.commands.find(cmd => cmd.triggers(name))
    if (!command) return
    if (command.dev && !this.config.devs.includes(message.author.id)) return

    let lastReached = false
    while (!lastReached) {
        const nextName = parsed._[0] as string
        const nextCommand = command.subcommands.find(cmd => cmd.triggers(nextName))
        if (!nextCommand) {
            lastReached = true
            break
        } else {
            parsed._.shift()
            command = nextCommand
        }
    }

    const options: Record<string, unknown> = {}
    for (const option of command.options) {
        let value: unknown
        if (option.positional) value = parsed._.shift()
        else value = parsed[option.name] || parsed[option.abbr]

        if (!value && option.required) {
            const kind = option.positional ? " positional" : ""
            return message.channel.send({
                embed: {
                    color: 0xed5439,
                    description: `The \`${option.name}\`${kind} option is required.`
                }
            })
        }

        options[option.name] = value
    }

    await command.run(message, options)
}
