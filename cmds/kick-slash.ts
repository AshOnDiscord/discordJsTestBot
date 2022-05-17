import DiscordJS, {
  MessageEmbed,
  TextChannel,
  Interaction,
  CommandInteraction,
  Permissions,
} from "discord.js";
import { client, themeColor, botName } from "../index";

export default async function kickSlash(
  interaction: any,
  target: any,
  reason: string
) {
  console.log(target.id);
  if (!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
    let noPerms = {
      title: `${botName} - Kick`,
      color: themeColor,
      description: "You do not have permission to use this command.",
    };
    return { embeds: [noPerms] };
  }
  if (reason === null) reason = "No reason given.";
  let kickUID = target;
  let guild = await client.guilds.fetch(interaction.guild!.id).then((guild) => {
    return guild;
  });
  console.log(guild.members.cache.get(kickUID.id)!.kickable);
  if (guild.members.cache.get(kickUID.id)!.kickable) {
    let kickMessage = {
      title: `${botName} - Kick`,
      description:
        `<@${kickUID.id}> has been kicked from ` +
        "`" +
        interaction.guild.name +
        "`" +
        ` by <@${interaction.member.id}> for the following reason: ` +
        "`" +
        reason +
        "`",
      color: themeColor,
    };
    let kickDM = {
      title: `${botName} - Kicked`,
      description:
        `You have been kicked from ` +
        "`" +
        interaction.guild.name +
        "`" +
        ` by <@${interaction.member.id}> for the following reason: ` +
        "`" +
        reason +
        "`",
      color: themeColor,
    };
    guild.members.cache.get(kickUID.id)!.send({ embeds: [kickDM] });
    guild.members.cache.get(kickUID.id)!.kick(reason);
    console.log("Kicked " + kickUID.id);
    return { embeds: [kickMessage] };
  } else {
    return "Error, check if bot can kick this user.";
  }
}
