import { type APINewsChannel } from 'discord-api-types/v10';

import MessageManager from '../managers/MessageManager.ts';

import type Client from './Client.ts';
import type Guild from './Guild.ts';
import GuildBaseChannel from './GuildBaseChannel.ts';
import type GuildCategoryChannel from './GuildCategoryChannel.ts';
import type Message from './Message.ts';

import type Embed from '../util/Embed.ts';

export default class GuildAnnouncementChannel extends GuildBaseChannel {
    public messages: MessageManager;
    public parent: GuildCategoryChannel;
    public topic?: string;
    public readonly type = 'GuildAnnouncement';

    constructor(client: Client, data: APINewsChannel, guild: Guild) {
        super(data, guild);

        this.messages = new MessageManager(this, client, guild);
        this.parent = guild.channels.cache.get(data.parent_id!) as GuildCategoryChannel;
        this.topic = data.topic || undefined;

        Object.defineProperty(this, 'messages', { enumerable: false });
    }

    public async send(options: {
        content?: string;
        embeds?: Embed[];
        mentions?: boolean;
        reference?: string;
    }): Promise<Message> {
        return await this.messages.send(options);
    }
}