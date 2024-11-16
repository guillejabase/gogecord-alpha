import { type APIGuildStageVoiceChannel } from 'discord-api-types/v10';

import type Client from './Client.ts';
import type Guild from './Guild.ts';
import GuildVoiceBasedChannel from './GuildVoiceBasedChannel.ts';

export default class GuildStageVoiceChannel extends GuildVoiceBasedChannel {
    public readonly type = 'GuildStageVoice';

    constructor(client: Client, data: APIGuildStageVoiceChannel, guild: Guild) {
        super(client, data, guild);
    }
}