import GuildRole from '../structures/GuildRole.ts';
import Listener from '../structures/Listener.ts';

export default new Listener('GuildRoleUpdate', (client, data) => {
    const guild = client.guilds.cache.get(data.guild_id)!;
    const oldRole = guild.roles.cache.get(data.role.id)!;

    client.emit('GuildRoleUpdate', client, oldRole, new GuildRole(client, data.role, guild));
});