import { type APIGuildVoiceChannel } from 'discord-api-types/v10';

import type Client from './Client.ts';
import type Guild from './Guild.ts';
import GuildVoiceBasedChannel from './GuildVoiceBasedChannel.ts';

export default class GuildVoiceChannel extends GuildVoiceBasedChannel {
    public readonly type = 'GuildVoice';

    constructor(client: Client, data: APIGuildVoiceChannel, guild: Guild) {
        super(client, data, guild);
    }
}