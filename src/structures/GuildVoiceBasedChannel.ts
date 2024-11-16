import type Client from './Client.ts';
import type Guild from './Guild.ts';
import { type APIGuildVoiceBasedChannel } from './GuildBaseChannel.ts';
import GuildTextBasedChannel from './GuildTextBasedChannel.ts';

export default abstract class GuildVoiceBasedChannel extends GuildTextBasedChannel {
    public bitrate: number;
    public limit: number;

    constructor(client: Client, data: APIGuildVoiceBasedChannel, guild: Guild) {
        super(client, data, guild);

        this.bitrate = data.bitrate || 0;
        this.limit = data.user_limit || 0;
    }
}