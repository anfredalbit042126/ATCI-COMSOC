import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  collection,
  getDocs,
  query,
  where
} from 'firebase/firestore';

import Swal from 'sweetalert2';

import { db } from './../../firebase';


interface UserAccount {

  firstName: string;
  lastName: string;
  middleName?: string;
  role: string;
  pin: string;
  position?: string;

}


@Component({

  selector: 'app-login',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './login.html',
  styleUrl: './login.css'

})


export class Login {


  isLoading = false;

  pin = '';


  constructor(
    private router: Router
  ) {

    if(localStorage.getItem('user')) {

      this.router.navigate(['/']);

    }

  }


  async login() {


    if(this.isLoading) return;


    if(!/^[0-9]{6}$/.test(this.pin)) {


      Swal.fire({

        icon:'warning',

        title:'Invalid PIN',

        text:'PIN must be exactly 6 digits.',

        confirmButtonColor:'#2563EB'

      });


      return;

    }


    this.isLoading = true;


    Swal.fire({

      title:'Checking account...',

      text:'Please wait',

      allowOutsideClick:false,

      allowEscapeKey:false,

      didOpen:()=>{

        Swal.showLoading();

      }

    });



    try {


      // ADMIN

      const adminSnap = await getDocs(

        query(

          collection(db,'admins'),

          where('pin','==',this.pin)

        )

      );


      if(!adminSnap.empty) {


        const admin =
        adminSnap.docs[0].data() as UserAccount;


        this.saveUser({

          id: adminSnap.docs[0].id,

          firstName:admin.firstName,

          lastName:admin.lastName,

          role:admin.role,

          position:admin.position

        });


        await this.successLogin(admin.firstName);

        return;

      }



      // OFFICER

      const officerSnap = await getDocs(

        query(

          collection(db,'officers'),

          where('pin','==',this.pin)

        )

      );


      if(!officerSnap.empty) {


        const officer =
        officerSnap.docs[0].data() as UserAccount;


        this.saveUser({

          id: officerSnap.docs[0].id,

          firstName:officer.firstName,

          lastName:officer.lastName,

          role:officer.role,

          position:officer.position

        });


        await this.successLogin(officer.firstName);

        return;

      }




      // MEMBER

      const memberSnap = await getDocs(

        query(

          collection(db,'members'),

          where('pin','==',this.pin)

        )

      );


      if(!memberSnap.empty) {


        const member =
        memberSnap.docs[0].data() as UserAccount;


        this.saveUser({

          firstName:member.firstName,

          lastName:member.lastName,

          role:member.role

        });


        await this.successLogin(member.firstName);

        return;

      }



      // INVALID PIN

      Swal.close();


      this.isLoading = false;


      Swal.fire({

        icon:'error',

        title:'Login Failed',

        text:'Incorrect PIN. Please try again.',

        confirmButtonColor:'#DC2626'

      });



    }


    catch(error) {


      console.error(error);


      Swal.close();


      this.isLoading = false;


      Swal.fire({

        icon:'error',

        title:'Something went wrong',

        text:'Unable to login. Please try again.',

        confirmButtonColor:'#DC2626'

      });


    }


  }



  saveUser(user:any) {


    localStorage.setItem(

      'user',

      JSON.stringify(user)

    );


  }




  async successLogin(name:string) {


    this.isLoading = false;


    await Swal.fire({

      icon:'success',

      title:`Welcome ${name}`,

      text:'Login successful',

      timer:800,

      timerProgressBar:true,

      showConfirmButton:false,

      allowOutsideClick:false

    });


    this.router.navigate(['/']);


  }


}
