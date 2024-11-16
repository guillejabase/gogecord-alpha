import { type APIGuildMediaChannel } from 'discord-api-types/v10';

import type Client from './Client.ts';
import type Guild from './Guild.ts';
import GuildTextBasedChannel from './GuildTextBasedChannel.ts';

export default class GuildMediaChannel extends GuildTextBasedChannel {
    public topic?: string;
    public readonly type = 'GuildMedia';

    constructor(client: Client, data: APIGuildMediaChannel, guild: Guild) {
        super(client, data, guild);

        this.topic = data.topic || undefined;
    }
}