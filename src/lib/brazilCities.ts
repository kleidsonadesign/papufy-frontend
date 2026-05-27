const cityCache = new Map<string, string[]>();

export async function getCitiesByUf(uf: string): Promise<string[]> {
  const normalizedUf = uf.trim().toUpperCase();
  if (!normalizedUf) return [];

  const fromCache = cityCache.get(normalizedUf);
  if (fromCache) return fromCache;

  const response = await fetch(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${normalizedUf}/municipios`
  );

  if (!response.ok) {
    throw new Error(`Falha ao carregar cidades de ${normalizedUf}`);
  }

  const payload = (await response.json()) as Array<{ nome: string }>;
  const cities = payload
    .map((item) => item.nome.trim())
    .filter((name) => name.length > 0)
    .sort((a, b) => a.localeCompare(b, "pt-BR"));

  cityCache.set(normalizedUf, cities);
  return cities;
}
