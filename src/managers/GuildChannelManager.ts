import type Client from '../structures/Client.ts';
import type Guild from '../structures/Guild.ts';
import { type GuildChannel } from '../structures/GuildBaseChannel.ts';

import Collection from '../util/Collection.ts';

export default class GuildChannelManager {
    public cache = new Collection<string, GuildChannel>();

    constructor(private client: Client, private guild: Guild) {
        Object.defineProperty(this, 'client', { enumerable: false });
    }

    // create, delete, edit...
}