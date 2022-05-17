import * as http from "http";
import * as fs from "fs";

fs.readFile("./index.html", function (err: any, html: any) {
  if (err) {
    throw err;
  }
  http
    .createServer(function (request: any, response: any) {
      response.writeHeader(200, { "Content-Type": "text/html" });
      response.write(html);
      response.end();
    })
    .listen(8000);
});

import DiscordJS, {
  Intents,
  MessageEmbed,
  TextChannel,
  Interaction,
  CommandInteraction,
} from "discord.js";
import dotenv from "dotenv";
import { floatRound } from "./util/floatRound";
import add from "./cmds/add";
import snipeEdit from "./cmds/snipe-edit";
import snipeDel from "./cmds/snipe-delete";
import kicky from "./cmds/kick";
import bany from "./cmds/ban";
import kickSlash from "./cmds/kick-slash";
import banSlash from "./cmds/ban-slash";
import purge from "./cmds/purge";
import { group } from "console";
import { ReadableStreamDefaultController } from "node:stream/web";

dotenv.config();

export const client = new DiscordJS.Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

export let prefix = "!";
export let themeColor = 0x3eaf7c;
export let botName = "Ash";

const auditId = "975585464276881448";

client.on("ready", () => {
  console.log("The bot is ready!");

  const guildId = "975543199856742430";
  const guild = client.guilds.cache.get(guildId);
  let commands;

  commands = guild ? guild.commands : client.application?.commands;

  commands?.create({
    name: "ping",
    description: "Replies with Ping!",
  });

  commands?.create({
    name: "add",
    description: "Adds two Numbers",
    options: [
      {
        name: "num1",
        description: "The first number to add",
        required: true,
        type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
      },
      {
        name: "num2",
        description: "The first number to add",
        required: true,
        type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
      },
    ],
  });

  commands?.create({
    name: "snipe",
    description: "Replys with last deleted/edit message.",
    options: [
      {
        name: "delete",
        description: "Replys with last deleted message.",
        type: 1,
      },
      {
        name: "edit",
        description: "Replys with last edit message.",
        type: 1,
      },
    ],
  });

  commands?.create({
    name: "kick",
    description: "Kicks a user",
    options: [
      {
        name: "user",
        description: "The user to kick",
        required: true,
        type: DiscordJS.Constants.ApplicationCommandOptionTypes.USER,
      },
      {
        name: "reason",
        description: "The reason for the kick",
        required: false,
        type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
      },
    ],
  });

  commands?.create({
    name: "ban",
    description: "Bans a user",
    options: [
      {
        name: "user",
        description: "The user to ban",
        required: true,
        type: DiscordJS.Constants.ApplicationCommandOptionTypes.USER,
      },
      {
        name: "reason",
        description: "The reason for the ban",
        required: false,
        type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
      },
    ],
  });

  commands?.create({
    name: "purge",
    description: "Purges a number of messages",
    options: [
      {
        name: "amount",
        description: "The number of messages to purge",
        required: true,
        type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
      },
    ],
  });
});

//slash - add
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === "ping") {
    await interaction.reply("Pong!");
  } else if (commandName === "add") {
    interaction.reply(
      add(
        [
          "",
          options.getNumber("num1")!.toString(),
          options.getNumber("num2")!.toString(),
        ],
        true
      )
    );
  } else if (commandName === "snipe") {
    if (options.getSubcommand() === "delete") {
      interaction.reply(snipeDel(delMessa));
    } else if (interaction.options.getSubcommand() === "edit") {
      interaction.reply(snipeEdit(oldMessa, newMessa));
    }
  } else if (commandName === "kick") {
    console.log(options);
    console.log(options.getUser("user")!);
    interaction.reply(
      await kickSlash(
        interaction,
        options.getUser("user")!,
        options.getString("reason")!
      )
    );
  } else if (commandName === "ban") {
    interaction.reply(
      await banSlash(
        interaction,
        options.getUser("user")!,
        options.getString("reason")!
      )
    );
  } else if (commandName === "purge") {
    let reply =
      (await purge(options.getNumber("amount")!, interaction, false)) ?? "";
    interaction.reply(reply);
    setTimeout(
      () => interaction.deleteReply().catch((e) => console.log(e)),
      5000
    );
  }
});

//Snipe CMD
let oldMessa: any;
let newMessa: any;
client.on("messageUpdate", (oldMessage, newMessage) => {
  oldMessa = oldMessage;
  newMessa = newMessage;

  console.log(oldMessage.content + " > " + newMessage.content);
  console.log(oldMessage.author);
  let embed = new MessageEmbed()
    .setColor(themeColor)
    .setTitle(botName + " - Message Edited")
    .setDescription(
      `**Message sent by <@${oldMessage.author!.id}> edited in ${
        oldMessage.channel
      }**\n`
    )
    .addField("Before", oldMessage!.content!)
    .addField("After", newMessage!.content!)
    .setTimestamp();
  const auditChannel = client.channels.cache.get(auditId) as TextChannel;
  auditChannel.send({ embeds: [embed] });
});

let delMess: string | null;
let delMessa: any;
client.on("messageDelete", (message) => {
  delMess = message.content;
  delMessa = message;
  console.log("Deleted: " + delMess);
  console.log(message.author);
  let embed = new MessageEmbed()
    .setColor(themeColor)
    .setTitle(botName + " - Message Deleted")
    .setDescription(
      `**Message sent by <@${message.author!.id}> deleted in ${
        message.channel
      }**\n${delMess}`
    )
    .setTimestamp();
  const auditChannel = client.channels.cache.get(auditId) as TextChannel;
  auditChannel.send({ embeds: [embed] });
});

//cmds

client.on("messageCreate", async (message) => {
  let messageCont = message.content.toLowerCase();
  if (messageCont.startsWith(prefix)) {
    let commandCont = messageCont.substring(prefix.length).split(" ");
    console.log(commandCont);
    if (commandCont[0] === "snipe") {
      //snipe cmds
      if (commandCont[1] === "edit") {
        //snipe edit cmd
        message.reply(snipeEdit(oldMessa, newMessa));
      } else {
        //snipe delete cmd
        message.reply(snipeDel(delMessa));
      }
    } else if (commandCont[0] === "add") {
      //add cmd
      message.reply(add(commandCont));
    } else if (commandCont[0] === "kick") {
      //kick cmd
      if (
        commandCont[1].startsWith("<@") &&
        commandCont[1].endsWith(">") &&
        commandCont[1].length >= 4
      ) {
        message.reply(await kicky(commandCont, message!)!);
      }
    } else if (commandCont[0] === "purge") {
      //purge cmd
      let amount = parseInt(commandCont[1]) || 1;
      let output = (await purge(amount, message)) ?? "";
      message.channel
        .send(output)
        .then((msg) => {
          setTimeout(() => msg.delete(), 5000);
        })
        .catch((error) => console.log(error));
    } else if (commandCont[0] === "ban") {
      //ban cmd
      if (
        commandCont[1].startsWith("<@") &&
        commandCont[1].endsWith(">") &&
        commandCont[1].length >= 4
      ) {
        message.reply(await bany(commandCont, message!)!);
      }
    }
  }
});

client.login(process.env["TOKEN"]);
