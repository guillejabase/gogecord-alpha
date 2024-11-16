import Listener from '../structures/Listener.ts';
import Presence from '../structures/Presence.ts';

export default new Listener('PresenceUpdate', (client, data) => {
    const guild = client.guilds.cache.get(data.guild_id)!;
    const member = guild.members.cache.get(data.user.id)!;
    const oldPresence = member.presence;

    member.presence = new Presence(data);

    guild.members.cache.set(member.user.id, member);
    client.guilds.cache.set(guild.id, guild);

    client.emit('PresenceUpdate', client, oldPresence, member.presence);
});