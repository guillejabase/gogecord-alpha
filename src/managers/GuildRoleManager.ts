import { Routes } from 'discord-api-types/v10';

import type Client from '../structures/Client.ts';
import type Guild from '../structures/Guild.ts';
import GuildRole from '../structures/GuildRole.ts';

import Collection from '../util/Collection.ts';
import Permissions from '../util/Permissions.ts';

export default class GuildRoleManager {
    public everyone!: GuildRole;
    public cache = new Collection<string, GuildRole>();

    constructor(private client: Client, private guild: Guild) {
        Object.defineProperty(this, 'client', { enumerable: false });
    }

    public async create(options: {
        color?: number;
        hoist?: boolean;
        mentionable?: boolean;
        name: string;
        permissions?: (keyof typeof Permissions.bits)[];
        position?: number;
    }, reason?: string): Promise<GuildRole> {
        return new GuildRole(this.client, await this.client.request({
            method: 'post',
            path: Routes.guildRoles(this.guild.id),
            body: {
                color: options.color || 0,
                hoist: !!options.hoist,
                mentionable: !!options.mentionable,
                name: options.name,
                permissions: new Permissions(options.permissions!).bitField.toString(),
                position: options.position || 0
            },
            reason
        }), this.guild);
    }
    public async delete(roleId: string, reason?: string): Promise<void> {
        return await this.client.request({
            method: 'delete',
            path: Routes.guildRole(this.guild.id, roleId),
            reason
        });
    }
    public async edit(roleId: string, options: {
        color?: number;
        hoist?: boolean;
        mentionable?: boolean;
        name?: string;
        permissions?: (keyof typeof Permissions.bits)[];
        position?: number;
    }, reason?: string): Promise<GuildRole> {
        return new GuildRole(this.client, await this.client.request({
            method: 'patch',
            path: Routes.guildRole(this.guild.id, roleId),
            body: {
                ...options,
                permissions: new Permissions(options.permissions!).bitField.toString()
            },
            reason
        }), this.guild);
    }
}