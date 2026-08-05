export const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export function getCurrentPeriod(): { mes: string; anio: string } {
  const now = new Date();
  return {
    mes: MONTHS[now.getMonth()] || 'Enero',
    anio: String(now.getFullYear()),
  };
}