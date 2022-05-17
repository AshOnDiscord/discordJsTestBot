import DiscordJS, {
  MessageEmbed,
  TextChannel,
  Interaction,
  CommandInteraction,
  Permissions,
} from "discord.js";
import { client, themeColor, botName } from "../index";

export default async function kicky(commandCont: string[], message: any) {
  if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
    let noPerms = {
      title: `${botName} - Kick`,
      color: themeColor,
      description: "You do not have permission to use this command.",
    };
    return { embeds: [noPerms] };
  }
  let kickUID = commandCont[1].slice(2, -1);
  let reason = commandCont;
  reason.shift();
  reason.shift();
  if (reason.join("") === "") reason = ["No reason given."];
  if (message.mentions.users.first()) {
    if (message.mentions.users.first()!.id === kickUID) {
      let guild = await client.guilds.fetch(message.guild!.id).then((guild) => {
        return guild;
      });
      if (guild.members.cache.get(kickUID)!.kickable) {
        let kickMessage = {
          title: `${botName} - Kick`,
          description:
            `<@${kickUID}> has been kicked from ` +
            "`" +
            message.guild.name +
            "`" +
            ` by <@${message.author.id}> for the following reason: ` +
            "`" +
            reason.join(" ") +
            "`",
          color: themeColor,
        };
        let kickDM = {
          title: `${botName} - Kicked`,
          description:
            `You have been kicked from ` +
            "`" +
            message.guild.name +
            "`" +
            ` by <@${message.author.id}> for the following reason: ` +
            "`" +
            reason.join(" ") +
            "`",
          color: themeColor,
        };
        guild.members.cache.get(kickUID)!.send({ embeds: [kickDM] });
        guild.members.cache.get(kickUID)!.kick(reason.join(" "));
        console.log("Kicked " + kickUID);
        return { embeds: [kickMessage] };
      } else {
        return "Error, check if bot can kick this user.";
      }
    }
  } else {
    let invalidUser = {
      title: `${botName} - Kicked`,
      description:
        `Invalid user, check if the user is in ` +
        "`" +
        message.guild.name +
        "`",
      color: themeColor,
    };
    return { embeds: [invalidUser] };
  }
  return "yo tf";
}
