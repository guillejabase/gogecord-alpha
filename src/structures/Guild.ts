import {
    CDNRoutes,
    type GatewayGuildCreateDispatchData,
    type GatewayGuildUpdateDispatchData,
    type GuildBannerFormat,
    GuildFeature as Feature,
    GuildMFALevel as MFA,
    GuildNSFWLevel as NSFW,
    GuildPremiumTier as PremiumTier,
    type GuildIconFormat,
    RouteBases
} from 'discord-api-types/v10';

import GuildBanManager from '../managers/GuildBanManager.ts';
import GuildChannelManager from '../managers/GuildChannelManager.ts';
import GuildMemberManager from '../managers/GuildMemberManager.ts';
import GuildRoleManager from '../managers/GuildRoleManager.ts';

import type Client from './Client.ts';
import GuildAnnouncementChannel from './GuildAnnouncementChannel.ts';
import { channelTypes, type GuildChannel } from './GuildBaseChannel.ts';
import GuildCategoryChannel from './GuildCategoryChannel.ts';
import GuildForumChannel from './GuildForumChannel.ts';
import GuildMediaChannel from './GuildMediaChannel.ts';
import GuildMember from './GuildMember.ts';
import GuildRole from './GuildRole.ts';
import GuildStageVoiceChannel from './GuildStageVoiceChannel.ts';
import GuildTextChannel from './GuildTextChannel.ts';
import GuildVoiceChannel from './GuildVoiceChannel.ts';
import Presence from './Presence.ts';

import Snowflake from '../util/Snowflake.ts';

export type GuildFeature = keyof typeof Feature;
export type GuildMFA = keyof typeof MFA;
export type GuildNSFW = keyof typeof NSFW;
export type GuildPremiumTier = keyof typeof PremiumTier;
type ImageFormat = 'gif' | 'jpg' | 'jpeg' | 'png' | 'webp';
type ImageSize = 128 | 256 | 512 | 1024 | 2048 | 4096;

export default class Guild {
    public banner?: string;
    public bans: GuildBanManager;
    public channels: GuildChannelManager;
    public created: {
        at: Date;
        timestamp: number;
    };
    public description?: string;
    public features: GuildFeature[];
    public icon?: string;
    public id: string;
    public members: GuildMemberManager;
    public mfa: GuildMFA;
    public name: string;
    public nsfw: GuildNSFW;
    public owner: GuildMember;
    public premium: {
        subscriptions: number;
        premium: GuildPremiumTier;
    };
    public roles: GuildRoleManager;

    constructor(client: Client, data: GatewayGuildCreateDispatchData | GatewayGuildUpdateDispatchData) {
        this.banner = data.banner || undefined;
        this.bans = new GuildBanManager(client, this);
        this.channels = new GuildChannelManager(client, this);

        if ('channels' in data && data.channels.length > 0) {
            data.channels.forEach((channelData) => {
                let channel: GuildChannel | undefined;

                switch (channelData.type) {
                    case channelTypes.GuildText:
                        channel = new GuildTextChannel(client, channelData, this);
                        break;
                    case channelTypes.GuildVoice:
                        channel = new GuildVoiceChannel(client, channelData, this);
                        break;
                    case channelTypes.GuildCategory:
                        channel = new GuildCategoryChannel(channelData, this);
                        break;
                    case channelTypes.GuildAnnouncement:
                        channel = new GuildAnnouncementChannel(client, channelData, this);
                        break;
                    case channelTypes.GuildStageVoice:
                        channel = new GuildStageVoiceChannel(client, channelData, this);
                        break;
                    case channelTypes.GuildForum:
                        channel = new GuildForumChannel(client, channelData, this);
                        break;
                    case channelTypes.GuildMedia:
                        channel = new GuildMediaChannel(client, channelData, this);
                        break;
                }

                if (!channel) {
                    return;
                }

                this.channels.cache.set(channel.id, channel);
            });
        }

        this.id = data.id;

        const created = new Snowflake(this.id).timestamp;
        this.created = {
            at: new Date(created),
            timestamp: created
        };

        this.description = data.description || undefined;
        this.features = data.features
            .map((feature) => Object
                .keys(Feature)
                .find((key) => Feature[key as GuildFeature] == feature) as GuildFeature)
            .filter((feature) => feature != undefined)
            .sort();
        this.icon = data.icon || undefined;
        this.mfa = Object
            .keys(MFA)
            .find((key) => MFA[key as GuildMFA] == data.mfa_level) as GuildMFA;
        this.name = data.name;
        this.nsfw = Object
            .keys(NSFW)
            .find((key) => NSFW[key as GuildNSFW] == data.nsfw_level) as GuildNSFW;
        this.roles = new GuildRoleManager(client, this);

        if (data.roles.length > 1) {
            const length = Math.max(
                ...data.roles
                    .filter((roleData) => roleData.id != this.id)
                    .map((roleData) => roleData.position)
            );

            data.roles
                .filter((roleData) => roleData.id != this.id)
                .sort()
                .forEach((roleData) => {
                    new GuildRole(client, {
                        ...roleData,
                        position: length - roleData.position + 1
                    }, this);
                });
        }

        this.roles.everyone = new GuildRole(client, {
            ...data.roles.find((roleData) => roleData.id == this.id)!,
            position: data.roles.length
        }, this);
        this.members = new GuildMemberManager(client, this);

        if ('members' in data) {
            data.members.forEach((memberData) => {
                new GuildMember(client, {
                    ...memberData,
                    presence: new Presence(data.presences.find((presenceData) => presenceData.user.id == memberData.user.id))
                }, this);
            });
        }

        this.members.me = this.members.cache.get(client.user.id)!;
        this.owner = this.members.cache.get(data.owner_id)!;
        this.premium = {
            subscriptions: data.premium_subscription_count || 0,
            premium: Object
                .keys(PremiumTier)
                .find((key) => PremiumTier[key as GuildPremiumTier] == data.premium_tier) as GuildPremiumTier
        };

        client.guilds.cache.set(this.id, this);

        Object.defineProperty(this.owner, 'guild', { enumerable: false });
        Object.defineProperties(this, {
            bans: { enumerable: false },
            channels: { enumerable: false },
            members: { enumerable: false },
            roles: { enumerable: false }
        });
    }

    public bannerURL(options: {
        format?: ImageFormat;
        size?: ImageSize;
    }): string | undefined {
        if (!this.banner) {
            return undefined;
        }

        return `${RouteBases.cdn}${CDNRoutes.guildBanner(
            this.id,
            this.banner,
            (options.format || (this.banner.startsWith('a_') ? 'gif' : 'png')) as GuildBannerFormat
        )}${options.size ? `?size=${options.size}` : ''}`;
    }
    public iconURL(format?: ImageFormat, size?: ImageSize): string | undefined {
        if (!this.icon) {
            return undefined;
        }

        return `${RouteBases.cdn}${CDNRoutes.guildIcon(
            this.id,
            this.icon,
            (format || (this.icon.startsWith('a_') ? 'gif' : 'png')) as GuildIconFormat
        )}${size ? `?size=${size}` : ''}`;
    }
}