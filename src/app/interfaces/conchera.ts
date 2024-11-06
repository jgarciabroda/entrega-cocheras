import { Estacionamiento } from "./estacionamiento";

export interface Cochera {
    cochera: { patente: any; };
    id: number,
    descripcion: string,
    deshabilitada: boolean,
    eliminada: boolean,
    activo: {patente:string} | null
}