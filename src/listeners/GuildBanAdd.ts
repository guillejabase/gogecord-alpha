import { Routes, type APIBan } from 'discord-api-types/v10';
import Listener from '../structures/Listener.ts';
import GuildBan from '../structures/GuildBan.ts';

export default new Listener('GuildBanAdd', (client, data) => {
    const guild = client.guilds.cache.get(data.guild_id)!;

    client.request({
        method: 'get',
        path: Routes.guildBan(guild.id, data.user.id)
    }).then((response: APIBan) => {
        client.emit('GuildBanAdd', client, new GuildBan(client, response, guild));
    });
});