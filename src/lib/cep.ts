export interface CepAddress {
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
}

export function normalizeCep(value: string): string {
  return value.replace(/\D/g, "").slice(0, 8);
}

export async function lookupCep(cep: string): Promise<CepAddress | null> {
  const normalized = normalizeCep(cep);
  if (normalized.length !== 8) return null;

  const response = await fetch(`https://viacep.com.br/ws/${normalized}/json/`);
  if (!response.ok) return null;

  const data = (await response.json()) as {
    erro?: boolean;
    logradouro?: string;
    bairro?: string;
    localidade?: string;
    uf?: string;
  };

  if (data.erro) return null;

  return {
    logradouro: data.logradouro?.trim() ?? "",
    bairro: data.bairro?.trim() ?? "",
    cidade: data.localidade?.trim() ?? "",
    uf: data.uf?.trim().toUpperCase() ?? "",
  };
}
