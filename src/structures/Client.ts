import {
    type APIGatewayBotInfo,
    type APIApplication,
    RouteBases,
    type GatewayReceivePayload,
    Routes
} from 'discord-api-types/v10';
import EventEmitter from 'events';
import { request } from 'https';
import { inspect } from 'util';
import WebSocket from 'ws';

import GuildManager from '../managers/GuildManager.ts';
import UserManager from '../managers/UserManager.ts';

import { type Events } from './Event.ts';
import Listener, { type Listeners, listenersNames } from './Listener.ts';
import { type ActivityType, activityTypes, type Status, statuses } from './Presence.ts';
import User from './User.ts';

import Intents, { type IntentsResolvable } from '../util/Intents.ts';

type RequestOptions = {
    method: 'delete' | 'get' | 'patch' | 'post' | 'put';
    path: string;
    body?: object;
    reason?: string;
};

export default class Client extends EventEmitter {
    private processQueue: {
        options: RequestOptions;
        resolve: (data: any) => void;
        reject: (error: any) => void;
    }[] = [];
    private isProcessing = false;

    public intents: Intents;
    public mentions: boolean;
    public owner!: User;
    public presence?: {
        activities?: {
            name: string;
            state?: string;
            type?: ActivityType;
            url?: string;
        }[];
        afk?: boolean;
        status?: Exclude<Status, 'Offline'>;
    };
    public ready!: {
        at: Date;
        timestamp: number;
    };
    public token!: string;
    public user!: User;
    public webSocket!: WebSocket;
    public guilds = new GuildManager(this);
    public users = new UserManager(this);

    constructor(options: {
        intents: IntentsResolvable;
        mentions?: Client['mentions'];
        presence?: Client['presence'];
    }) {
        super();

        this.intents = new Intents(options.intents);
        this.mentions = !!options.mentions;
        this.presence = options.presence;
    }

    private async make(options: RequestOptions): Promise<any> {
        const { method, path, body, reason } = options;
        const headers: Record<string, string> = {
            Authorization: `Bot ${this.token}`,
            'Content-Type': 'application/json'
        };

        if (reason) headers['X-Audit-Log-Reason'] = reason;

        return new Promise<any>((resolve, reject) => {
            const order = request(`${RouteBases.api}${path}`, { method, headers }, (response) => {
                let data = '';

                response.on('data', (chunk) => data += chunk);
                response.on('end', () => {
                    if (response.statusCode === 429) {
                        setTimeout(() => resolve(this.make(options)), parseInt(response.headers['retry-after']!) * 1000);
                    } else if (response.statusCode === 401) {
                        reject(`Token not provided`);
                    } else if (response.statusCode && response.statusCode >= 400) {
                        reject(`Request failed with status code ${response.statusCode}`);
                    } else {
                        resolve(JSON.parse(data));
                    }
                });
            });

            if (body) order.write(JSON.stringify(body));

            order.on('error', reject);
            order.end();
        });
    }
    private async process(): Promise<void> {
        if (this.isProcessing || this.processQueue.length === 0) return;

        this.isProcessing = true;

        const { options, resolve, reject } = this.processQueue.shift()!;

        try {
            resolve(await this.make(options));
        } catch (error) {
            reject(error);
        }

        this.isProcessing = false;

        if (this.processQueue.length > 0) {
            this.process();
        }
    }

    public addListener<key extends keyof Events>(name: key, listener: (client: this, ...args: Events[key]) => void): this {
        return super.addListener(name, listener);
    }
    public emit<key extends keyof Events>(name: key, client: this, ...args: Events[key]): boolean {
        return super.emit(name, client, ...args);
    }
    public eventNames(): (keyof Events)[] {
        return super.eventNames() as (keyof Events)[];
    }
    public listenerCount<key extends keyof Events>(name: key, listener?: (client: this, ...args: Events[key]) => void): number {
        return super.listenerCount(name, listener);
    }
    public listeners<key extends keyof Events>(name: key): Function[] {
        return super.listeners(name);
    }
    public login(token: string): void {
        this.token = token;

        this.request({
            method: 'get',
            path: Routes.gatewayBot()
        }).then((response: APIGatewayBotInfo) => {
            this.webSocket = new WebSocket(`${response.url}/?v=10&encoding=json`);

            this.webSocket.on('open', () => {
                const { token, intents } = this;

                this.webSocket.send(JSON.stringify({
                    op: 2,
                    d: {
                        intents: intents.bitField,
                        properties: {
                            os: 'windows',
                            browser: 'chrome',
                            device: 'chrome'
                        },
                        token
                    }
                }));
                this.webSocket.send(JSON.stringify({
                    op: 3,
                    d: {
                        activities: this.presence?.activities?.map((activity) => ({
                            ...activity,
                            type: activityTypes[activity.type || 'Playing']
                        })) || [],
                        afk: this.presence?.afk || false,
                        since: Date.now(),
                        status: statuses[this.presence?.status || 'Online']
                    }
                }));
            });
            this.webSocket.on('message', (data) => {
                const gateway: GatewayReceivePayload = JSON.parse(data.toString());

                if (gateway.op == 10) {
                    setInterval(() => this.webSocket.send(JSON.stringify({
                        op: 1,
                        d: null
                    })), gateway.d.heartbeat_interval);
                }
                if (!gateway.t) {
                    return;
                }

                const name = listenersNames[gateway.t as keyof typeof listenersNames];

                try {
                    (require(`../listeners/${name}.ts`).default as Listener).run(this, gateway.d as Listeners[typeof name]);
                } catch {
                    return;
                }
            });
        });
        this.request({
            method: 'get',
            path: Routes.currentApplication()
        }).then((response: APIApplication) => {
            this.owner = new User(this, response.owner!);
            this.user = new User(this, response.bot!);
        });
    }
    public off<key extends keyof Events>(name: key, listener: (client: this, ...args: Events[key]) => void): this {
        return super.off(name, listener);
    }
    public on<key extends keyof Events>(name: key, listener: (client: this, ...args: Events[key]) => void): this {
        return super.on(name, listener);
    }
    public once<key extends keyof Events>(name: key, listener: (client: this, ...args: Events[key]) => void): this {
        return super.once(name, listener);
    }
    public async ping(): Promise<number> {
        return new Promise((resolve, reject) => {
            try {
                this.webSocket.ping(Date.now());
                this.webSocket.on('pong', (timestamp: number) => resolve(Date.now() - timestamp));
                this.webSocket.on('error', reject);
            } catch (error) {
                reject(error);
            }
        });
    }
    public prependListener<key extends keyof Events>(name: key, listener: (client: this, ...args: Events[key]) => void): this {
        return super.prependListener(name, listener);
    }
    public prependOnceListener<key extends keyof Events>(name: key, listener: (client: this, ...args: Events[key]) => void): this {
        return super.prependOnceListener(name, listener);
    }
    public randomNumber(minimum: number, maximum: number, decimal?: boolean): number {
        const random = Math.random() * (maximum - minimum);

        return decimal ? random + minimum : Math.floor(random) + minimum;
    }
    public rawListeners<key extends keyof Events>(name: key): Function[] {
        return super.rawListeners(name);
    }
    public removeAllListeners(name?: keyof Events): this {
        return super.removeAllListeners(name);
    }
    public removeListener<key extends keyof Events>(name: key, listener: (client: this, ...args: Events[key]) => void): this {
        return super.removeListener(name, listener);
    }
    public async request(options: RequestOptions): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.processQueue.push({ options, resolve, reject });
            this.process();
        });
    }
    public setMaxListeners(number: number): this {
        return super.setMaxListeners(number);
    }
    public toCase(text: string): string {
        return `${text[0].toUpperCase()}${text.slice(1).toLowerCase()}`;
    }
    public toString(): string {
        return this.user.id ? `<@${this.user.id}>` : '<@me>';
    }
    public [Symbol.for('nodejs.util.inspect.custom')](): string {
        const { intents, mentions, owner, presence, ready, user } = this;

        return `Client ${inspect({ intents, mentions, owner, presence, ready, user }, { colors: true })}`;
    }
}