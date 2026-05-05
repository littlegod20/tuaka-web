/**
 * Formats a pesewa integer as a GHS currency string.
 * formatGHS(9000) → "GHS 90.00"
 * formatGHS(9050) → "GHS 90.50"
 */
export function formatGHS(pesewas: number): string {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
    }).format(pesewas / 100)
  }
  
  /**
   * Converts a GHS decimal string from a form input to pesewas.
   * toPs("90.50") → 9050
   * toPs("90")    → 9000
   */
  export function toPs(ghsString: string): number {
    const n = parseFloat(ghsString)
    if (isNaN(n)) return 0
    return Math.round(n * 100)
  }
  
  /**
   * Converts pesewas to a plain GHS decimal string for form inputs.
   * fromPs(9050) → "90.50"
   */
  export function fromPs(pesewas: number): string {
    return (pesewas / 100).toFixed(2)
  }