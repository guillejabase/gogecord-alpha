import Listener from '../structures/Listener.ts';

export default new Listener('GuildDelete', (client, data) => {
    const guild = client.guilds.cache.get(data.id)!;

    client.guilds.cache.delete(guild.id);

    client.emit('GuildDelete', client, guild);
});