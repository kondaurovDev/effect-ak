#!/usr/bin/env node

import { generateAll } from "./core/main.js";

generateAll().then(() => console.info("Done"));
