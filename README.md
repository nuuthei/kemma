# kemma

An older project from 2021.

A very simple PubChem chemical database bot for Discord. Type '.chelp' for instructions.

Dependencies:

- node.js npm install:
    - (forever)*
    - request
    - discord.js

*Modules in closures are optional

First, add your Discord bot token into the 'config.json' file.

To run, use: forever start -o out.log -e err.log index.js

or

use: node index.js (WARNING! Does NOT auto-restart on error, for debugging only!)
