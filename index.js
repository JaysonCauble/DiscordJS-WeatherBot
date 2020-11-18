const Discord = require('discord.js');
var weather = require('weather-gov-api');
const token = process.env.DISCORD_TOKEN;
//The prefix used when calling commands. This can be changed to anything else.
const prefix = "!";

const client = new Discord.Client();

//Winthrop's lat and long stored as a variable for easy changing by me
const lat = 34.9407341;
const long = -81.0333383;

client.once('ready', () => {
    console.log(client.user);
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
    //If the message isn't a command or if its from the bot, do nothing.
	if (!message.content.startsWith(prefix) || message.author.bot) return;

    //This splits the command into an array but removes the prefix from the string
    const args = message.content.slice(prefix.length).trim().split(' ');
    //This removes the command from the args array and makes it its own variable.
    const command = args.shift().toLowerCase();

    if (command === "weather" || command === "temperature") {
            weather.getForecast('default', lat, long)
            .then(data => {
                let reply = new Discord.MessageEmbed();
                let periods = data.data.properties.periods;
                if (command === "weather" && args[0] === "tomorrow") {
                    reply.setTitle(`Forecast`);
                    if (periods[0].name == "Tonight") {
                        //If its tonight, return the forecast of the next element in the JSON.
                        reply.addField("Tomorrow", periods[1].detailedForecast);
                    } else {
                        //If its still during the day, skip today and tonight, and return the third forecast.
                        reply.addField("Tomorrow", periods[2].detailedForecast);
                    }
            } else if (command === "weather") {
                reply.setTitle('Forecast')
                if (periods[0].name == "Tonight") {
                    reply.addField("Tonight", periods[0].detailedForecast);
                } else {
                    reply.addField("Today", periods[0].detailedForecast);
                }
            } else if (command === "temperature" && args[0] === "tomorrow") {
                reply.setTitle("Temperatures");
                if (periods[0].name == "Tonight") {
                    reply.addField("Tomorrow", `A high of ${periods[1].temperature} with a low of ${periods[2].temperature}.`)
                } else {
                    reply.addField("Tomorrow", `A high of ${periods[2].temperature} with a low of ${periods[3].temperature}.`);
                }
            } else if (command === "temperature") {
                reply.setTitle("Temperatures");
                if (periods[0].name == "Tonight") {
                    reply.addField("Tonight", `A low of ${periods[0].temperature}.`);
                } else {
                    reply.addField("Today", `A high of ${periods[0].temperature} with a low of ${periods[1].temperature}.`);
                }
            }
            //Sends the message to the channel/chat that the bot was called in.
            //For example, if I called the bot in #general in "Test Server", the bot will send the message to #general in "Test Server"
            message.channel.send(reply);
            })
            .catch(err => console.log(err))
        }
});

client.login(token);