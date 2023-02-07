const fs = require('fs');
const https = require('https');
  
const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const { prefix, token } = require('./config.json');
const { request } = require('https');
const { hostname } = require('os');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Discord.Collection();

client.on('message', message => {

  function addZero(i) { // makes 1:00 look like 01:00, aesthetics.
      if (i < 10) {
          i = "0" + i;
      }
      return i;
  }

  var day = new Date().getUTCDate(); // UTC Day
  var month = new Date().getUTCMonth(); // UTC Month
  var year = new Date().getUTCFullYear(); // UTC Year
  var hour = addZero(new Date().getUTCHours()); // UTC Hour
  var minute = addZero(new Date().getUTCMinutes()); // UTC Minutes
  
  console.log(`[${hour}:${minute}] [${day}.${month + 1}.${year}] ${message.author.tag}: "${message.content}"`); // Logs every discord message on the server.

  if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

    if(message.content.startsWith(`${prefix}cping`)) { // Ping!
        message.channel.send('Pong!');
    }

    // Kemma features:

    // API URL: https://pubchem.ncbi.nlm.nih.gov/rest/pug/

    if (message.content.startsWith(`${prefix}kemma`)) {
        const embed = new Discord.MessageEmbed()
        .setTitle('Kemma...')
        .setImage(url = 'https://i.imgur.com/8CgrZkK.png')
        .setColor('#0074e4ff')
        .addFields(
            {name: '...what is it, exactly?',
            value:"Kemma is a chemical informatics bot designed to supplement, and in parts fulfill, the role of traditional chemistry spreadsheets, such as the MAOL.\n \nBrowsing through traditional spreadsheets can be cumbersome and counter-intuitive, which is why Kemma strives to make work much more efficient.\n \nKemma has built-in commands for graphical structural formulas, molecular weight, molecular formulas among many other features.\n \nThe list of available commands can be accessed using `.chelp`"}
        )
        message.channel.send(embed);

    }

    if (message.content.startsWith(`${prefix}chelp`)) {
      const embed = new Discord.MessageEmbed()
              .setTitle(`List of all Kemma commands`)
              .setColor('#0074e4ff')
              .addFields(
                  {name: 'Commands:',
                  value:`**.cinfo [name]:** a generalized analysis box of a compound\n \n**.cformula [name]:** chemical formula of a compound\n \n**.cmolecularweight [name]:** molecular weight of a compound\n \n**.ciupac [name]:** the IUPAC name for a compound\n \n**.cimage [name]:** structural formula of a compound\n \n**.csmiles [name]:** custom SMILES input to analysis box\n \n**[name] structure:** compound-name. For example, "carbon-monoxide", not "carbonmonoxide" or "carbon monoxide"`})
      message.channel.send(embed);
    }


    if (message.content.startsWith(`${prefix}cinfo`)) {

      var str = message.content.slice(7, message.content.length)
      var realStr = str.replace(/\s/g, '')

      var options = {
        hostname: 'pubchem.ncbi.nlm.nih.gov',
        port: 443,
        path: `/rest/pug/compound/name/${realStr}/property/IUPACName,MolecularFormula,MolecularWeight/JSON`,
        method: 'GET'
      }

      const req = https.request(options, res => {
          console.log(`[${hour}:${minute}] [${day}.${month + 1}.${year}] ${message.author.tag} GET:`)
          console.log(`statusCode: ${res.statusCode}`)
          
          res.on('data', function(chunk) {
            if (res.statusCode != 404) {
              const data = JSON.parse(chunk)
              let compound = JSON.stringify(data)
              
              const compoundObj = JSON.parse(compound)

              const embed = new Discord.MessageEmbed()
              .setTitle(`${str}`)
              .setImage(url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${realStr}/PNG`)
              .setColor('#0074e4ff')
              .addFields(
                  {name: 'Information:',
                  value:`**IUPAC name:** ${compoundObj.PropertyTable.Properties[0].IUPACName}\n \n**Formula:** ${compoundObj.PropertyTable.Properties[0].MolecularFormula}\n \n**Molecular weight:** ${compoundObj.PropertyTable.Properties[0].MolecularWeight}`}
        )
              message.channel.send(embed);

            } else {
              const embed = new Discord.MessageEmbed()
                .setTitle(`This molecule doesn't seem to exist. Check spelling!`)
                .setColor('#0074e4ff')
                message.channel.send(embed);
            }
          })

        })
        
        req.on('error', error => {
          console.error(error)
        })
        

        req.end()
    }

    if (message.content.startsWith(`${prefix}csmiles`)) { // Smiles to compound.

      var str = message.content.slice(9, message.content.length)
      var realStr = str.replace(/\s/g, '')

      var options = {
        hostname: 'pubchem.ncbi.nlm.nih.gov',
        port: 443,
        path: `/rest/pug/compound/SMILES/${realStr}/property/IUPACName,MolecularFormula,MolecularWeight/JSON`,
        method: 'GET'
      }

      const req = https.request(options, res => {
          console.log(`[${hour}:${minute}] [${day}.${month + 1}.${year}] ${message.author.tag} GET:`)
          console.log(`statusCode: ${res.statusCode}`)
          
          res.on('data', function(chunk) {
            if (res.statusCode != 404) {
              const data = JSON.parse(chunk)
              let compound = JSON.stringify(data)
              
              const compoundObj = JSON.parse(compound)

              const embed = new Discord.MessageEmbed()
              .setTitle(`Custom SMILES input: ${realStr}`)
              .setImage(url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/SMILES/${realStr}/PNG`)
              .setColor('#0074e4ff')
              .addFields(
                  {name: 'Information:',
                  value:`**IUPAC name:** ${compoundObj.PropertyTable.Properties[0].IUPACName}\n \n**Formula:** ${compoundObj.PropertyTable.Properties[0].MolecularFormula}\n \n**Molecular weight:** ${compoundObj.PropertyTable.Properties[0].MolecularWeight}`}
        )
              message.channel.send(embed);

            } else {
              const embed = new Discord.MessageEmbed()
                .setTitle(`This molecule doesn't seem to exist. Check spelling!`)
                .setColor('#0074e4ff')
                message.channel.send(embed);
            }
          })

        })
        
        req.on('error', error => {
          console.error(error)
        })
        

        req.end()
    }

    if (message.content.startsWith(`${prefix}cimage`)) { // Structural formula of compound.

      var str = message.content.slice(8, message.content.length)
      var realStr = str.replace(/\s/g, '')

      var options = {
          hostname: 'pubchem.ncbi.nlm.nih.gov',
          port: 443,
          path: `/rest/pug/compound/name/${realStr}/PNG`,
          method: 'GET'
        }

      const req = https.request(options, res => {
          console.log(`[${hour}:${minute}] [${day}.${month + 1}.${year}] ${message.author.tag} GET:`)
          console.log(`statusCode: ${res.statusCode}`)
          
          res.on('data', d => {
            if (res.statusCode != 404) {
              message.channel.send(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${realStr}/PNG`)
            } else {
              const embed = new Discord.MessageEmbed()
                .setTitle(`This molecule doesn't seem to exist. Check spelling!`)
                .setColor('#0074e4ff')
                message.channel.send(embed);
            }
          })

        })
        
        req.on('error', error => {
          console.error(error)
        })
        

        req.end()
    }

    if (message.content.startsWith(`${prefix}cmolecularweight`)) { // Molecular weight of compound.

      var str = message.content.slice(18, message.content.length)
      var realStr = str.replace(/\s/g, '')

      var options = {
          hostname: 'pubchem.ncbi.nlm.nih.gov',
          port: 443,
          path: `/rest/pug/compound/name/${realStr}/property/MolecularWeight/TXT`,
          method: 'GET'
        }

      const req = https.request(options, res => {
          console.log(`[${hour}:${minute}] [${day}.${month + 1}.${year}] ${message.author.tag} GET:`)
          console.log(`statusCode: ${res.statusCode}`)
          
          res.on('data', d => {
            if (res.statusCode != 404) {
              const embed = new Discord.MessageEmbed()
              .setTitle(`Molecular weight of ${realStr}: ${d}`)
              .setColor('#0074e4ff')
              message.channel.send(embed);
            } else {
              const embed = new Discord.MessageEmbed()
                .setTitle(`This molecule doesn't seem to exist. Check spelling!`)
                .setColor('#0074e4ff')
                message.channel.send(embed);
            }
          })

        })
        
        req.on('error', error => {
          console.error(error)
          message.channel.send(`This molecule doesn't seem to exist. Check spelling!`)
        })
        

        req.end()

    }

    if (message.content.startsWith(`${prefix}ciupac`)) { // IUPAC name for compound.

      var str = message.content.slice(8, message.content.length)
      var realStr = str.replace(/\s/g, '')

      var options = {
          hostname: 'pubchem.ncbi.nlm.nih.gov',
          port: 443,
          path: `/rest/pug/compound/name/${realStr}/property/IUPACName/TXT`,
          method: 'GET'
        }

      const req = https.request(options, res => {
          console.log(`[${hour}:${minute}] [${day}.${month + 1}.${year}] ${message.author.tag} GET:`)
          console.log(`statusCode: ${res.statusCode}`)
          
          res.on('data', d => {
            if (res.statusCode != 404) {
              const embed = new Discord.MessageEmbed()
              .setTitle(`IUPAC name of ${realStr}: ${d}`)
              .setColor('#0074e4ff')
              message.channel.send(embed);
            } else {
              const embed = new Discord.MessageEmbed()
                .setTitle(`This molecule doesn't seem to exist. Check spelling!`)
                .setColor('#0074e4ff')
                message.channel.send(embed);
            }
          })

        })
        
        req.on('error', error => {
          console.error(error)
        })
        

        req.end()

    }

    if (message.content.startsWith(`${prefix}cformula`)) { // Chemical formula of compound.

      var str = message.content.slice(10, message.content.length)
      var realStr = str.replace(/\s/g, '')

      var options = {
          hostname: 'pubchem.ncbi.nlm.nih.gov',
          port: 443,
          path: `/rest/pug/compound/name/${realStr}/property/MolecularFormula/TXT`,
          method: 'GET'
        }

      const req = https.request(options, res => {
          console.log(`[${hour}:${minute}] [${day}.${month + 1}.${year}] ${message.author.tag} GET:`)
          console.log(`statusCode: ${res.statusCode}`)
          
          res.on('data', d => {
              if (res.statusCode != 404) {
                const embed = new Discord.MessageEmbed()
                .setTitle(`Molecular formula of ${realStr}: ${d}`)
                .setColor('#0074e4ff')
                message.channel.send(embed);
              } else {
                const embed = new Discord.MessageEmbed()
                .setTitle(`This molecule doesn't seem to exist. Check spelling!`)
                .setColor('#0074e4ff')
                message.channel.send(embed);
              }
              
          })

        })
        
        req.on('error', error => {
          console.error(error)
        })
        

        req.end()

    }
    
});

client.on('ready', () => {

    function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    var day = new Date().getUTCDate(); // UTC Day
    var month = new Date().getUTCMonth(); // UTC Month
    var year = new Date().getUTCFullYear(); // UTC Year
    var hour = addZero(new Date().getUTCHours()); // UTC Hour
    var minute = addZero(new Date().getUTCMinutes()); // UTC Minutes
    var d = new Date();
    var weekday = new Array(7);
    weekday[0] = "Sunday"; 
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    var n = weekday[d.getDay()];


    console.log(`Logged in at ${hour}:${minute} UTC on ${n} ${day}.${month + 1}.${year}!`);
   
});



client.login(token);
