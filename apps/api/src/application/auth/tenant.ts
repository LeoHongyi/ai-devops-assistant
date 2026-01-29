export function normalizeTenantSlug(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, "-");
}
