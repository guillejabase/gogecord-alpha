import Listener from '../structures/Listener.ts';

export default new Listener('GuildChannelDelete', (client, data) => {
    if (!('guild_id' in data) || !data.guild_id) {
        return;
    }

    const guild = client.guilds.cache.get(data.guild_id)!;
    const channel = guild.channels.cache.get(data.id);

    if (!channel) {
        return;
    }

    guild.channels.cache.delete(channel.id);
    client.guilds.cache.set(guild.id, guild);

    client.emit('GuildChannelDelete', client, channel);
});