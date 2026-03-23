/**
 * Formatea un número como moneda según el código de moneda
 * @param amount - Cantidad a formatear
 * @param currencyCode - Código de moneda (COP, USD, EUR, etc.)
 * @returns String formateado con la moneda
 */
export const formatCurrency = (amount: number, currencyCode: string = 'COP'): string => {
  // Mapeo de códigos de moneda a símbolos
  const currencySymbols: Record<string, string> = {
    COP: '',
    USD: '$',
    EUR: '€',
    MXN: '$',
    ARS: '$',
  };

  const symbol = currencySymbols[currencyCode] || '';

  // Formatear número con separadores de miles
  const formattedNumber = amount.toLocaleString('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // Para COP, mostrar el código después del número
  if (currencyCode === 'COP') {
    return `${formattedNumber} ${currencyCode}`;
  }

  // Para otras monedas, mostrar símbolo antes
  return `${symbol}${formattedNumber}`;
};

/**
 * Formatea un número con separadores de miles
 * @param value - Número a formatear
 * @returns String formateado
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
