import {
    type GatewayGuildBanAddDispatchData,
    type GatewayGuildBanRemoveDispatchData,
    type GatewayChannelCreateDispatchData,
    type GatewayChannelDeleteDispatchData,
    type GatewayChannelUpdateDispatchData,
    type GatewayGuildCreateDispatchData,
    type GatewayGuildDeleteDispatchData,
    type GatewayGuildMemberAddDispatchData,
    type GatewayGuildMemberRemoveDispatchData,
    type GatewayGuildMemberUpdateDispatchData,
    type GatewayGuildRoleCreateDispatchData,
    type GatewayGuildRoleDeleteDispatchData,
    type GatewayGuildRoleUpdateDispatchData,
    type GatewayGuildUpdateDispatchData,
    type GatewayMessageCreateDispatchData,
    type GatewayMessageDeleteDispatchData,
    type GatewayMessageUpdateDispatchData,
    type GatewayPresenceUpdateDispatchData,
    type GatewayReadyDispatchData
} from 'discord-api-types/v10';

import type Client from './Client.ts';

export type Listeners = {
    GuildBanAdd: GatewayGuildBanAddDispatchData;
    GuildBanRemove: GatewayGuildBanRemoveDispatchData;
    GuildChannelCreate: GatewayChannelCreateDispatchData;
    GuildChannelDelete: GatewayChannelDeleteDispatchData;
    GuildChannelUpdate: GatewayChannelUpdateDispatchData;
    GuildCreate: GatewayGuildCreateDispatchData;
    GuildDelete: GatewayGuildDeleteDispatchData;
    GuildMemberAdd: GatewayGuildMemberAddDispatchData;
    GuildMemberRemove: GatewayGuildMemberRemoveDispatchData;
    GuildMemberUpdate: GatewayGuildMemberUpdateDispatchData;
    GuildRoleCreate: GatewayGuildRoleCreateDispatchData;
    GuildRoleDelete: GatewayGuildRoleDeleteDispatchData;
    GuildRoleUpdate: GatewayGuildRoleUpdateDispatchData;
    GuildUpdate: GatewayGuildUpdateDispatchData;
    MessageCreate: GatewayMessageCreateDispatchData;
    MessageDelete: GatewayMessageDeleteDispatchData;
    MessageUpdate: GatewayMessageUpdateDispatchData;
    PresenceUpdate: GatewayPresenceUpdateDispatchData;
    Ready: GatewayReadyDispatchData;
};

export const listenersNames = {
    GUILD_BAN_ADD: 'GuildBanAdd',
    GUILD_BAN_REMOVE: 'GuildBanRemove',
    GUILD_CHANNEL_CREATE: 'GuildChannelCreate',
    GUILD_CHANNEL_DELETE: 'GuildChannelDelete',
    GUILD_CHANNEL_UPDATE: 'GuildChannelUpdate',
    GUILD_CREATE: 'GuildCreate',
    GUILD_DELETE: 'GuildDelete',
    GUILD_MEMBER_ADD: 'GuildMemberAdd',
    GUILD_MEMBER_REMOVE: 'GuildMemberRemove',
    GUILD_MEMBER_UPDATE: 'GuildMemberUpdate',
    GUILD_ROLE_CREATE: 'GuildRoleCreate',
    GUILD_ROLE_DELETE: 'GuildRoleDelete',
    GUILD_ROLE_UPDATE: 'GuildRoleUpdate',
    GUILD_UPDATE: 'GuildUpdate',
    MESSAGE_CREATE: 'MessageCreate',
    MESSAGE_DELETE: 'MessageDelete',
    MESSAGE_UPDATE: 'MessageUpdate',
    PRESENCE_UPDATE: 'PresenceUpdate',
    READY: 'Ready'
} as const;

export default class Listener<K extends keyof Listeners = keyof Listeners> {
    constructor(public name: K, public run: (client: Client, data: Listeners[K]) => void) { }
};