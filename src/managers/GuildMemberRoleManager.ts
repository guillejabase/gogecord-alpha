import { Routes } from 'discord-api-types/v10';

import type Client from '../structures/Client.ts';
import type GuildMember from '../structures/GuildMember.ts';
import type GuildRole from '../structures/GuildRole.ts';

import Collection from '../util/Collection.ts';

export default class GuildMemberRoleManager {
    public cache = new Collection<string, GuildRole>();

    constructor(private client: Client, private member: GuildMember) {
        Object.defineProperty(this, 'client', { enumerable: false });
    }

    public async add(roleId: string, reason?: string): Promise<void> {
        return await this.client.request({
            method: 'put',
            path: Routes.guildMemberRole(this.member.guild.id, this.member.user.id, roleId),
            reason
        });
    }
    public async remove(roleId: string, reason?: string): Promise<void> {
        return await this.client.request({
            method: 'delete',
            path: Routes.guildMemberRole(this.member.guild.id, this.member.user.id, roleId),
            reason
        });
    }
}