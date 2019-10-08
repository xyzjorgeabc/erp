export function sumarPorc(num: number, porc: number): number {
  return num * (1 + porc / 100);
}
export function restarPorc(num: number, porc: number): number {
  return num * (1 - porc / 100);
}
export function descontarPorc(num: number, porc: number): number {
  return num / (1 + porc / 100);
}
export function fixNoRound(num: number, decs: number): string {
  const str: string = num.toString();
  const i: number = str.indexOf('.');
  if (!~i || ~str.indexOf('e') || str.length > 15) {
    return str;
  }
  return str.slice(0, !decs ? i : i + decs + 1);
}
export function getMargen(numDesde: number, numHasta: number): number {
  return (numHasta / numDesde - 1) / 100;
}
export function getPorc(num: number, porc: number ): number {
  return num * (1 + porc / 100) - num;
}
