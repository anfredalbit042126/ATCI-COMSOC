import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';


import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';

import { db } from './../../firebase';

@Component({
  selector: 'app-member',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './member.html',
  styleUrl: './member.css'
})
export class Member implements OnInit {

    constructor(private cdr: ChangeDetectorRef) {}

  selectedCourse = '';
  selectedYear = '';

  newLastName = '';
  newFirstName = '';
  newMiddleName = '';
  newCourse = '';
  newYear = '';
  role = 'member';

  searchLastName = '';

  courses = [
    'BSIT',
    'BEED',
    'BSHM',
    'BSBA',
    'SHS'
  ];

  years = [
    '1st Year',
    '2nd Year',
    '3rd Year',
    '4th Year'
  ];

  editingMember: any = {
  id: '',
  lastName: '',
  firstName: '',
  middleName: '',
  course: '',
  year: ''
  };

  showEditModal = false;

  members: any[] = [];

  async ngOnInit() {
  await this.loadMembers();
}
  async loadMembers() {
  try {

    const q = query(
      collection(db, 'members'),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    this.members = data;

    // Force UI update
    this.cdr.detectChanges();

  } catch (error) {
    console.error(error);
  }
}

  filteredMembers() {

  return this.members.filter(member => {

    const courseMatch =
      !this.selectedCourse ||
      member.course === this.selectedCourse;

    const yearMatch =
      !this.selectedYear ||
      member.year === this.selectedYear;

    const lastNameMatch =
      !this.searchLastName ||
      member.lastName
        .toLowerCase()
        .includes(this.searchLastName.toLowerCase());

    return courseMatch && yearMatch && lastNameMatch;

  });

}

    async addMember() {

  if (
    this.newLastName.trim() === '' ||
    this.newFirstName.trim() === '' ||
    this.newCourse === '' ||
    this.newYear === ''
  ) {

    Swal.fire({
      icon: 'warning',
      title: 'Incomplete Information',
      text: 'Please complete all required fields.'
    });

    return;

  }

  const result = await Swal.fire({
    title: 'Add Member?',
    text: 'Are you sure you want to add this member?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, Add',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#2563EB',
    cancelButtonColor: '#64748B'
  });

  if (!result.isConfirmed) {
    return;
  }

  try {

    await addDoc(collection(db, 'members'), {

      lastName: this.newLastName.trim(),
      firstName: this.newFirstName.trim(),
      middleName: this.newMiddleName.trim(),

      course: this.newCourse,
      year: this.newYear,

      role: this.role,

      createdAt: new Date()

    });

    this.newLastName = '';
    this.newFirstName = '';
    this.newMiddleName = '';
    this.newCourse = '';
    this.newYear = '';

    await this.loadMembers();

    Swal.fire({
      icon: 'success',
      title: 'Member Added!',
      text: 'The member has been added successfully.',
      confirmButtonColor: '#2563EB'
    });

  } catch (error) {

    console.error(error);

    Swal.fire({
      icon: 'error',
      title: 'Failed',
      text: 'Unable to add the member.'
    });

  }

}

openEditModal(member: any) {

  this.editingMember = {
    ...member
  };

  this.showEditModal = true;

}

async updateMember() {

  const result = await Swal.fire({

    title: 'Update Member?',
    text: 'Save the changes?',
    icon: 'question',

    showCancelButton: true,

    confirmButtonText: 'Update',
    cancelButtonText: 'Cancel',

    confirmButtonColor: '#2563EB'

  });

  if (!result.isConfirmed) return;

  try {

    const ref = doc(
      db,
      'members',
      this.editingMember.id
    );

    await updateDoc(ref, {

      lastName: this.editingMember.lastName.trim(),

      firstName: this.editingMember.firstName.trim(),

      middleName: this.editingMember.middleName.trim(),

      course: this.editingMember.course,

      year: this.editingMember.year

    });

    this.showEditModal = false;

    await this.loadMembers();

    Swal.fire({

      icon:'success',

      title:'Updated',

      text:'Member updated successfully.'

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

async deleteMember(member:any){

const result = await Swal.fire({

title:'Delete Member',

html:`

<p>

Type
<b>DELETE</b>

below to permanently remove

<b>${member.firstName} ${member.lastName}</b>

</p>

<input id="confirmDelete"

class="swal2-input"

placeholder="Type DELETE">

`,

icon:'warning',

showCancelButton:true,

confirmButtonText:'Delete',

confirmButtonColor:'#dc2626',

preConfirm:()=>{

const value=(document.getElementById(
'confirmDelete'
) as HTMLInputElement).value;

if(value!=="DELETE"){

Swal.showValidationMessage(
'Please type DELETE'
);

}

return value;

}

});

if(!result.isConfirmed)return;

try{

await deleteDoc(

doc(db,'members',member.id)

);

await this.loadMembers();

Swal.fire({

icon:'success',

title:'Deleted',

text:'Member removed successfully.'

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

closeEditModal() {

  this.showEditModal = false;

}

}
