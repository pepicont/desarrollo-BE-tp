import {Request} from 'express';

export interface LoginRequest {
    mail: string;
    contrasenia: string;
}

export interface RegisterRequest {
    mail: string;
    contrasenia: string;
    nombreUsuario: string;
    nombre: string;
    fechaNacimiento: string;
}

/*Define qué responde el backend cuando el login es exitoso.*/
export interface LoginResponse {
    token: string;
    user: {
        id: number; 
        mail: string;
        nombre: string;
        tipoUsuario: string;
        urlFoto: string;
    };
}

export interface AuthenticatedRequest extends Request { 
    user?: {
        id: number;
        mail: string;
        nombre: string;
        tipoUsuario: string;
        urlFoto: string;
    };
}

/*Define qué información va dentro del JWT.*/
export interface JwtPayload {
    id: number;
    mail: string;
    nombre: string; //nombre real, no de usuario
    tipoUsuario: string;
    urlFoto: string;
    iat?: number; // Timestamp de cuándo se creó el token
    exp?: number; // Timestamp de cuándo expira el token
}