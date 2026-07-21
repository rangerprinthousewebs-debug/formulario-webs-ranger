export interface CompanyConfig {
  id: string;
  name: string;
  hostnames: string[];
  logoUrl?: string;
  primaryColor: string; // Hex color code
  accentColor: string;  // Hex color code for secondary elements
  address: string;
  email: string;
  phone: string;
}

export const rangerCompany: CompanyConfig = {
  id: 'ranger',
  name: 'Ranger Print House',
  hostnames: ['ranger.localhost', 'formulario.rangerprinthouse.com', 'rangerprinthouse.com', 'localhost'],
  logoUrl: '/ranger-logo.png',
  primaryColor: '#000000', // Elegante negro
  accentColor: '#1F2937',
  address: '16801 Radholme Ct Ste G, Round Rock, TX 78664',
  email: 'sales@rangerprinthouse.com',
  phone: '+1 512-607-4026'
};

export const companies: CompanyConfig[] = [rangerCompany];

export const defaultCompany: CompanyConfig = rangerCompany;

export function getCompanyByHostname(_hostname: string): CompanyConfig {
  // Retorna siempre Ranger Print House, ya que este repositorio es exclusivo para ellos.
  return rangerCompany;
}
