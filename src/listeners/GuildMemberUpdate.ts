import GuildMember from '../structures/GuildMember.ts';
import Listener from '../structures/Listener.ts';

export default new Listener('GuildMemberUpdate', (client, data) => {
    const guild = client.guilds.cache.get(data.guild_id)!;
    const oldMember = guild.members.cache.get(data.user.id)!;

    client.emit('GuildMemberUpdate', client, oldMember, new GuildMember(client, {
        ...data,
        presence: oldMember.presence
    }, guild));
});