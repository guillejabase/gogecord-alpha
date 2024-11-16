import type Client from '../structures/Client.ts';
import type Guild from '../structures/Guild.ts';

import Collection from '../util/Collection.ts';

export default class GuildManager {
    public cache = new Collection<string, Guild>();
    public unavailable = 0;

    constructor(private client: Client) {
        Object.defineProperty(this, 'client', { enumerable: false });
    }
}