import { type GuildTextBasedChannel } from '../structures/GuildBaseChannel.ts';
import Listener from '../structures/Listener.ts';

export default new Listener('MessageDelete', (client, data) => {
    if (!data.guild_id) {
        return;
    }

    const guild = client.guilds.cache.get(data.guild_id)!;
    const channel = guild.channels.cache.get(data.channel_id)! as GuildTextBasedChannel;
    const message = channel.messages.cache.get(data.id)!;

    channel.messages.cache.delete(message.id);
    guild.channels.cache.set(channel.id, channel);
    client.guilds.cache.set(guild.id, guild);

    client.emit('MessageDelete', client, message);
});