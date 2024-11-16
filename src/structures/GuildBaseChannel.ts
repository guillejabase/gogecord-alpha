import {
    type APIGuildCategoryChannel,
    type APIGuildForumChannel,
    type APIGuildMediaChannel,
    type APIGuildStageVoiceChannel,
    type APIGuildVoiceChannel,
    type APINewsChannel,
    type APITextChannel
} from 'discord-api-types/v10';

import type Guild from './Guild.ts';
import type GuildAnnouncementChannel from './GuildAnnouncementChannel.ts';
import type GuildCategoryChannel from './GuildCategoryChannel.ts';
import type GuildForumChannel from './GuildForumChannel.ts';
import type GuildMediaChannel from './GuildMediaChannel.ts';
import type GuildStageVoiceChannel from './GuildStageVoiceChannel.ts';
import type GuildTextChannel from './GuildTextChannel.ts';
import type GuildVoiceChannel from './GuildVoiceChannel.ts';

import Snowflake from '../util/Snowflake.ts';

export const channelTypes = {
    GuildText: 0,
    GuildVoice: 2,
    GuildCategory: 4,
    GuildAnnouncement: 5,
    GuildStageVoice: 13,
    GuildForum: 15,
    GuildMedia: 16
} as const;

export type APIGuildChannel =
    | APINewsChannel
    | APIGuildCategoryChannel
    | APIGuildForumChannel
    | APIGuildMediaChannel
    | APIGuildStageVoiceChannel
    | APIGuildVoiceChannel
    | APITextChannel;
export type APIGuildTextBasedChannel =
    | APINewsChannel
    | APIGuildForumChannel
    | APIGuildMediaChannel
    | APIGuildStageVoiceChannel
    | APIGuildVoiceChannel
    | APITextChannel;
export type APIGuildVoiceBasedChannel =
    | APIGuildStageVoiceChannel
    | APIGuildVoiceChannel;
export type GuildChannel =
    | GuildAnnouncementChannel
    | GuildCategoryChannel
    | GuildForumChannel
    | GuildMediaChannel
    | GuildStageVoiceChannel
    | GuildTextChannel
    | GuildVoiceChannel;
export type GuildTextBasedChannel =
    | GuildAnnouncementChannel
    | GuildForumChannel
    | GuildMediaChannel
    | GuildStageVoiceChannel
    | GuildTextChannel
    | GuildVoiceChannel;
export type GuildVoiceBasedChannel =
    | GuildStageVoiceChannel
    | GuildVoiceChannel;
export type ChannelType = keyof typeof channelTypes;

export default class GuildBaseChannel {
    public created: {
        at: Date;
        timestamp: number;
    };
    public id: string;
    public name: string;
    public nsfw: boolean;
    public position: number;
    public readonly type: ChannelType;

    constructor(data: APIGuildChannel, public guild: Guild) {
        this.id = data.id;

        const created = new Snowflake(this.id).timestamp;
        this.created = {
            at: new Date(created),
            timestamp: created
        };

        this.name = data.name;
        this.nsfw = !!data.nsfw;
        this.position = data.position;
        this.type = Object
            .keys(channelTypes)
            .find((key) => channelTypes[key as ChannelType] == data.type) as ChannelType;
    }
}