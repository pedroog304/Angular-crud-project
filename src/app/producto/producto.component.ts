import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/model/producto';
import { ProductoService } from '../service/producto.service';
import { MenuItem } from 'primeng/api/menuitem';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Departamento } from 'src/model/departamento';
import { Clase } from 'src/model/clase';
import { Familia } from 'src/model/familia';
import { DepartamentoService } from '../service/departamento.service';
import { ClaseService } from '../service/clase.service';
import { FamiliaService } from '../service/familia.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit{

  productos: Producto[] = [];
  cols: any[]= [];
  displaySaveDialog: boolean =false;
  searchSkuDialog: boolean =false;
  existOptions: boolean =false;
  showDescontinuado:boolean=false;
  showTable:boolean = false;
  departamentos: Departamento[]=[];
  clases: Clase[]=[];
  familias: Familia[]=[];

  producto: Producto={
    sku:0, 
         articulo:"", 
         marca:"", 
         modelo:"", 
         departamento: 1,
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

  constructor(private productoService: ProductoService, private messageService: MessageService, private confirmService: ConfirmationService,private departamentoService: DepartamentoService,
    private claseService: ClaseService, private familiaService: FamiliaService){

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
  showDetail(){
    this.productoService.getById(this.selectedProducto.sku).subscribe(
      (result: any) => {
        let productos: Producto[] = [];
          let producto = result as Producto;
          productos.push(producto);
        this.productos = productos;
      },
      error => {
        console.log(error);
      }
    );
    this.existOptions=false;
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
            this.existOptions=false;
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
        { field: "marca", header: "Marca" },
        { field: "modelo", header: "Modelo" },
        { field: "departamento", header: "Departamento" },
        { field: "clase", header: "Clase" },
        { field: "familia", header: "Familia" },
        { field: "fecha_alta", header: "Fecha alta" },
        { field: "stock", header: "Stock" },
        { field: "cantidad", header: "Cantidad" },
        { field: "descontinuado", header: "Descontinuado" },
        { field: "fecha_baja", header: "Fecha baja" }
      ];
      this.departamentoService.getAll().subscribe((departamentos) => {
        this.departamentos = departamentos;
      });
  }
  showSaveDialog(editar: boolean) {
    if (editar) {
      if (this.selectedProducto != null && this.selectedProducto.sku != 0) {
        this.producto = this.selectedProducto;
        this.existOptions=false;
        this.showDescontinuado =true;
        this.onDepartamentoChange();
        this.onClaseChange();
      }else{
        this.messageService.add({severity : 'warn', summary: "Advertencia!", detail: "Por favor seleccione un registro"});
        return;
      }
    } else {
      this.producto = new Producto();
    }
    this.displaySaveDialog = true;
  }
  showSearchDialog() {
    this.searchSkuDialog = true;
    }
    showOptions(){
      this.getAll();
      let index = this.productos.findIndex((e) => e.sku == this.selectedProducto.sku);
      this.searchSkuDialog=false;
      if(index != -1){
        this.selectedProducto = this.productos[index];
        this.existOptions=true;
      }else{
        this.producto.sku= this.selectedProducto.sku;
        this.displaySaveDialog=true;
      }
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
  onDepartamentoChange():void {
    this.clases =[];
    this.familias= [];
    this.claseService.getAll().subscribe((result) => {
      let clases: Clase[] = [];
      for (let i = 0; i < result.length; i++) {
        let clase = result[i] as Clase;
        if(clase.departamento == this.producto.departamento){
        clases.push(clase);
        }
      }
      this.clases = clases;
    });
  }
  onClaseChange():void {
    this.familias =[];
    this.familiaService.getAll().subscribe((result) => {
      let familias: Familia[] = [];
      for (let i = 0; i < result.length; i++) {
        let familia = result[i] as Familia;
        if(familia.clase == this.producto.clase ){
        familias.push(familia);
        }
      }
      this.familias = familias;
    });
  }
  
}
