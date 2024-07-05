import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Storage } from '@ionic/storage-angular';
import { UserDataService } from 'src/app/services/userData/user-data.service';


@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {

  product: any;
  productId: any;
  dataUser: any;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private storage: Storage,
    private router: Router,
    private userDataService: UserDataService
  ) { }

  async ngOnInit() {
    await this.storage.create();
    this.productId = this.route.snapshot.paramMap.get('id');
    this.getProduct(this.productId);
    this.userDataService.getUser().subscribe((data: any) => {
      this.dataUser = data
    })
  }

  isUserDataComplete(): boolean {
    return this.dataUser && this.dataUser.address && this.dataUser.phone_number
  }

  getProduct(productId: any) {
    this.api.getProductById(productId).subscribe((data: any) => {
      this.product = data['data'];
    });
  }

  async addToCart() {
    let cart = await this.storage.get('cart') || [];
    let existingProduct = cart.find((products : any) => products.product_id === this.product.product_id);
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.push({
        product_id: this.product.product_id,
        product_name: this.product.product_name,
        product_price: this.product.product_price,
        image: this.product.image,
        quantity: 1 
      });
    }
    await this.storage.set('cart', cart);
  }

  async cancelAddToCart() {
    console.log('Add to cart canceled');
    this.router.navigate(['/home']);
  }
}
