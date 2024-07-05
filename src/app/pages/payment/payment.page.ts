import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

declare var snap: any; // Deklarasikan snap secara global

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  listProducts: any[] = [];
  totalPrice: number = 0;
  shippingPrice: number = 10000; // Example shipping price
  showShippingOptions: boolean = false;
  selectedShippingOption: string | null = null;
  selectedProducts: any[] = [];
  selectedPaymentMethod: string | null = null; // Tambahkan ini untuk metode pembayaran yang dipilih

  constructor(private storage: Storage, private http: HttpClient) { }

  async ngOnInit() {
    await this.storage.create();
    this.getCartProducts();
  }

  async getCartProducts() {
    this.listProducts = await this.storage.get('cart') || [];
    console.log('Cart Products:', this.listProducts);

    // Check if each product has an ID
    this.listProducts.forEach(product => {
        if (!product.product_id) { // Pastikan menggunakan product_id
            console.error('Product missing ID:', product);
        }
    });

    this.calculateTotalPrice();
  }

  calculateTotalPrice() {
    this.totalPrice = this.listProducts.reduce((sum, product) => {
      const price = product.product_price || 0;
      return sum + price;
    }, 0);
    console.log('Total Price:', this.totalPrice);
  }

  toggleShippingOptions() {
    this.showShippingOptions = !this.showShippingOptions;
  }

  selectShippingOption(option: string) {
    this.selectedShippingOption = option;
    this.showShippingOptions = false;
    console.log('Selected Shipping Option:', this.selectedShippingOption);
  }

  async getSelectedProducts() {
    this.selectedProducts = await this.storage.get('selectedProducts') || [];
    this.calculateTotalPrice();
  }

  async checkout() {
    const orderDetails = {
      gross_amount: this.totalPrice + this.shippingPrice,
      items: this.listProducts.map(product => ({
        id: product.product_id, // Pastikan menggunakan product_id
        price: product.product_price,
        quantity: 1,
        name: product.product_name
      })),
      customer_details: {
        // tambahkan detail pelanggan di sini
      }
    };

    // Validasi bahwa setiap item memiliki ID
    for (let item of orderDetails.items) {
      if (!item.id) {
        console.error('Item without ID found:', item);
        return;
      }
    }

    console.log('Order Details:', orderDetails); // Log order details

    this.http.post(`${environment.apiUrl}/create-transaction`, orderDetails).subscribe((response: any) => {
      if (response.success) {
        const snapToken = response.snap_token;
        snap.pay(snapToken, {
          onSuccess: (result: any) => {
            console.log('Payment Success:', result);
            // handle payment success
          },
          onPending: (result: any) => {
            console.log('Payment Pending:', result);
            // handle payment pending
          },
          onError: (result: any) => {
            console.log('Payment Error:', result);
            // handle payment error
          },
          onClose: () => {
            console.log('Payment closed without finishing');
            // handle payment closed without finishing
          }
        });
      } else {
        console.error('Failed to create transaction:', response.message);
      }
    });
  }
}
