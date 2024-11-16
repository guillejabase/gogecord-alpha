import {
    type GatewayActivity,
    type GatewayPresenceUpdateDispatchData
} from 'discord-api-types/v10';

export const activityTypes = {
    Playing: 0,
    Streaming: 1,
    Listening: 2,
    Watching: 3,
    Custom: 4,
    Competing: 5
} as const;

export type ActivityType = keyof typeof activityTypes;

class Activity {
    public created: {
        at: Date;
        timestamp: number;
    };
    public details?: string;
    public name: string;
    public started: {
        at?: Date;
        timestamp?: number;
    };
    public state?: string;
    public type: ActivityType;
    public URL?: string;

    constructor(data: GatewayActivity) {
        this.created = {
            at: new Date(data.created_at),
            timestamp: data.created_at
        };
        this.details = data.details || undefined;
        this.name = data.name;
        this.started = {
            at: data.timestamps?.start ? new Date(data.timestamps.start) : undefined,
            timestamp: data.timestamps?.start
        };
        this.state = data.state || undefined;
        this.type = Object
            .keys(activityTypes)
            .find((key) => activityTypes[key as ActivityType] == data.type) as ActivityType;
        this.URL = data.url || undefined;
    }
}

export const statuses = {
    DoNotDisturb: 'dnd',
    Idle: 'idle',
    Offline: 'offline',
    Online: 'online'
} as const;

export type Status = keyof typeof statuses;

export default class Presence {
    public activities: Activity[];
    public custom: {
        text?: string;
        emoji?: string;
    };
    public client: {
        desktop: Status;
        mobile: Status;
        web: Status;
    };
    public status: Status;

    constructor(data?: GatewayPresenceUpdateDispatchData) {
        this.activities = data?.activities
            ?.filter((activity) => activity.type != activityTypes.Custom)
            .map((activity) => new Activity(activity)) || [];

        const custom = data?.activities?.find((activity) => activity.type == activityTypes.Custom);
        let emoji: string | undefined;

        if (custom?.emoji) {
            if (custom.emoji.id) {
                emoji = `<${custom.emoji.animated ? 'a' : ''}:${custom.emoji.name}:${custom.emoji.id}>`;
            } else {
                emoji = custom.emoji.name || undefined;
            }
        } else {
            emoji = undefined;
        }

        this.custom = {
            text: custom?.state || undefined,
            emoji
        };

        const client = data?.client_status;
        this.client = {
            desktop: Object
                .keys(statuses)
                .find((key) => statuses[key as Status] == client?.desktop) as Status || 'Offline',
            mobile: Object
                .keys(statuses)
                .find((key) => statuses[key as Status] == client?.mobile) as Status || 'Offline',
            web: Object
                .keys(statuses)
                .find((key) => statuses[key as Status] == client?.web) as Status || 'Offline',
        };

        this.status = Object
            .keys(statuses)
            .find((key) => statuses[key as Status] == data?.status) as Status || 'Offline';
    }
}