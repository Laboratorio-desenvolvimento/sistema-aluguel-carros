import { API_URL } from "~/services/api.service";

export function resolverFotoVeiculo(foto?: string | null): string | null {
  if (!foto) {
    return null;
  }

  if (foto.startsWith("data:")) {
    return foto;
  }

  if (foto.startsWith("http://") || foto.startsWith("https://")) {
    return foto;
  }

  if (foto.startsWith("/uploads/")) {
    return `${API_URL}${foto}`;
  }

  return `data:image/jpeg;base64,${foto}`;
}
