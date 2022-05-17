import { MessageEmbed } from "discord.js";
import { botName, themeColor, prefix } from "../index";
import { floatRound } from "../util/floatRound";

export default function add(args: string[], pingOnReply = false) {
  let embed = new MessageEmbed()
    .setTitle(`${botName} - Add`)
    .setColor(themeColor);

  if (isNaN(parseFloat(args[1])) || isNaN(parseFloat(args[2]))) {
    embed.setDescription(
      "Invalid Arguments. Use `" + prefix + "add <num1> <num2>`"
    );
  } else {
    embed.setDescription(
      "Sum: `" + floatRound(parseFloat(args[1]) + parseFloat(args[2])) + "`"
    );
  }
  if (!pingOnReply) {
    return {
      embeds: [embed],
      allowedMentions: {
        repliedUser: false,
      },
    };
  } else {
    return {
      embeds: [embed],
    };
  }
}
