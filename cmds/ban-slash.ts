import DiscordJS, {
  MessageEmbed,
  TextChannel,
  Interaction,
  CommandInteraction,
  Permissions,
} from "discord.js";
import { client, themeColor, botName } from "../index";

export default async function banSlash(
  interaction: any,
  target: any,
  reason: string
) {
  console.log(target.id);
  if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
    let noPerms = {
      title: `${botName} - Ban`,
      color: themeColor,
      description: "You do not have permission to use this command.",
    };
    return { embeds: [noPerms] };
  }
  if (reason === null) reason = "No reason given.";
  let banUID = target;
  let guild = await client.guilds.fetch(interaction.guild!.id).then((guild) => {
    return guild;
  });
  console.log(guild.members.cache.get(banUID.id)!.bannable);
  if (guild.members.cache.get(banUID.id)!.bannable) {
    let banMessage = {
      title: `${botName} - Ban`,
      description:
        `<@${banUID.id}> has been banned from ` +
        "`" +
        interaction.guild.name +
        "`" +
        ` by <@${interaction.member.id}> for the following reason: ` +
        "`" +
        reason +
        "`",
      color: themeColor,
    };
    let banDM = {
      title: `${botName} - Banned`,
      description:
        `You have been banned from ` +
        "`" +
        interaction.guild.name +
        "`" +
        ` by <@${interaction.member.id}> for the following reason: ` +
        "`" +
        reason +
        "`",
      color: themeColor,
    };
    guild.members.cache.get(banUID.id)!.send({ embeds: [banDM] });
    guild.members.cache.get(banUID.id)!.ban({ reason: reason });
    console.log("Banned " + banUID.id);
    return { embeds: [banMessage] };
  } else {
    return "Error, check if bot can ban this user.";
  }
}
