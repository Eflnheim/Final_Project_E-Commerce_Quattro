import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  listProducts: any[] = [];
  totalPrice: number = 0;

  constructor(
    private storage: Storage,
    private alertCtrl : AlertController
  ) { }

  async ngOnInit() {
    await this.storage.create();
    this.getCartProducts();
  }

  async getCartProducts() {
    this.listProducts = await this.storage.get('cart') || [];
    console.log(this.listProducts);
    this.calculateTotalPrice();
  }

  async removeFromCart(index: number) {
    this.listProducts.splice(index, 1); 
    await this.storage.set('cart', this.listProducts); 
    this.calculateTotalPrice(); 
  }

  calculateTotalPrice() {
    this.totalPrice = this.listProducts.reduce((sum, product) => sum + (product.product_price * product.quantity|| 0), 0);
  }

  async increaseQty(index : number) {
    this.listProducts[index].quantity += 1;
    await this.storage.set('cart', this.listProducts);
    this.calculateTotalPrice();
  }

  async decreaseQty(index: number) {
    if (this.listProducts[index].quantity > 1) {
      this.listProducts[index].quantity -= 1;
      await this.storage.set('cart', this.listProducts);
      this.calculateTotalPrice();
    }
  }

  isCartEmpty() : boolean {
    if (this.listProducts.length === 0) {
      return true
    } else {
      return false
    }
  }

  async confirmRemoveItem(index: number, name: string) {
    const alert = await this.alertCtrl.create({
      header: 'Remove Item',
      message: 'Are you sure you want to remove '+ name +' ?',
      buttons: [
        {
          text: 'Yes',
          handler: () => this.removeFromCart(index)
        },
        {
          text: 'No'
        }
      ],
      cssClass: 'custom-alert'
    })
    await alert.present();
  }

}
