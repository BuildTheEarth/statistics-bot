import Discord from "discord.js"

export default abstract class Command {
    abstract name: string
    abstract description: string
    abstract aliases: string[]
    abstract options: CommandOption[]
    dev: boolean = false

    subcommands: Command[] = []
    abstract run(
        message: Discord.Message,
        options: Record<string, unknown>
    ): Promise<void> | void
}

export interface CommandOption {
    positional?: boolean
    name: string
    abbr?: string
    required?: boolean
    default?: unknown
    description: string
}
