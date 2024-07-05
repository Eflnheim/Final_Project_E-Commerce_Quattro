import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import Swiper from 'swiper';
import { UserDataService } from '../services/userData/user-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {

  products: any[] = [];
  allProducts: any[] = [];
  swiper!: Swiper;
  query!: string;
  dataUser: any;
  selectedCategoryId: string = "0";

  constructor(
    private api: ApiService,
    private userDataService: UserDataService
  ) { }

  ngOnInit() {
    this.getListProducts();
    this.loadUserData();
  }

  ngAfterViewInit() {
    this.swiper = new Swiper('.swiper-container', {
      slidesPerView: 'auto',
      spaceBetween: 20,
      loop: true,
    });
  }

  getListProducts() {
    this.api.getListProducts().subscribe( (data:any) => {
      this.allProducts = data['data'];
      this.products = [...this.allProducts];
    })
  }

  toggleSearchbarWidth() {
    const searchBar = document.querySelector('ion-searchbar');
    if (searchBar) {
      searchBar.classList.toggle('active');
    }
  }

  onSearchChange(event: any) {
    console.log(event.detail.value);
    this.query = event.detail.value.toLowerCase();
    this.querySearch();
  }

  querySearch() {
    this.products = [];
    if (this.query.length > 0) {
      this.searchItems();
    }else{
      this.products = [...this.allProducts];
    }
  }

  searchItems() {
    this.products = this.allProducts.filter((product) =>
      product.product_name.toLowerCase().includes(this.query)
    );
  }

  filterByCategory(categoryId: string) {
    this.selectedCategoryId = categoryId;
    console.log(this.selectedCategoryId);
    if (categoryId === "0") { 
      this.products = [...this.allProducts];
      console.log(this.products)
      console.log(this.allProducts)
    } else {
      console.log(categoryId);
      this.products = this.allProducts.filter((products) =>
        products.category_id === categoryId
      );
      console.log(this.products);
    }
  }

  async loadUserData() {
    try {
      this.userDataService.getToken();
      console.log('fungsi ini dipanggil');
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  public categoryItem = [
    {category_id: "0", img: './../../assets/dinner.png', label: 'All'},
    {category_id: "4", img: './../../assets/dish.png', label: 'Foods'},
    {category_id: "3", img: './../../assets/cocktail.png', label: 'Drinks'},
    {category_id: "5", img: './../../assets/ice-cream.png', label: 'Dessert'}
  ];

}
