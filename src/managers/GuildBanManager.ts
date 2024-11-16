import { Routes } from 'discord-api-types/v10';

import type Client from '../structures/Client.ts';
import type Guild from '../structures/Guild.ts';
import GuildBan from '../structures/GuildBan.ts';

import Collection from '../util/Collection.ts';

export default class GuildBanManager {
    public cache = new Collection<string, GuildBan>();

    constructor(private client: Client, private guild: Guild) {
        Object.defineProperty(this, 'client', { enumerable: false });
    }

    public async add(userId: string, reason?: string, days?: number): Promise<GuildBan> {
        return new GuildBan(this.client, await this.client.request({
            method: 'put',
            path: Routes.guildBan(this.guild.id, userId),
            body: { last_messages_days: days },
            reason
        }), this.guild);
    }
    public async remove(userId: string, reason?: string): Promise<void> {
        return await this.client.request({
            method: 'delete',
            path: Routes.guildBan(this.guild.id, userId),
            reason
        });
    }
}