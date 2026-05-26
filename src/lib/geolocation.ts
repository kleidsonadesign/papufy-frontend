const LOCATION_MANUAL_KEY = "papufy_location_manual";

export function isLocationManual(): boolean {
  try {
    return localStorage.getItem(LOCATION_MANUAL_KEY) === "1";
  } catch {
    return false;
  }
}

export function markLocationManual(): void {
  try {
    localStorage.setItem(LOCATION_MANUAL_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function clearLocationManual(): void {
  try {
    localStorage.removeItem(LOCATION_MANUAL_KEY);
  } catch {
    /* ignore */
  }
}

function ufFromNominatimAddress(
  address: Record<string, string> | undefined
): string | null {
  if (!address) return null;
  const iso = address["ISO3166-2-lvl4"];
  if (iso?.startsWith("BR-") && iso.length === 5) {
    return iso.slice(3).toUpperCase();
  }
  return null;
}

export async function reverseGeocode(
  lat: number,
  lon: number
): Promise<{ cidade: string; uf: string } | null> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    format: "json",
    "accept-language": "pt-BR",
    addressdetails: "1",
  });

  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params}`,
    {
      headers: {
        Accept: "application/json",
        "User-Agent": "Papufy/1.0 (https://papufy.com; contato@papufy.com)",
      },
    }
  );

  if (!response.ok) return null;

  const data = (await response.json()) as {
    address?: Record<string, string>;
  };

  const address = data.address;
  const cidade =
    address?.city ??
    address?.town ??
    address?.municipality ??
    address?.village ??
    address?.suburb;

  const uf = ufFromNominatimAddress(address);

  if (!cidade || !uf || cidade.length < 2) return null;

  return { cidade, uf: uf.toUpperCase() };
}

/** GPS + reverse geocode (Nominatim). Retorna null se negado ou indisponível. */
export function detectUserCity(): Promise<{ cidade: string; uf: string } | null> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const loc = await reverseGeocode(
            position.coords.latitude,
            position.coords.longitude
          );
          resolve(loc);
        } catch {
          resolve(null);
        }
      },
      () => resolve(null),
      {
        enableHighAccuracy: false,
        timeout: 12_000,
        maximumAge: 5 * 60 * 1000,
      }
    );
  });
}
