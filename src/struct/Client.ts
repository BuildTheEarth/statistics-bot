import fs from "fs/promises"
import YAML from "yaml"
import Discord from "discord.js"
import createLogger from "@buildtheearth/bot-logger"
import Command from "./Command"

export default class Client extends Discord.Client {
    config: Config
    commands: Map<string, Command>
    events: Map<string, (...args: unknown[]) => unknown>
    logger = createLogger({ filePath: __dirname + "/../../logs" })

    async loadConfig(path: string): Promise<void> {
        const content = await fs.readFile(path, "utf-8")
        const config: Config = YAML.parse(content)
        Object.assign(this.config, config)
    }

    async loadCommands(path: string): Promise<void> {
        const contents = await fs.readdir(path)
        const commands = contents.filter(name => name.endsWith(".js"))
        for (const name of commands) {
            const command: typeof Command = (await import(`${path}/${name}`)).default
            this.commands.set(command.command, command)
        }
    }

    async loadEvents(path: string): Promise<void> {
        const names = await fs.readdir(path)
        for (const name of names) {
            const handler = (await import(`${path}/${name}`)).default.bind(this)
            this.events.set(handler.name, handler)
            this.on(handler.name, handler)
        }
    }

    async login(): Promise<string> {
        return await super.login(this.config.token)
    }
}

export interface Config {
    token: string
    prefix: string
    devs: string[]
    databases: { main: Database; stats: Database }
}

export interface Database {
    host: string
    name: string
    user: string
    pass: string
}
