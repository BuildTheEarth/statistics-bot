import Discord from "discord.js"
import Client from "./Client"

export default abstract class Command {
    client: Client
    abstract name: string
    abstract description: string
    abstract aliases: string[]
    abstract options: CommandOption[]
    dev: boolean = false

    static subcommands: CommandSubclass[] = []
    subcommands: Command[]
    abstract run(
        message: Discord.Message,
        options: Record<string, unknown>
    ): Promise<void> | void

    constructor(client: Client) {
        this.client = client
        const This = this.constructor as typeof Command
        this.subcommands = This.subcommands.map(Cmd => new Cmd(client))
    }

    triggers(name: string): boolean {
        return this.name === name || this.aliases.includes(name)
    }
}

export interface CommandOption {
    positional?: boolean
    name: string
    abbr?: string
    required?: boolean
    default?: unknown
    description: string
}

export type CommandSubclass = new (client: Client) => Command
