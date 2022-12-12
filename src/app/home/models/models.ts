export interface Datos {
    informacionUsuario: {
        nombre: string;
        cedula: string;
        telefono: number;
    }
    informacionCensado: {
        nombre: string;
        cedula: string;
        miembros: number;
        fotos: string;
        ubicacion: {
            lat: number;
            lng: number;
        },
        id: string
    }
}