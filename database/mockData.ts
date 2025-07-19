import { DatabaseSchema } from '@/types';

export const mockLists: Omit<DatabaseSchema['lists'], 'created_at'>[] = [
  {
    id: '1',
    name: 'Lista do Mercado',
    type: 'mercado',
    ref_month: '2023-11'
  },
  {
    id: '2',
    name: 'Pedido da Loja',
    type: 'pedido',
    ref_month: '2023-11'
  }
];