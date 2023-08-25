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
        let producto =result as Producto
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
          icon: "pi pi-fw pi-pencil"
        },
        {
          label: "Eliminar", 
          icon: "pi pi-fw pi-times"
        }
      ];
  }
  showSaveDialog(editar: boolean) {
    this.displaySaveDialog= true;
  }
  
}
