import { type APIBan } from 'discord-api-types/v10';

import type Client from './Client.ts';
import type Guild from './Guild.ts';
import User from './User.ts';

export default class GuildBan {
    public reason?: string;
    public user: User;

    constructor(client: Client, data: APIBan, public guild: Guild) {
        this.reason = data.reason || undefined;
        this.user = new User(client, data.user);

        this.guild.bans.cache.set(this.user.id, this);
        client.guilds.cache.set(this.guild.id, this.guild);
    }
}