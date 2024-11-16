import type Client from './Client.ts';
import type Guild from './Guild.ts';
import type GuildBan from './GuildBan.ts';
import { type GuildChannel } from './GuildBaseChannel.ts';
import type GuildMember from './GuildMember.ts';
import type GuildRole from './GuildRole.ts';
import type Message from './Message.ts';
import type Presence from './Presence.ts';

export type Events = {
    GuildBanAdd: [ban: GuildBan];
    GuildBanRemove: [ban: GuildBan];
    GuildChannelCreate: [channel: GuildChannel];
    GuildChannelDelete: [channel: GuildChannel];
    GuildChannelUpdate: [oldChannel: GuildChannel, newChannel: GuildChannel];
    GuildCreate: [guild: Guild];
    GuildDelete: [guild: Guild];
    GuildMemberAdd: [member: GuildMember];
    GuildMemberRemove: [member: GuildMember];
    GuildMemberUpdate: [oldMember: GuildMember, newMember: GuildMember];
    GuildRoleCreate: [role: GuildRole];
    GuildRoleDelete: [role: GuildRole];
    GuildRoleUpdate: [oldRole: GuildRole, newRole: GuildRole];
    GuildUpdate: [oldGuild: Guild, newGuild: Guild];
    MessageCreate: [message: Message];
    MessageDelete: [message: Message];
    MessageUpdate: [oldMessage: Message, newMessage: Message];
    PresenceUpdate: [oldPresence: Presence, newPresence: Presence];
    Ready: [];
};

export const eventsIntents = {
    GuildBanAdd: ['GuildModeration'],
    GuildBanRemove: ['GuildModeration'],
    GuildChannelCreate: ['Guilds'],
    GuildChannelDelete: ['Guilds'],
    GuildChannelUpdate: ['Guilds'],
    GuildCreate: ['Guilds'],
    GuildDelete: ['Guilds'],
    GuildMemberAdd: ['GuildMembers'],
    GuildMemberRemove: ['GuildMembers'],
    GuildMemberUpdate: ['GuildMembers'],
    GuildRoleCreate: ['Guilds'],
    GuildRoleDelete: ['Guilds'],
    GuildRoleUpdate: ['Guilds'],
    GuildUpdate: ['Guilds'],
    MessageCreate: ['GuildMessages'],
    MessageDelete: ['GuildMessages'],
    MessageUpdate: ['GuildMessages'],
    PresenceUpdate: ['GuildPresences'],
    Ready: []
} as const;

export default class Event<K extends keyof Events = keyof Events> {
    constructor(public name: K, public run: (client: Client, ...args: Events[K]) => void) { }
};