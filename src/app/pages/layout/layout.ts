import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import Swal from 'sweetalert2';

import {
  Router,
  RouterOutlet,
  RouterLink,
  RouterLinkActive
} from '@angular/router';


@Component({

  selector:'app-layout',

  standalone:true,

  imports:[
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],

  templateUrl:'./layout.html',

  styleUrl:'./layout.css'

})


export class Layout implements OnInit {


  constructor(
    private router: Router
  ){}



  user:any = null;

  sidebarOpen = false;



  ngOnInit(){


    this.loadUser();


  }



  loadUser(){


    const session = localStorage.getItem('user');


    if(session){

      this.user = JSON.parse(session);

    }


  }



  isAdmin():boolean{


    return this.user?.role === 'admin';


  }



  isOfficer():boolean{


    return this.user?.role === 'officer';


  }



  isMember():boolean{


    return this.user?.role === 'member';


  }



  logout(){


    Swal.fire({


      title:'Logout',

      text:'Are you sure you want to log out?',

      icon:'question',


      showCancelButton:true,


      confirmButtonText:'Yes, Logout',

      cancelButtonText:'Cancel',


      confirmButtonColor:'#dc2626',

      cancelButtonColor:'#6b7280'


    })
    .then(result=>{


      if(result.isConfirmed){


        localStorage.removeItem('user');


        this.router.navigate(['/login']);


      }


    });


  }

  toggleSidebar(){

    this.sidebarOpen = !this.sidebarOpen;

  }


  closeSidebar(){

      this.sidebarOpen = false;

  }


}
