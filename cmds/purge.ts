import { MessageEmbed } from "discord.js";
import { botName, themeColor, prefix } from "../index";

export default async function purge(
  amount: number,
  message: any,
  isMessage = true
) {
  if (amount > 100) amount = 100;
  if (message.channel.type !== "GUILD_TEXT") return;
  let messagesInChannel;
  message.channel.messages.fetch({ limit: 1 }).then((messages: any) => {
    messagesInChannel = messages.size;
  });
  if (messagesInChannel === 0) return;
  if (isMessage) await message.delete();
  const { size } = await message.channel.bulkDelete(amount, true);

  let embed = {
    title: `${botName} - Purge`,
    description: `Purged ${size} messages.`,
    color: themeColor,
  };
  return { embeds: [embed] };
}
