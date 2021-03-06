import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../model/product';
import { ProductService } from '../../service/product.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  productosList: Product[] = [];
  keyP: string;
  usuario: string;
  logged: boolean;
  carrito: Product[] = [];
  cantidad = 1;
  
  constructor(private route: ActivatedRoute,
              private productService: ProductService,
              public afAuth: AngularFireAuth) { }

  ngOnInit(){
    this.afAuth.authState.subscribe( data => {
      if (data != null){
        this.logged = true;
        this.usuario = data.email;
      }else{
        this.logged = false;
      }
    });

    this.route.params.subscribe(params => {
      this.keyP = params['key'];
      this.productService.getProductbyKey(this.keyP)
      .snapshotChanges().subscribe(item => {
        this.productosList = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x['$key'] = element.key;
          this.productosList.push(x as Product);
        });
        console.log(this.productosList[0]);
      });
    });

    if(JSON.parse(localStorage.getItem('carrito')) == null){
      localStorage.setItem('carrito', JSON.stringify(this.carrito));
    }
    
  }

  agregarcarrito(){
    this.carrito = JSON.parse(localStorage.getItem('carrito'));
    let ob = this.productosList[0];
    ob.cantidadSeleccionada = this.cantidad;
    this.carrito.push(ob);
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
    alert('Se ha agregado el artículo al carrito');
  }
}
