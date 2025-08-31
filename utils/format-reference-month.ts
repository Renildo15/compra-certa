export function formatReferenceMonth(month: string) {
  const [year, m] = month.split("-");
  return `${m}/${year}`;
}