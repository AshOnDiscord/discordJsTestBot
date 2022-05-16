import DiscordJS, {
  Intents,
  MessageEmbed,
  TextChannel,
  Interaction,
  CommandInteraction,
} from "discord.js";
import dotenv from "dotenv";
import { floatRound } from "./util/floatRound";
import { add } from "./cmds/add";

dotenv.config();

const client = new DiscordJS.Client({
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
    description: "Replies with Ping!",
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
  //guild!.commands.set([]);
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
  }
});

//Snipe CMD

let oldMess: string | null;
let newMess: string | null;
client.on("messageUpdate", (oldMessage, newMessage) => {
  oldMess = oldMessage.content;
  newMess = newMessage.content;
  console.log(oldMess + " > " + newMess);
  console.log(oldMessage.author);
  let embed = new MessageEmbed()
    .setColor(themeColor)
    .setTitle(botName + " - Message Edited")
    .setDescription(
      `**Message sent by <@${oldMessage.author!.id}> edited in ${
        oldMessage.channel
      }**\n`
    )
    .addField("Before", oldMess!)
    .addField("After", newMess!)
    .setTimestamp();
  const auditChannel = client.channels.cache.get(auditId) as TextChannel;
  auditChannel.send({ embeds: [embed] });
});

let delMess: string | null;
client.on("messageDelete", (message) => {
  delMess = message.content;
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

client.on("messageCreate", (message) => {
  let messageCont = message.content.toLowerCase();
  if (messageCont.startsWith(prefix)) {
    let commandCont = messageCont.substring(prefix.length).split(" ");
    if (commandCont[0] === "snipe") {
      if (commandCont[1] === "edit") {
        message.reply(
          "The last edited message was: " + oldMess + " > " + newMess
        );
      } else {
        message.reply("The last deleted message was: " + delMess);
      }
    } else if (commandCont[0] === "add") {
      //prefix - add
      message.reply(add(commandCont));
    }
  }
});

client.login(process.env.TOKEN);
