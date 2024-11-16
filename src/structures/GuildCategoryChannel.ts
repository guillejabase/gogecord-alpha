import { type APIGuildCategoryChannel } from 'discord-api-types/v10';

import type Guild from './Guild.ts';
import GuildBaseChannel, { type GuildChannel } from './GuildBaseChannel.ts';

export default class GuildCategoryChannel extends GuildBaseChannel {
    public channels!: Exclude<GuildChannel, GuildCategoryChannel>[];
    public readonly type = 'GuildCategory';

    constructor(data: APIGuildCategoryChannel, guild: Guild) {
        super(data, guild);
    }
}