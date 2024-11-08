export interface Estacionamiento {
    length: number;
    estado: string;
    habilitada: any;
    id: number;
    patente: string;
    horaIngreso: string;
    horaEgreso: string|null;
    costo: number|null;
    idUsuarioIngreso: string;
    idUsuarioEgreso: string|null;
    idCochera: number;
    eliminado: null; 
}