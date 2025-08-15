import {Request} from 'express';

export interface LoginRequest {
    mail: string;
    contrasenia: string;
}

export interface RegisterRequest {
    mail: string;
    contrasenia: string;
    nombre: string;
    nombreUsuario?: string; // Opcional, se puede generar automáticamente
    fechaNacimiento?: string; // Opcional, se puede poner fecha por defecto
}

/*Define qué responde el backend cuando el login es exitoso.*/
export interface LoginResponse {
    token: string;
    user: {
        id: number; 
        mail: string;
        nombre: string;
    };
}

export interface AuthenticatedRequest extends Request { 
    user?: {
        id: number;
        mail: string;
        nombre: string;
    };
}

/*Define qué información va dentro del JWT.*/
export interface JwtPayload {
  id: number;
  mail: string;
  nombre: string;
  iat?: number; // Timestamp de cuándo se creó el token
  exp?: number; // Timestamp de cuándo expira el token
}