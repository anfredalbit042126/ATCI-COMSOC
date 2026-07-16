import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import Swal from 'sweetalert2';

import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';

import { db } from './../../firebase';



@Component({

  selector: 'app-officer',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './officer.html',

  styleUrl: './officer.css'

})


export class Officer implements OnInit {



  /* ==================================================
     Constructor
  ================================================== */

  constructor(
    private cdr: ChangeDetectorRef
  ) {}




  /* ==================================================
     Form Fields
  ================================================== */

  newLastName = '';
  newFirstName = '';
  newMiddleName = '';
  newPosition = '';
  newPin = '';

  role = 'officer';




  /* ==================================================
     Page State
  ================================================== */

  search = '';

  isOfficer = false;

  showAddModal = false;
  showEditModal = false;


  currentPage = 1;
  itemsPerPage = 10;


  /* ==================================================
     Edit Officer Data
  ================================================== */

  editingOfficer:any = {

    id:'',
    lastName:'',
    firstName:'',
    middleName:'',
    position:'',
    pin:''

  };


  /* ==================================================
     Data
  ================================================== */

  officers:any[] = [];


  positions = [

    'President',

    'Vice President',

    'Secretary',

    'Treasurer',

    'Auditor',

    'Business Manager',

    'Public Information Officer'

  ];



  /* ==================================================
     Lifecycle
  ================================================== */


  async ngOnInit(){


    const user = JSON.parse(
      localStorage.getItem('user') || '{}'
    );


    this.isOfficer = user.role === 'officer';


    await this.loadOfficers();


  }


  /* ==================================================
     Load Officers
  ================================================== */


  async loadOfficers(){


    try{


      const q = query(

        collection(db,'officers'),

        orderBy('createdAt','desc')

      );



      const snapshot = await getDocs(q);



      this.officers = snapshot.docs.map(doc => ({

        id:doc.id,

        ...doc.data()

      }));



      this.cdr.detectChanges();


    }


    catch(error){


      console.error(error);


    }


  }


  /* ==================================================
     Add Officer
  ================================================== */


  async addOfficer(){


  if(

    this.newLastName.trim() === '' ||
    this.newFirstName.trim() === '' ||
    this.newPosition === '' ||
    !/^[0-9]{6}$/.test(this.newPin)

  ){

    Swal.fire({

      icon:'warning',

      title:'Incomplete Information',

      text:'Please complete all required fields and enter a valid 6-digit PIN.',

      confirmButtonColor:'#2563EB',

      heightAuto:false,

      allowOutsideClick:false,

      allowEscapeKey:false,


      didOpen: () => {

        Swal.getPopup()?.style.setProperty(
          'z-index',
          '10000'
        );

      }

    });


    return;

  }



  const result = await Swal.fire({

    title:'Add Officer?',

    text:'Are you sure you want to add this officer?',

    icon:'question',

    allowOutsideClick:false,

    allowEscapeKey:false,

    showCancelButton:true,

    confirmButtonText:'Yes, Add',

    cancelButtonText:'Cancel',

    confirmButtonColor:'#2563EB',

    cancelButtonColor:'#64748B',

    heightAuto:false,

    didOpen: () => {

      Swal.getPopup()?.style.setProperty(
        'z-index',
        '10000'
      );

    }

  });



  if(!result.isConfirmed){

    return;

  }



  try{


    await addDoc(

      collection(db,'officers'),

      {

        lastName:this.newLastName.trim(),

        firstName:this.newFirstName.trim(),

        middleName:this.newMiddleName.trim(),

        role:this.role,

        pin:this.newPin,

        position:this.newPosition,

        createdAt:new Date()

      }

    );


    this.newLastName='';
    this.newFirstName='';
    this.newMiddleName='';
    this.newPosition='';
    this.newPin='';


    this.showAddModal=false;


    await this.loadOfficers();


    Swal.fire({

      icon:'success',

      title:'Officer Added!',

      text:'The officer has been added successfully.',

      confirmButtonColor:'#2563EB',

      heightAuto:false

    });



  }

  catch(error){

    console.error(error);

  }


}


  /* ==================================================
     Update Officer
  ================================================== */


  openEditModal(officer:any){


    this.editingOfficer = {

      ...officer

    };


    this.showEditModal=true;


  }


  async updateOfficer(){

    // Check PIN validation
    if(!/^[0-9]{6}$/.test(this.editingOfficer.pin)){

        Swal.fire({

            icon:'warning',
            title:'Invalid PIN',
            text:'PIN must be exactly 6 digits.',
            confirmButtonColor:'#2563EB'

        });

        return;

    }


    // Find original officer data
    const originalOfficer = this.officers.find(
        officer => officer.id === this.editingOfficer.id
    );


    // Check if no changes
    const noChanges =

        originalOfficer.lastName === this.editingOfficer.lastName.trim() &&

        originalOfficer.firstName === this.editingOfficer.firstName.trim() &&

        originalOfficer.middleName === this.editingOfficer.middleName.trim() &&

        originalOfficer.position === this.editingOfficer.position &&

        originalOfficer.pin === this.editingOfficer.pin;



    if(noChanges){

        Swal.fire({

            icon:'info',
            title:'No Changes',
            text:'There are no changes to update.',
            confirmButtonColor:'#2563EB'

        });

        return;

    }



    const result = await Swal.fire({

        title:'Update Officer?',

        text:'Save the changes?',

        icon:'question',

        showCancelButton:true,

        confirmButtonText:'Update',

        cancelButtonText:'Cancel',

        confirmButtonColor:'#2563EB'

    });


    if(!result.isConfirmed){

        return;

    }



    try{


        const ref = doc(

            db,

            'officers',

            this.editingOfficer.id

        );


        await updateDoc(ref,{


            lastName:
            this.editingOfficer.lastName.trim(),


            firstName:
            this.editingOfficer.firstName.trim(),


            middleName:
            this.editingOfficer.middleName.trim(),


            position:
            this.editingOfficer.position,


            pin:
            this.editingOfficer.pin


        });



        this.showEditModal=false;


        await this.loadOfficers();



        Swal.fire({

            icon:'success',

            title:'Updated',

            text:'Officer updated successfully.'

        });


    }


    catch(error){


        console.error(error);


        Swal.fire({

            icon:'error',

            title:'Update Failed'

        });


    }


}


  /* ==================================================
     Delete Officer
  ================================================== */


  async deleteOfficer(officer:any){


    const result = await Swal.fire({


      title:'Delete Officer',



      html:`

      <p>
      Type <b>DELETE</b> to remove
      <b>${officer.firstName} ${officer.lastName}</b>
      </p>


      <input
      id="confirmDelete"
      class="swal2-input"
      placeholder="Type DELETE">

      `,


      icon:'warning',


      showCancelButton:true,


      confirmButtonText:'Delete',

      confirmButtonColor:'#DC2626',


      preConfirm:()=>{


        const value = (

          document.getElementById(
            'confirmDelete'

          ) as HTMLInputElement

        ).value;



        if(value !== 'DELETE'){


          Swal.showValidationMessage(
            'Please type DELETE'
          );


        }



        return value;


      }


    });

    if(!result.isConfirmed){

      return;

    }


    try{


      await deleteDoc(

        doc(

          db,

          'officers',

          officer.id

        )

      );

      await this.loadOfficers();


      Swal.fire({


        icon:'success',

        title:'Deleted',

        text:'Officer removed successfully.'


      });



    }

    catch(error){


      console.error(error);



      Swal.fire({

        icon:'error',

        title:'Delete Failed'

      });


    }



  }


  /* ==================================================
     Search
  ================================================== */


  filteredOfficers(){


    return this.officers.filter(officer =>


      officer.lastName

      .toLowerCase()

      .includes(

        this.search

        .toLowerCase()

        .trim()

      )


    );


  }


  /* ==================================================
     Pagination
  ================================================== */


  paginatedOfficers(){


    const start =

    (this.currentPage - 1)

    *

    this.itemsPerPage;

    return this.filteredOfficers().slice(

      start,

      start + this.itemsPerPage

    );


  }


  totalPages(){


    return Math.ceil(

      this.filteredOfficers().length /

      this.itemsPerPage

    );


  }


  previousPage(){


    if(this.currentPage > 1){

      this.currentPage--;

    }


  }


  nextPage(){


    if(this.currentPage < this.totalPages()){

      this.currentPage++;

    }


  }


}
