export type Profile = {
    id: string;
    name: string;
    image?: string;
    type: string;
    roles: string[];
    tags: string[];
    references?: Record<string, string | number | boolean | null>;
    active: boolean;
    created: Date;
    updated: Date;
};
export type ProfileExtended = Profile;
export type ProfileInput = {
    id?: string;
    name: string;
    image?: string;
    type?: string;
    roles: string[];
    tags?: string[];
    references?: Record<string, string | number | boolean | null>;
    active?: boolean;
    created?: Date;
    updated?: Date;
};
//# sourceMappingURL=types.d.ts.map