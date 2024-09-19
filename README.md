# EFKIT: Effect-based Wrappers for Popular Services

## Overview

EFKIT is a monorepo containing a collection of [Effect](https://effect.website/)-based wrappers for various popular services and APIs. The primary motivation behind this project is to provide ready-to-use, type-safe, and composable abstractions for commonly used services in different projects.

## Motivation

As developers, we often find ourselves rewriting similar integration code across different projects. EFKIT aims to solve this problem by offering a set of reusable wrappers built on top of the Effect library. This approach allows for:

- Consistent API usage across different services
- Type-safe interactions with external APIs
- Improved testability and maintainability of code
- Reduced boilerplate in project setup

## Features

- Google services wrapper: Includes Calendar integration for adding and managing events
- ChatGPT API wrapper: Interact with OpenAI's ChatGPT seamlessly
- Claude AI integration: Utilize Anthropic's Claude AI in your projects
- Notion API wrapper: Interact with Notion databases and pages
- Telegram Bot API: Build Telegram bots without dealing with low-level API details
- Shared utilities: Common functions and tools used across different integrations
- ... (other packages to be added)

Each package in this monorepo is designed to provide a convenient, Effect-based interface to these services, allowing for easy integration into your TypeScript projects running on Node.js.
