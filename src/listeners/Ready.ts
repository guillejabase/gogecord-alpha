import Listener from '../structures/Listener.ts';

export default new Listener('Ready', (client, data) => {
    client.guilds.unavailable = data.guilds.length;

    if (client.intents.has('Guilds') && client.guilds.unavailable > 0) {
        return;
    }

    const ready = Date.now();
    client.ready = {
        at: new Date(ready),
        timestamp: ready
    };

    client.emit('Ready', client);
});