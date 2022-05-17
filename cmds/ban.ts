import DiscordJS, {
  MessageEmbed,
  TextChannel,
  Interaction,
  CommandInteraction,
  Permissions,
} from "discord.js";
import { client, themeColor, botName } from "../index";

export default async function bany(commandCont: string[], message: any) {
  if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
    let noPerms = {
      title: `${botName} - Ban`,
      color: themeColor,
      description: "You do not have permission to use this command.",
    };
    return { embeds: [noPerms] };
  }
  let banUID = commandCont[1].slice(2, -1);
  let reason = commandCont;
  reason.shift();
  reason.shift();
  if (reason.join("") === "") reason = ["No reason given."];
  console.log(reason);
  if (message.mentions.users.first()) {
    if (message.mentions.users.first()!.id === banUID) {
      let guild = await client.guilds.fetch(message.guild!.id).then((guild) => {
        return guild;
      });
      if (guild.members.cache.get(banUID)!.bannable) {
        let banMessage = {
          title: `${botName} - Ban`,
          description:
            `<@${banUID}> has been banned from ` +
            "`" +
            message.guild.name +
            "`" +
            ` by <@${message.author.id}> for the following reason: ` +
            "`" +
            reason.join(" ") +
            "`",
          color: themeColor,
        };
        let banDM = {
          title: `${botName} - Banned`,
          description:
            `You have been banned from ` +
            "`" +
            message.guild.name +
            "`" +
            ` by <@${message.author.id}> for the following reason: ` +
            "`" +
            reason.join(" ") +
            "`",
          color: themeColor,
        };
        guild.members.cache.get(banUID)!.send({ embeds: [banDM] });
        guild.members.cache.get(banUID)!.ban({ reason: reason.join(" ") });
        console.log("Banned " + banUID);
        return { embeds: [banMessage] };
      } else {
        return "Error, check if bot can ban this user.";
      }
    }
  } else {
    let invalidUser = {
      title: `${botName} - Banned`,
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
