import { Routes } from 'discord-api-types/v10';

import type Client from '../structures/Client.ts';
import User from '../structures/User.ts';

import Collection from '../util/Collection.ts';

export default class UserManager {
    public cache = new Collection<string, User>();

    constructor(private client: Client) {
        Object.defineProperty(this, 'client', { enumerable: false });
    }

    public async fetch(userId: string): Promise<User> {
        return new User(this.client, await this.client.request({
            method: 'get',
            path: Routes.user(userId)
        }));
    }
}