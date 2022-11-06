<div align="center">

#### [📙 Installation](https://github.com/doener2323/Shopify-Live-Sales-Tracker#installation)<br/>[💡 Features](https://github.com/doener2323/Shopify-Live-Sales-Tracker#features)<br/>[📝Todo](https://github.com/doener2323/Shopify-Live-Sales-Tracker#to-do) </div>

<h1 align='center'>Shopify Sales Tracker</h1>

<p align="center">
    <strong>
        Since AliHunter is not free anymore, I would like to provide you all a free way to track sales of an shop which is way efficienter and better than the one's of AliHunter.
    </strong>
</p>

<h/>

# What's this?

This Shopify Sales Tracker is an educational purpose only tracker which tells you how high the sales volume of other shopify shops are.
<br>
If you have any suggestions, please open an issue or make a pull request.

# Installation

- Download the repo
- Extract the source code
- Install the requirements ([NodeJS](https://nodejs.org/en/download/) is required): `npm install`
- Run the script: `node .`
- Alternatively you can run the `run.bat` file

# Features

- [x] Detects updates in config automatically
- [x] Clean console logs
![](https://cdn.discordapp.com/attachments/833072466548359250/946052716906569768/unknown.png)
- [x] 99.9% precise
- [x] Collects data about all products, variants and the whole shop and saves it in memory
- [x] Tells you the sales volume of a product, and its variant itself
- [x] Calculates the sales volume of a whole shop (estimated not 100% precise)
- [x] Detects variant image (if there is no variant it will pick the product thumbnail)
- [x] Error handler (script doesn't stop on errors, handles the errors instead)
  - uncaughtException
- [x] Easy customizable config(s)
  - For your discord bot: src\\config\\discord.js
  - Environ config: src\\config\\environ.js
  - Log config: src\\config\\log.js
  - Environ config: src\\config\\environ.js
- [x] Interval for checking (customizable in config)
  - You can find the config in src\\shopify\\config.json
- [x] Extra checks for more precise tracking
  - Checks if a variant got updated and nothing else instead
  - If e.g. the product description got updated, it won't get detected as a sale anymore
- [x] Very fast

![](https://cdn.discordapp.com/attachments/833072466548359250/946047255926947920/unknown.png)

## Discord Bot:

- [x] Embed builder, clean messages
- [x] Command handler & event handler (You can easily extend the bot)
- [x] Commands:
  - [addshop/add]: Add a shop to track it
  - [removeshop/remove]: Remove a shop which is currently getting tracked
  - [list]: Get a list of all shops which the bot is currently tracking
- [x] Automatically creates webhooks & channels

## To-Do:

- Option to add proxies
- Automatically delete discord webhooks & channels of shops which don't get tracked anymore
- Automatically detect a whole cart and put everything into one embed
- Last 24 hours stats

## License:

By downloading this, you agree to the Commons Clause license and that you're not allowed to sell this repository or any code from this repository. For more info see https://commonsclause.com/.
