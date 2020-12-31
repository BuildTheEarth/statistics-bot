import Discord from "discord.js"

export default abstract class Command {
    static command: string
    static description: string
    static aliases: string[]
    static options: CommandOption[]
    static dev: boolean = false

    static subcommands: Command[] = []
    static run: (
        message: Discord.Message,
        options: { [name: string]: unknown }
    ) => Promise<void>
}

export interface CommandOption<R = boolean, P = boolean> {
    positional?: P
    name: string
    abbr?: P extends true ? null : string
    required?: R extends true ? true : false
    default?: R extends true ? null : unknown
    description: string
}
