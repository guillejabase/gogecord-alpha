import GuildMember from '../structures/GuildMember.ts';
import Listener from '../structures/Listener.ts';

export default new Listener('GuildMemberAdd', (client, data) => {
    client.emit('GuildMemberAdd', client, new GuildMember(client, data, client.guilds.cache.get(data.guild_id)!));
});