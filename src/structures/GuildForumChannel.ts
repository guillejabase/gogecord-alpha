import { type APIGuildForumChannel } from 'discord-api-types/v10';

import type Client from './Client.ts';
import type Guild from './Guild.ts';
import GuildTextBasedChannel from './GuildTextBasedChannel.ts';

export default class GuildForumChannel extends GuildTextBasedChannel {
    public topic?: string;
    public readonly type = 'GuildForum';

    constructor(client: Client, data: APIGuildForumChannel, guild: Guild) {
        super(client, data, guild);

        this.topic = data.topic || undefined;
    }
}