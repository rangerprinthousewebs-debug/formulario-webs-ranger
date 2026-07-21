export interface CompanyConfig {
  id: string;
  name: string;
  hostnames: string[]; // Hostnames (e.g. ['localhost', 'formulario.empresa1.com', 'empresa1.com'])
  logoUrl?: string;
  primaryColor: string; // Hex color code
  accentColor: string;  // Hex color code for secondary elements
  address: string;
  email: string;
  phone: string;
}

export const companies: CompanyConfig[] = [
  {
    id: 'ranger',
    name: 'Ranger Print House',
    hostnames: ['ranger.localhost', 'formulario.rangerprinthouse.com', 'rangerprinthouse.com', 'localhost'],
    logoUrl: '/ranger-logo.png',
    primaryColor: '#000000', // Elegante negro para contraste
    accentColor: '#1F2937',
    address: '16801 Radholme Ct Ste G, Round Rock, TX 78664',
    email: 'sales@rangerprinthouse.com',
    phone: '+1 512-607-4026'
  },
  {
    id: 'empresa2',
    name: 'Empresa Beta',
    hostnames: ['beta.localhost', 'formulario.empresa2.com', 'empresa2.com'],
    logoUrl: '',
    primaryColor: '#10B981', // Verde Esmeralda
    accentColor: '#065F46',
    address: 'Avenida Siempre Viva 742, Ciudad Beta',
    email: 'soporte@empresa2.com',
    phone: '+1 (555) 0200'
  },
  {
    id: 'empresa3',
    name: 'Empresa Gamma',
    hostnames: ['gamma.localhost', 'formulario.empresa3.com', 'empresa3.com'],
    logoUrl: '',
    primaryColor: '#8B5CF6', // Violeta Creativo
    accentColor: '#5B21B6',
    address: 'Bulevar de los Sueños 456, Ciudad Gamma',
    email: 'info@empresa3.com',
    phone: '+1 (555) 0300'
  }
];

// Configuración por defecto si no se detecta coincidencia
export const defaultCompany: CompanyConfig = {
  id: 'default',
  name: 'Rueda La Rola',
  hostnames: [],
  logoUrl: '',
  primaryColor: '#2563EB',
  accentColor: '#1E293B',
  address: 'Dirección General, Ciudad',
  email: 'hola@ruedalarola.com',
  phone: '+1 (555) 0000'
};

export function getCompanyByHostname(hostname: string): CompanyConfig {
  // Para pruebas locales fáciles, si es 'localhost' o '127.0.0.1', podemos retornar la primera o leer un query param opcional
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    const params = new URLSearchParams(window.location.search);
    const empresaParam = params.get('empresa');
    if (empresaParam) {
      const found = companies.find(c => c.id === empresaParam);
      if (found) return found;
    }
    return companies[0]; // Por defecto Empresa Alfa en localhost
  }

  // Buscar coincidencia en hostnames
  const match = companies.find(c => c.hostnames.some(h => hostname.includes(h)));
  return match || defaultCompany;
}
