export type ListType = 'mercado' | 'pedido';
export type List = {
    id: string;
    name: string;
    type: ListType;
    ref_month?: string;
    created_at: string;
}