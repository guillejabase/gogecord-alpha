import { type GuildTextBasedChannel } from '../structures/GuildBaseChannel';
import Listener from '../structures/Listener';
import Message from '../structures/Message';

export default new Listener('MessageUpdate', (client, data) => {
    if (!data.guild_id) {
        return;
    }

    const guild = client.guilds.cache.get(data.guild_id)!;
    const channel = guild.channels.cache.get(data.channel_id)! as GuildTextBasedChannel;

    client.emit('MessageUpdate', client, channel.messages.cache.get(data.id)!, new Message(client, data, guild));
});