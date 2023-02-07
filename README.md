# kemma

A very simple PubChem chemical database bot for Discord.

Dependencies:

- node.js npm install:
    - (forever)*
    - request
    - discord.js

*Modules in closures are optional

To run, use: forever start -o out.log -e err.log index.js

or

use: node index.js (WARNING! Does NOT auto-restart on error, for debugging only!)
