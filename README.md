# Housing Camper

Housing Camper is a tool designed to keep you informed about the latest room availability on the University Residences (UR) housing portal. It continuously monitors the portal for specified keywords and alerts you when these keywords appear or disappear.

## Getting Started

To run the tool, follow these steps:

1. Install dependencies:

   ```bash
   npm install
   ```

2. If you are using the local alert version, make sure VLC is installed on your system.

3. Run the tool:

   ```bash
   node camper.js
   ```

   or

   ```bash
   node camper_discord.js
   ```

## Configuration

Before running the tool, make sure to configure the following settings:

- **Target URL**: Set the URL of the University Residences housing portal in the `targetUrl` variable in the code.

- **Keywords**: Specify the keywords you want to monitor by updating the `keywords` array in the code.

- **Discord Integration (optional)**: If you are using the Discord version, replace the placeholder values in the `token` and `channelId` variables with your Discord bot token and the desired channel ID.

## Local Alert Version

The local alert version uses VLC to play an alert sound when new rooms are detected. Ensure VLC is installed on your system for this feature to work.

## Discord Version

The Discord version sends notifications to a Discord channel when new rooms are detected. Configure the Discord bot token and channel ID in the code.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
