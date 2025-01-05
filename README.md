# Motivation

I adhere to the "write once, use everywhere" principle, enabling the creation of flexible and reusable solutions. Instead of diving into API details or building unique components for each task, I develop universal modules that can be integrated into various projects.

For example, when creating a Telegram bot, I focus on developing the core logic of the bot using pre-built functions to interact with the Telegram API. This allows me to quickly add new commands, such as `/typescript-fact`, which generate interesting facts about TypeScript using an LLM model without the need to write repetitive code for handling requests.

Similarly, for working with Google Spreadsheets, I utilize a common module for table operations that makes it easy to add new rows or manage data without creating new code for interacting with the Google Sheets API each time.

This approach enhances development efficiency, simplifies project maintenance, and allows for rapid scalability of functionality without unnecessary time and resource expenditures.

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
