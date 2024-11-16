import GuildAnnouncementChannel from '../structures/GuildAnnouncementChannel.ts';
import { channelTypes, type GuildChannel } from '../structures/GuildBaseChannel.ts';
import GuildCategoryChannel from '../structures/GuildCategoryChannel.ts';
import GuildForumChannel from '../structures/GuildForumChannel.ts';
import GuildMediaChannel from '../structures/GuildMediaChannel.ts';
import GuildStageVoiceChannel from '../structures/GuildStageVoiceChannel.ts';
import GuildTextChannel from '../structures/GuildTextChannel.ts';
import GuildVoiceChannel from '../structures/GuildVoiceChannel.ts';
import Listener from '../structures/Listener.ts';

export default new Listener('GuildChannelCreate', (client, data) => {
    if (!('guild_id' in data) || !data.guild_id) {
        return;
    }

    const guild = client.guilds.cache.get(data.guild_id)!;
    let channel: GuildChannel | undefined;

    switch (data.type) {
        case channelTypes.GuildText:
            channel = new GuildTextChannel(client, data, guild);
            break;
        case channelTypes.GuildVoice:
            channel = new GuildVoiceChannel(client, data, guild);
            break;
        case channelTypes.GuildCategory:
            channel = new GuildCategoryChannel(data, guild);
            break;
        case channelTypes.GuildAnnouncement:
            channel = new GuildAnnouncementChannel(client, data, guild);
            break;
        case channelTypes.GuildStageVoice:
            channel = new GuildStageVoiceChannel(client, data, guild);
            break;
        case channelTypes.GuildForum:
            channel = new GuildForumChannel(client, data, guild);
            break;
        case channelTypes.GuildMedia:
            channel = new GuildMediaChannel(client, data, guild);
            break;
    }

    if (!channel) {
        return;
    }

    guild.channels.cache.set(channel.id, channel);
    client.guilds.cache.set(guild.id, guild);

    client.emit('GuildChannelCreate', client, channel);
});