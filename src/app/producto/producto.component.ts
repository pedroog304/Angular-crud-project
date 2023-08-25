import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/model/producto';
import { ProductoService } from '../service/producto.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit{

  productos: Producto[] = [];
  cols: any[]= [];
  item:MenuItem[]=[];

  constructor(private productoService: ProductoService){

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
  ngOnInit(): void {
      this.getAll();
      this.cols = [
        { field: "sku", header: "SKU" },
        { field: "articulo", header: "Nombre" },
        { field: "marca", header: "Marca" }
      ];
      
  }
  
}
