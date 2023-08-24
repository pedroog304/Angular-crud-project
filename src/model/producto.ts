export class Producto{
    constructor(public sku:number = 0, 
        public articulo:string = "", 
        public marca:string ="", 
        public modelo:string = "", 
        public departamento:number = 0,
        public clase:number = 0,
        public familia:number = 0, 
        public fecha_alta:string ="", 
        public stock:number =0, 
        public cantidad:number=0, 
        public descontinuado:number=0, 
        public fecha_baja:string =""){

    }
}