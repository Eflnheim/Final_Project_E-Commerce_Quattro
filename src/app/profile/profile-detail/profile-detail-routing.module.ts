import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileDetailPage } from './profile-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileDetailPage
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./../edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileDetailPageRoutingModule {}
