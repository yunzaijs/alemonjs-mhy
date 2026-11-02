/** Resolve the recent three calendar months once for both commands and Expose. */
export function resolveLedgerMonth(month = new Date().getMonth() + 1, now = new Date()): { month: number; year: number } | null {
  for (let offset = 0; offset < 3; offset++) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);

    if (date.getMonth() + 1 === month) {
      return { month, year: date.getFullYear() };
    }
  }

  return null;
}

export function formatLedgerMonth(period: { month: number; year: number }, game: string): string {
  return game === 'sr' ? `${period.year}${String(period.month).padStart(2, '0')}` : String(period.month);
}
