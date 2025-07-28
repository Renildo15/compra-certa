export type Item = {
    id : string;
    listId: string;
    name: string;
    quantity?: string;
    price?: number;
    category?: string;
    observation?: string;
    purchased?: boolean;
    created_at: string;
};
