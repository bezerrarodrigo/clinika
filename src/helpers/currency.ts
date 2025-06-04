export const formatCurrencyInCents = (valueInCents: number): string => {
  const valueInReais = valueInCents / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valueInReais);
};
