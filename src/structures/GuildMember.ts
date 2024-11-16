import {
    type APIGuildMember,
    CDNRoutes,
    type GatewayGuildMemberAddDispatchData,
    type GatewayGuildMemberUpdateDispatchData,
    type GuildMemberAvatarFormat,
    RouteBases
} from 'discord-api-types/v10';

import GuildMemberRoleManager from '../managers/GuildMemberRoleManager.ts';

import type Client from './Client.ts';
import type Guild from './Guild.ts';
import Presence from './Presence.ts';
import User from './User.ts';

import Permissions from '../util/Permissions.ts';

type APIFullGuildMember = (
    | APIGuildMember
    | GatewayGuildMemberAddDispatchData
    | GatewayGuildMemberUpdateDispatchData
) & {
    presence?: Presence;
};
type ImageFormat = 'gif' | 'jpg' | 'jpeg' | 'png' | 'webp';
type ImageSize = 128 | 256 | 512 | 1024 | 2048 | 4096;

export default class GuildMember {
    public avatar?: string;
    public boosting: {
        since?: Date;
        timestamp?: number;
    };
    public deaf: boolean;
    public joined: {
        at: Date;
        timestamp: number;
    };
    public muted: boolean;
    public nickname?: string;
    public permissions: Permissions;
    public presence: Presence;
    public roles: GuildMemberRoleManager;
    public timedOut: {
        until?: Date;
        timestamp?: number;
    };
    public user: User;

    constructor(client: Client, data: APIFullGuildMember, public guild: Guild) {
        this.avatar = data.avatar || undefined;

        const boosting = Date.parse(data.premium_since!);
        this.boosting = {
            since: data.premium_since ? new Date(boosting) : undefined,
            timestamp: boosting || undefined
        };

        this.deaf = !!data.deaf;

        const joined = Date.parse(data.joined_at!);
        this.joined = {
            at: new Date(joined),
            timestamp: joined
        };

        this.muted = !!data.mute;
        this.nickname = data.nick || undefined;
        this.roles = new GuildMemberRoleManager(client, this);

        this.guild.roles.cache.forEach((role) => {
            if (!data.roles.includes(role.id)) {
                return;
            }

            this.roles.cache.set(role.id, role);
        });

        let bitField = BigInt(0);

        this.roles.cache.forEach((role) => {
            bitField |= BigInt(role.permissions.bitField);
        });

        this.permissions = new Permissions(bitField);
        this.presence = data.presence || new Presence();

        const parsed = Date.parse(data.communication_disabled_until!);
        const timeout = parsed > Date.now() ? parsed : undefined;
        this.timedOut = {
            until: timeout ? new Date(timeout) : undefined,
            timestamp: timeout
        };

        this.user = new User(client, data.user);

        this.guild.roles.cache.forEach((role) => {
            if (!this.roles.cache.has(role.id)) {
                return;
            }

            role.members.set(this.user.id, this);
        });

        this.guild.members.cache.set(this.user.id, this);
        client.guilds.cache.set(this.guild.id, this.guild);
        client.users.cache.set(this.user.id, this.user);

        Object.defineProperty(this, 'roles', { enumerable: false });
    }

    public avatarURL(format?: ImageFormat, size?: ImageSize): string | undefined {
        if (!this.avatar) {
            return undefined;
        }

        return `${RouteBases.cdn}${CDNRoutes.guildMemberAvatar(
            this.guild.id,
            this.user.id,
            this.avatar,
            (format || (this.avatar.startsWith('a_') ? 'gif' : 'png')) as GuildMemberAvatarFormat
        )}${size ? `?size=${size}` : ''}`;
    }
    public toString(): string {
        return `<@${this.nickname ? '!' : ''}${this.user.id}>`;
    }
}