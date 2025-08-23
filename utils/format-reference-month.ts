export function formatReferenceMonth(month: string) {
    const date = new Date(month);
    return date.toLocaleString('pt-BR', { month: '2-digit', year: 'numeric' });
  }