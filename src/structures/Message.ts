import {
    type GatewayMessageCreateDispatchData,
    type GatewayMessageUpdateDispatchData
} from 'discord-api-types/v10';

import type Client from './Client.ts';
import type Guild from './Guild.ts';
import { type GuildTextBasedChannel } from './GuildBaseChannel.ts';
import type GuildMember from './GuildMember.ts';

import Snowflake from '../util/Snowflake.ts';
import type Embed from '../util/Embed.ts';

export default class Message {
    public channel!: GuildTextBasedChannel;
    public content: string;
    public created: {
        at: Date;
        timestamp: number;
    };
    public edited: {
        since?: Date;
        timestamp?: number;
    };
    public id: string;
    public member: GuildMember;
    public pinned: boolean;

    constructor(client: Client, data: GatewayMessageCreateDispatchData | GatewayMessageUpdateDispatchData, public guild: Guild) {
        this.channel = this.guild.channels.cache.get(data.channel_id)! as GuildTextBasedChannel;
        this.content = data.content!;
        this.id = data.id;

        const created = new Snowflake(this.id).timestamp;
        this.created = {
            at: new Date(created),
            timestamp: created
        };

        const edited = Date.parse(data.edited_timestamp!);
        this.edited = {
            since: data.edited_timestamp ? new Date(edited) : undefined,
            timestamp: edited || undefined
        };

        this.member = this.guild.members.cache.get(data.author!.id)!;
        this.pinned = !!data.pinned;

        this.channel.messages.cache.set(this.id, this);
        this.guild.channels.cache.set(this.channel.id, this.channel);
        client.guilds.cache.set(this.guild.id, this.guild);

        Object.defineProperty(this.channel, 'guild', { enumerable: false });

        if ('parent' in this.channel) {
            Object.defineProperty(this.channel.parent, 'guild', { enumerable: false });
        }

        Object.defineProperty(this.member, 'guild', { enumerable: false });
    }

    public get ping(): number {
        return this.created.timestamp - Date.now();
    }

    public async reply(options: {
        content?: string;
        embeds?: Embed[];
        mentions?: boolean;
    }): Promise<Message> {
        return await this.channel.send({
            ...options,
            reference: this.id
        });
    }
}