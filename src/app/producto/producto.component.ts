import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/model/producto';
import { ProductoService } from '../service/producto.service';
import { MenuItem } from 'primeng/api/menuitem';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit{

  productos: Producto[] = [];
  cols: any[]= [];
  items: MenuItem[]=[];
  displaySaveDialog: boolean =false;
  producto: Producto={
    sku:0, 
         articulo:"", 
         marca:"", 
         modelo:"", 
         departamento: 0,
         clase:0,
         familia:0, 
         fecha_alta:"01-01-2023", 
         stock:0, 
         cantidad:0, 
         descontinuado:0, 
         fecha_baja:""
  }
  selectedProducto: Producto={
    sku:0, 
         articulo:"", 
         marca:"", 
         modelo:"", 
         departamento: 0,
         clase:0,
         familia:0, 
         fecha_alta:"01-01-2023", 
         stock:0, 
         cantidad:0, 
         descontinuado:0, 
         fecha_baja:""
  }

  constructor(private productoService: ProductoService, private messageService: MessageService, private confirmService: ConfirmationService){

  }
  getAll() {
    this.productoService.getAll().subscribe(
      (result: any) => {
        let productos: Producto[] = [];
        for (let i = 0; i < result.length; i++) {
          let producto = result[i] as Producto;
          productos.push(producto);
        }
        this.productos = productos;
      },
      error => {
        console.log(error);
      }
    );
  }

  save(){
    this.productoService.save(this.producto).subscribe(
      (result: any) => {
        let producto =result as Producto;
        this.validarProducto(producto);
        this.productos.push(producto);
        this.messageService.add({severity: 'success', summary: "Resultado", detail:"Se guardó correctamente"})
        console.log(result);
        this.displaySaveDialog = false;

      },
      error => {
        console.log(error);
      }
    );
  }

  delete(){
    if(this.selectedProducto == null || this.selectedProducto.sku == 0){
      this.messageService.add({severity : 'warn', summary: "Advertencia!", detail: "Por favor seleccione un registro"});
      return;
    }
    this.confirmService.confirm({
      message: "¿Está seguro que desea eliminar el registro?",
      accept : () =>{
        this.productoService.delete(this.selectedProducto.sku).subscribe(
          (result:any) =>{
            this.messageService.add({ severity: 'success', summary: "Resultado", detail: "Se eliminó el producto con sku "+result.sku+" correctamente." });
            this.deleteObject(result.sku);
          }
        )
      }
    })
  }
  deleteObject(sku: number) {
    // Eliminar el registro del array
    this.productos = this.productos.filter(producto => producto.sku !== sku);
 }
 
  ngOnInit(): void {
      this.getAll();
      this.cols = [
        { field: "sku", header: "SKU" },
        { field: "articulo", header: "Nombre" },
        { field: "marca", header: "Marca" }
      ];
      this.items = [
        {
          label: "Nuevo",
          icon: 'pi pi-fw pi-plus',
          command: () => this.showSaveDialog(false)
        },
        {
          label: "Editar",
          icon: "pi pi-fw pi-pencil",
          command: () => this.showSaveDialog(true)
        },
        {
          label: "Eliminar", 
          icon: "pi pi-fw pi-times",
          command: () => this.delete()
        }
      ];
  }
  showSaveDialog(editar: boolean) {
    if (editar) {
      if (this.selectedProducto != null && this.selectedProducto.sku != 0) {
        this.producto = this.selectedProducto;
      }else{
        this.messageService.add({severity : 'warn', summary: "Advertencia!", detail: "Por favor seleccione un registro"});
        return;
      }
    } else {
      this.producto = new Producto();
    }
    this.displaySaveDialog = true;
  }
  validarProducto(producto: Producto){
    let index = this.productos.findIndex((e) => e.sku == producto.sku);
    let productos = this.productos;
    if(index != -1){
      productos[index] = producto;
    }else{
      productos.push(producto);
      this.productos = productos;
    }

  }
  
}
