import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserDataService } from 'src/app/services/userData/user-data.service';
import { ApiService } from 'src/app/services/api.service';

declare var snap: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  listProducts: any[] = [];
  totalPrice: number = 0;
  grandPrice: number = 0;
  shippingPrice: number = 0;
  showShippingOptions: boolean = false;
  selectedShippingOption: string | null = null;

  gross_amount: number = 0

  userData: any;

  constructor(
    private storage: Storage, 
    private http: HttpClient,
    private router: Router,
    private alertCtrl: AlertController,
    private userDataService: UserDataService,
    private api: ApiService
  ) {}

  async ngOnInit() {
    await this.storage.create();
    this.getCartProducts();
    this.userDataService.getUser().subscribe(data => {
      this.userData = data;
      console.log(this.userData)
    });
  }

  async getCartProducts() {
    this.listProducts = await this.storage.get('cart') || [];
    console.log(this.listProducts);
    this.calculateTotalPrice();
  }

  calculateTotalPrice() {
    this.totalPrice = this.listProducts.reduce((sum, product) => sum + (product.product_price * product.quantity|| 0), 0);
    this.grandPrice = this.listProducts.reduce((sum, product) => sum + (product.product_price * product.quantity|| 0), 0) + this.shippingPrice;
  }

  toggleShippingOptions() {
    this.showShippingOptions = !this.showShippingOptions;
  }

  selectShippingOption(option: string) {
    this.selectedShippingOption = option;
    this.showShippingOptions = false;
    this.shippingPrice = option === 'delivery' ? 10000 : 0;
    console.log(this.selectedShippingOption);
    this.calculateTotalPrice();
  }

  async createOrderToDB(order: any) {
    this.api.createTransaction(order).subscribe(
      (response: any) => {
        console.log('berhasil ditambahkan', response);
      }
    );
  }


  async checkout() {
    const shippingItem = {
      id: 'shipping_fee',
      name: 'Shipping Fee',
      price: this.shippingPrice,
      quantity: 1  
    };
    const orderDetails = {
      gross_amount: this.grandPrice,
      items: [
        ...this.listProducts.map(product => ({
          id: product.product_id,
          price: product.product_price,
          quantity: product.quantity,
          name: product.product_name,
        })),
        shippingItem  
      ],
      customer_details: {
        first_name: this.userData.first_name || this.userData.username,
        last_name: this.userData.last_name || '',
        email: this.userData.email,
        phone: this.userData.phone_number,
        billing_address: {
          first_name: this.userData.first_name || this.userData.username,
          last_name: this.userData.last_name || '',
          email: this.userData.email,
          phone: this.userData.phone_number,
          address: this.userData.address || '',
          city: this.userData.city || '',
          postal_code: this.userData.postal_code || '',
          country_code: 'IDN'
        },
      }
    };
    const orderDetailsDB = {
      user_id : this.userData.user_id,
      shipping_option : this.selectedShippingOption,
      shipping_price : this.shippingPrice,
      items: this.listProducts.map(product => ({
        product_id : product.product_id,
        quantity : product.quantity
      }))
    };

    console.log("Order Details for DB:", orderDetailsDB);

    this.http.post(`${environment.apiUrl}/create-transaction`, orderDetails).subscribe((response: any) => {
      if (response.success) {
        const snapToken = response.snap_token;
        snap.pay(snapToken, {

          onSuccess: (result: any) => {
            this.createOrderToDB(orderDetailsDB);
            this.clearCart();
            this.router.navigateByUrl('/home');
          },

          onPending: (result: any) => {
            // Handle payment pending
          },

          onError: (result: any) => {
            // Handle payment error
          },

          onClose: () => {
            // Handle payment closed without finishing
          }
        });
      } else {
        console.error('Failed to create transaction:', response.message);
      }
    });
  }

  showAlertInfo(message: any) {
    this.alertCtrl.create({
      header: 'Transaction Information',
      message: message,
      buttons: [{
        text: 'Close', 
        handler: () => {
          
        }
      }]
    }).then(alert => {
      alert.present(); 
    });
  }

  async clearCart() {
    await this.storage.remove('cart');
  }
}