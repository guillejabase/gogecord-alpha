import { type APITextChannel } from 'discord-api-types/v10';

import type Client from './Client.ts';
import type Guild from './Guild.ts';
import GuildTextBasedChannel from './GuildTextBasedChannel.ts';

export default class GuildTextChannel extends GuildTextBasedChannel {
    public topic?: string;
    public readonly type = 'GuildText';

    constructor(client: Client, data: APITextChannel, guild: Guild) {
        super(client, data, guild);

        this.topic = data.topic || undefined;
    }
}