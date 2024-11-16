import Listener from '../structures/Listener.ts';

export default new Listener('GuildRoleDelete', (client, data) => {
    const guild = client.guilds.cache.get(data.guild_id)!;
    const role = guild.roles.cache.get(data.role_id)!;

    guild.roles.cache.delete(role.id);
    client.guilds.cache.set(guild.id, guild);

    client.emit('GuildRoleDelete', client, role);
});