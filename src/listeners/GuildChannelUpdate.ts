import GuildAnnouncementChannel from '../structures/GuildAnnouncementChannel.ts';
import { channelTypes, type GuildChannel } from '../structures/GuildBaseChannel.ts';
import GuildCategoryChannel from '../structures/GuildCategoryChannel.ts';
import GuildForumChannel from '../structures/GuildForumChannel.ts';
import GuildMediaChannel from '../structures/GuildMediaChannel.ts';
import GuildStageVoiceChannel from '../structures/GuildStageVoiceChannel.ts';
import GuildTextChannel from '../structures/GuildTextChannel.ts';
import GuildVoiceChannel from '../structures/GuildVoiceChannel.ts';
import Listener from '../structures/Listener.ts';

export default new Listener('GuildChannelUpdate', (client, data) => {
    if (!('guild_id' in data) || !data.guild_id) {
        return;
    }

    const guild = client.guilds.cache.get(data.guild_id)!;
    const oldChannel = guild.channels.cache.get(data.id)!;
    let newChannel: GuildChannel | undefined;

    switch (data.type) {
        case channelTypes.GuildText:
            newChannel = new GuildTextChannel(client, data, guild);
            break;
        case channelTypes.GuildVoice:
            newChannel = new GuildVoiceChannel(client, data, guild);
            break;
        case channelTypes.GuildCategory:
            newChannel = new GuildCategoryChannel(data, guild);
            break;
        case channelTypes.GuildAnnouncement:
            newChannel = new GuildAnnouncementChannel(client, data, guild);
            break;
        case channelTypes.GuildStageVoice:
            newChannel = new GuildStageVoiceChannel(client, data, guild);
            break;
        case channelTypes.GuildForum:
            newChannel = new GuildForumChannel(client, data, guild);
            break;
        case channelTypes.GuildMedia:
            newChannel = new GuildMediaChannel(client, data, guild);
            break;
    }

    if (!newChannel) {
        return;
    }

    guild.channels.cache.set(newChannel.id, newChannel);
    client.guilds.cache.set(guild.id, guild);

    client.emit('GuildChannelUpdate', client, oldChannel, newChannel);
});