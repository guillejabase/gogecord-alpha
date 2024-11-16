import MessageManager from '../managers/MessageManager.ts';

import Client from './Client.ts';
import Guild from './Guild.ts';
import GuildBaseChannel, { type APIGuildTextBasedChannel } from './GuildBaseChannel.ts';
import GuildCategoryChannel from './GuildCategoryChannel.ts';
import Message from './Message.ts';

import Embed from '../util/Embed.ts';

export default abstract class GuildTextBasedChannel extends GuildBaseChannel {
    public messages: MessageManager;
    public parent?: GuildCategoryChannel;

    constructor(client: Client, data: APIGuildTextBasedChannel, guild: Guild) {
        super(data, guild);

        this.messages = new MessageManager(this, client, guild);
        this.parent = guild.channels.cache.get(data.parent_id!) as GuildCategoryChannel;

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