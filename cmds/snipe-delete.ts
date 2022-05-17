import { MessageEmbed } from "discord.js";
import { botName, themeColor, prefix } from "../index";
import { floatRound } from "../util/floatRound";

export default function snipeDel(delmess: any) {
  let embed = new MessageEmbed()
    .setTitle(`${botName} - Snipe Delete`)
    .setColor(themeColor);
  if (!delmess) {
    embed.setDescription("No deleted message to snipe.");
  } else {
    embed.setDescription(
      `**Message by <@${delmess.author.id}> was deleted in ${delmess.channel}**\n ${delmess.content}`
    );
  }
  return {
    embeds: [embed],
    allowedMentions: {
      users: [],
    },
  };
}
