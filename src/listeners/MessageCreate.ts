import Listener from '../structures/Listener.ts';
import Message from '../structures/Message.ts';

export default new Listener('MessageCreate', (client, data) => {
    if (!data.guild_id) {
        return;
    }

    client.emit('MessageCreate', client, new Message(client, data, client.guilds.cache.get(data.guild_id)!));
});