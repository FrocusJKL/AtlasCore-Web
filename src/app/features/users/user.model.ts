export type UserRole = 'Administrador' | 'Operador' | 'Consulta';
export type UserType = 'Interno' | 'Externo';

export interface User {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
  username: string;
  role: UserRole;
  specialty: string;
  birthDate: string;
  position: string;
  gender: string;
  curp: string;
  civilStatus: string;
  workEmail: string;
  company: string;
  workArea: string;
  entryDate: string;
  limitCompany: boolean;
  userType: UserType;
  client: string;
  active: boolean;
  createdAt: string;
  deactivationReason?: string;
}

export interface UserDraft {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
  username: string;
  password?: string;
  role: UserRole;
  specialty: string;
  birthDate: string;
  position: string;
  gender: string;
  curp: string;
  civilStatus: string;
  workEmail: string;
  company: string;
  workArea: string;
  entryDate: string;
  limitCompany: boolean;
  userType: UserType;
  client: string;
  active: boolean;
  deactivationReason?: string;
}