import { MessageEmbed } from "discord.js";
import { botName, themeColor, prefix } from "../index";
import { floatRound } from "../util/floatRound";

export default function snipeEdit(oldmess: any, newmess: any) {
  let embed = new MessageEmbed()
    .setTitle(`${botName} - Snipe Edit`)
    .setColor(themeColor);
  if (!oldmess) {
    embed.setDescription("No edited message to snipe.");
  } else {
    embed.setDescription(
      `**Message by <@${oldmess.author.id}> was edited in ${oldmess.channel}**\n ${oldmess.content} > ${newmess.content}`
    );
  }

  return {
    embeds: [embed],
    allowedMentions: {
      users: [],
    },
  };
}
