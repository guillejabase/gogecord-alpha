import { Routes } from 'discord-api-types/v10';

import type Client from '../structures/Client.ts';
import type Guild from '../structures/Guild.ts';
import type GuildMember from '../structures/GuildMember.ts';

import Collection from '../util/Collection.ts';

export default class GuildMemberManager {
    public me!: GuildMember;
    public cache = new Collection<string, GuildMember>();

    constructor(private client: Client, private guild: Guild) {
        Object.defineProperty(this, 'client', { enumerable: false });
    }

    public async deafen(memberId: string, reason?: string): Promise<void> {
        return await this.client.request({
            method: 'patch',
            path: Routes.guildMember(this.guild.id, memberId),
            body: { deaf: true },
            reason
        });
    }
    public async mute(memberId: string, reason?: string): Promise<void> {
        return await this.client.request({
            method: 'patch',
            path: Routes.guildMember(this.guild.id, memberId),
            body: { mute: true },
            reason
        });
    }
    public async kick(memberId: string, reason?: string): Promise<void> {
        return await this.client.request({
            method: 'delete',
            path: Routes.guildMember(this.guild.id, memberId),
            reason
        });
    }
    public async timeout(memberId: string, time: number, reason?: string): Promise<void> {
        return await this.client.request({
            method: 'patch',
            path: Routes.guildMember(this.guild.id, memberId),
            body: { communication_disabled_until: new Date(Date.now() + time).toISOString() },
            reason
        });
    }
    public async undeafen(memberId: string): Promise<void> {
        return await this.client.request({
            method: 'patch',
            path: Routes.guildMember(this.guild.id, memberId),
            body: { deaf: false }
        });
    }
    public async unmute(memberId: string): Promise<void> {
        return await this.client.request({
            method: 'patch',
            path: Routes.guildMember(this.guild.id, memberId),
            body: { mute: false }
        });
    }
    public async untimeout(memberId: string): Promise<void> {
        return await this.client.request({
            method: 'patch',
            path: Routes.guildMember(this.guild.id, memberId),
            body: { communication_disabled_until: null }
        });
    }
}