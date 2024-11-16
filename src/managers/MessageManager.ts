import { Routes } from 'discord-api-types/v10';

import type Client from '../structures/Client.ts';
import type Guild from '../structures/Guild.ts';
import GuildTextBasedChannel from '../structures/GuildTextBasedChannel.ts';
import Message from '../structures/Message.ts';

import Collection from '../util/Collection.ts';
import type Embed from '../util/Embed.ts';

export default class MessageManager {
    public cache = new Collection<string, Message>();

    constructor(private channel: GuildTextBasedChannel, private client: Client, private guild: Guild) {
        Object.defineProperty(this, 'client', { enumerable: false });
    }

    public async send(options: {
        content?: string;
        embeds?: Embed[];
        mentions?: boolean;
        reference?: string;
    }): Promise<Message> {
        return new Message(this.client, await this.client.request({
            method: 'post',
            path: Routes.channelMessages(this.channel.id),
            body: {
                allowed_mentions: { replied_user: options.mentions != undefined ? options.mentions : this.client.mentions },
                content: options.content || undefined,
                embeds: options.embeds || undefined,
                message_reference: options.reference ? { message_id: options.reference } : undefined
            }
        }), this.guild);
    }
}
