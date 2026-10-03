export function formatCurrency(value: number | string): string {
    return new Intl.NumberFormat('en-IN').format(Number(value));
}