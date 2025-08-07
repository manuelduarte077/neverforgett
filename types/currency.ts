export interface Currency {
  code: string;
  name: string;
  symbol: string;
  country: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'Dólar Estadounidense', symbol: '$', country: 'Estados Unidos' },
  { code: 'NIO', name: 'Córdoba Nicaragüense', symbol: 'C$', country: 'Nicaragua' },
  { code: 'CRC', name: 'Colón Costarricense', symbol: '₡', country: 'Costa Rica' },
  { code: 'HNL', name: 'Lempira Hondureño', symbol: 'L', country: 'Honduras' },
  { code: 'GTQ', name: 'Quetzal Guatemalteco', symbol: 'Q', country: 'Guatemala' },
];
