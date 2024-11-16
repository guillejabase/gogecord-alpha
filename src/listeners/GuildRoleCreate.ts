import GuildRole from '../structures/GuildRole.ts';
import Listener from '../structures/Listener.ts';

export default new Listener('GuildRoleCreate', (client, data) => {
    client.emit('GuildRoleCreate', client, new GuildRole(client, data.role, client.guilds.cache.get(data.guild_id)!));
});