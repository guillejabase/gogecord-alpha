import Listener from '../structures/Listener.ts';
import Guild from '../structures/Guild.ts';

export default new Listener('GuildCreate', (client, data) => {
    client.guilds.unavailable -= 1;
    client.emit('GuildCreate', client, new Guild(client, data));

    if (client.guilds.unavailable > 0 && client.ready.timestamp) {
        return;
    }

    const ready = Date.now();
    client.ready = {
        at: new Date(ready),
        timestamp: ready
    };

    client.emit('Ready', client);
});