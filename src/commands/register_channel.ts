import { ActionRowBuilder, CommandInteraction, MessageActionRowComponentBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction } from "discord.js";
import { Discord, Guild, SelectMenuComponent, Slash } from "discordx";

//TODO: Move it away
const menuIds = {
  voiceChannelId: "voice-channels-menu"
}

@Discord()
export class RegisterChannel {
  @SelectMenuComponent({ id: menuIds.voiceChannelId })
  async handleRegisterChannel(interaction: StringSelectMenuInteraction): Promise<void> {
    await interaction.deferReply();
    const voiceChannelId = interaction.values[0];
    //TODO: Save it somewhere

    // if value not found
    if (!voiceChannelId) {
      await interaction.followUp("Invalid ServerId, choose again")
        .then((message) => console.log(`Reply sent with content ${message.content}`))
        .catch(console.error);
      return;
    }

    var allChannels = await interaction.guild?.channels.fetch()
    var kek = allChannels?.get(voiceChannelId)?.name

    await interaction.followUp(
      `You have selected VoiceChannel: ${allChannels?.get(voiceChannelId)?.name ?? "[Unable to fetch data"} with ID: ${voiceChannelId}`,
    );

    return;
  }

  @Slash({ description: "Registers voice channel to get data from", name: "register-channel" })
  async registerChannel(interaction: CommandInteraction): Promise<unknown> {
    await interaction.deferReply();
    const { guild } = interaction

    if (!guild) {
      await interaction.followUp({ content: 'Guild not Found', fetchReply: true })
        .then((message) => console.log(`Reply sent with content ${message.content}`))
        .catch(console.error);

      return;
    }

    var voiceChannels = await guild.channels.fetch()
    if (!voiceChannels) {
      await interaction.followUp({ content: 'Voice Channels not Found', fetchReply: true })
        .then((message) => console.log(`Reply sent with content ${message.content}`))
        .catch(console.error);

      return;
    }

    var channels = voiceChannels.map(voiceChannel => {
      if (voiceChannel)
        if (voiceChannel.isVoiceBased() && voiceChannel.name && voiceChannel.id)
          return { label: voiceChannel.name, value: voiceChannel.id }
      return { label: "", value: "" }
    }).filter(channel => channel.label && channel.value)

    if (!channels.length) {
      await interaction.followUp({ content: 'No Voice Channels', fetchReply: true })
        .then((message) => console.log(`Reply sent with content ${message.content}`))
        .catch(console.error);

      return;
    }

    const menu = new StringSelectMenuBuilder()
      .addOptions(channels)
      .setCustomId(menuIds.voiceChannelId)

    const buttonRow =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        menu,
      );

    await interaction.editReply({
      components: [buttonRow],
      content: "Please, select channel to register:"
    });

    return;
  }
}