import { type APIRole } from 'discord-api-types/v10';

import type Client from './Client.ts';
import type Guild from './Guild.ts';
import type GuildMember from './GuildMember.ts';

import Permissions from '../util/Permissions.ts';
import Snowflake from '../util/Snowflake.ts';

export default class GuildRole {
    public color: number;
    public created: {
        at: Date;
        timestamp: number;
    };
    public hoist: boolean;
    public id: string;
    public mentionable: boolean;
    public name: string;
    public permissions: Permissions;
    public position: number;
    public members = new Map<string, GuildMember>();

    constructor(client: Client, data: APIRole, public guild: Guild) {
        this.color = data.color;
        this.id = data.id;

        const created = new Snowflake(this.id).timestamp;
        this.created = {
            at: new Date(created),
            timestamp: created
        };

        this.hoist = data.hoist;
        this.mentionable = data.mentionable;
        this.name = data.name;
        this.permissions = new Permissions(BigInt(data.permissions));
        this.position = data.position;

        this.guild.roles.cache.set(this.id, this);
        client.guilds.cache.set(this.guild.id, this.guild);

        Object.defineProperty(this, 'members', { enumerable: false });
    }

    public toString(): string {
        return `<@&${this.id}>`;
    }
}