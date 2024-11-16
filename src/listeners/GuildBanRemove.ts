import Listener from '../structures/Listener.ts';

export default new Listener('GuildBanRemove', (client, data) => {
    const guild = client.guilds.cache.get(data.guild_id)!;
    const ban = guild.bans.cache.get(data.user.id)!;

    guild.bans.cache.delete(ban.user.id);
    client.guilds.cache.set(guild.id, guild);

    client.emit('GuildBanRemove', client, ban);
});