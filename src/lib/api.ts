const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

// clients
export function fetchClients(skip = 0, limit = 100) {
  return request(`/clients/?skip=${skip}&limit=${limit}`);
}
export function fetchClient(id: number) {
  return request(`/clients/${id}`);
}
export function createClient(data: any) {
  return request(`/clients/`, { method: "POST", body: JSON.stringify(data) });
}
export function updateClient(id: number, data: any) {
  return request(`/clients/${id}`, { method: "PUT", body: JSON.stringify(data) });
}
export function deleteClient(id: number) {
  return request(`/clients/${id}`, { method: "DELETE" });
}

// authentication
export function loginClient(email: string, mot_de_passe: string) {
  return request(`/login/`, { 
    method: "POST", 
    body: JSON.stringify({ email, mot_de_passe }) 
  });
}

// commandes
export function fetchCommandes(skip = 0, limit = 100) {
  return request(`/commandes/?skip=${skip}&limit=${limit}`);
}
export function createCommande(data: any) {
  return request(`/commandes/`, { method: "POST", body: JSON.stringify(data) });
}

// details_commande
export function fetchDetailsCommandes(skip = 0, limit = 100) {
  return request(`/details_commande/?skip=${skip}&limit=${limit}`);
}

// paiements
export function fetchPaiements(skip = 0, limit = 100) {
  return request(`/paiements/?skip=${skip}&limit=${limit}`);
}

// services
export function fetchServices(skip = 0, limit = 100) {
  return request(`/services/?skip=${skip}&limit=${limit}`);
}
export function createService(data: any) {
  return request(`/services/`, { method: "POST", body: JSON.stringify(data) });
}
