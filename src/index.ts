import Client from "./struct/Client"

async function main(): Promise<void> {
    const client = new Client()

    client.logger.debug("Loading config...")
    await client.loadConfig(__dirname + "/../config.yml")
    client.logger.info("Loaded config.")

    client.logger.debug("Loading commands...")
    await client.loadCommands(__dirname + "/commands")
    client.logger.info("Loaded commands.")

    client.logger.debug("Loading events...")
    await client.loadEvents(__dirname + "/events")
    client.logger.info("Loaded events.")

    client.logger.debug("Logging in...")
    await client.login()
    client.logger.info("Logged in.")
}

main()
