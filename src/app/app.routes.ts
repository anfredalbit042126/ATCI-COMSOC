import { Routes } from '@angular/router';

import { Dashboard } from './pages/dashboard/dashboard';
import { Member } from './pages/member/member';
import { Officer } from './pages/officer/officer';
import { Profile } from './pages/profile/profile';
import { Login } from './pages/login/login';
import { Layout } from './pages/layout/layout';

import { authGuard } from './auth-guard';


export const routes: Routes = [

  {
    path:'login',
    component:Login
  },


  {
    path:'',
    component:Layout,
    canActivate:[authGuard],

    children:[

      {
        path:'',
        component:Dashboard
      },


      {
        path:'member',
        component:Member
      },


      {
        path:'officer',
        component:Officer
      },


      {
        path:'profile',
        component:Profile
      }

    ]

  },


  {
    path:'**',
    redirectTo:'login'
  }

];
