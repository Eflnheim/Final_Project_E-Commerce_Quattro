import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UserDataService } from 'src/app/services/userData/user-data.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  constructor(
    private userDataService: UserDataService,
    private api: ApiService
  ) { }

  filteredOrders: any[] = []; // Daftar pesanan yang sudah difilter
  user: any;
  orders: any[] = [];
  loading: boolean = false;
  currentFilter: string = 'all'; // Status filter saat ini

  ngOnInit() {
    this.loadUserData();
  }

  async loadUserData() {
    try {
      this.loading = true; 
      this.user = await this.userDataService.getToken();
      console.log(this.user.user_id)
      this.api.getUserOrder(this.user.user_id).subscribe((data: any) => {
        console.log(data); // Log the full response
        if (data.success === 1) {
          this.orders = data.orders;
          this.applyFilter(this.currentFilter);
          console.log(this.orders); // Log the orders after assignment
        } else {
          console.error('Error fetching orders:', data.message);
        }
        this.loading = false; // Set loading to false after the API call
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  applyFilter(filter: string) {
    this.currentFilter = filter;
    if (filter === 'all') {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(order => order.order_status === filter);
    }
  }

}
