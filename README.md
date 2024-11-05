# Motivation

I believe in the "divide and conquer" approach. When I want to create a functional project, such as a personal Telegram bot, I focus on developing the bot's unique logic instead of getting bogged down by the intricacies of the Telegram Bot API. This allows me to concentrate on how my bot should operate without simultaneously dealing with API complexities.

For example, if I want my Telegram bot to generate an interesting fact about TypeScript using a generative LLM model when the `/typescript-fact` command is invoked, I can focus solely on crafting the prompt for the model. I don't need to worry about which library to integrate or writing an HTTP client from scratch to interact with the fact-generating API.

Similarly, if I want to add a new row to a Google Spreadsheet, I simply use my pre-built code that handles sheet operations and appends the row to the table.

## What Underpins All Packages?

I couldn't have implemented all of this without the [Effect](https://effect.website/) library.

Currently, all packages depend on version ^3.10 of this library.

# What Is This

A monorepository for the following packages:

### AI
![NPM Version](https://img.shields.io/npm/v/@effect-ak/ai)<br>
Contains clients for interacting with the following vendors:
- OpenAI
- Anthropic
- Deepgram
- Stability AI

### Google API
![NPM Version](https://img.shields.io/npm/v/@effect-ak/google-api)<br>
- Service for working with Google Sheets
- Google Calendar
- Google Tasks
- Google Drive

### TG-Bot
![NPM Version](https://img.shields.io/npm/v/@effect-ak/tg-bot)<br>
- HTTP client for interacting with the Telegram Bot API
- Sending text messages, dice, documents, etc.
- Service for creating bots using a polling architecture. Bots can be run locally.