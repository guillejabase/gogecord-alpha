import {
    type APIUser,
    CDNRoutes,
    RouteBases,
    type UserAvatarFormat,
    type UserBannerFormat
} from 'discord-api-types/v10';

import type Client from './Client.ts';

import Snowflake from '../util/Snowflake.ts';
import UserFlags from '../util/UserFlags.ts';

type ImageFormat = 'gif' | 'jpg' | 'jpeg' | 'png' | 'webp';
type ImageSize = 128 | 256 | 512 | 1024 | 2048 | 4096;

export default class User {
    public avatar?: string;
    public banner: {
        color?: number;
        hash?: string;
    };
    public bot: boolean;
    public created: {
        at: Date;
        timestamp: number;
    };
    public discriminator?: string;
    public flags: UserFlags;
    public globalName?: string;
    public id: string;
    public username: string;

    constructor(client: Client, data: APIUser) {
        this.avatar = data.avatar || undefined;
        this.banner = {
            color: data.accent_color || undefined,
            hash: data.banner || undefined
        };
        this.bot = !!data.bot;
        this.id = data.id;

        const created = new Snowflake(this.id).timestamp;
        this.created = {
            at: new Date(created),
            timestamp: created
        };

        this.discriminator = data.discriminator != '0' ? data.discriminator : undefined;
        this.flags = new UserFlags(data.flags!);
        this.globalName = data.global_name || undefined;
        this.username = data.username;

        client.users.cache.set(this.id, this);
    }

    public avatarURL(format?: ImageFormat, size?: ImageSize): string | undefined {
        if (!this.avatar) {
            return undefined;
        }

        return `${RouteBases.cdn}${CDNRoutes.userAvatar(
            this.id,
            this.avatar,
            (format || (this.avatar.startsWith('a_') ? 'gif' : 'png')) as UserAvatarFormat
        )}${size ? `?size=${size}` : ''}`;
    }
    public bannerURL(format?: ImageFormat, size?: ImageSize): string | undefined {
        if (!this.banner.hash) {
            return undefined;
        }

        return `${RouteBases.cdn}${CDNRoutes.userBanner(
            this.id,
            this.banner.hash,
            (format || (this.banner.hash.startsWith('a_') ? 'gif' : 'png')) as UserBannerFormat
        )}${size ? `?size=${size}` : ''}`;
    }
    public toString(): string {
        return `<@${this.id}>`;
    }
}