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
  selector: 'app-officer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './officer.html',
  styleUrl: './officer.css',
})
export class Officer implements OnInit {


  constructor(private cdr: ChangeDetectorRef) {}


  newLastName = '';
  newFirstName = '';
  newMiddleName = '';
  newPosition = '';
  newPin = '';
  role = 'officer';

  search = '';


  positions = [
    'President',
    'Vice President',
    'Secretary',
    'Treasurer',
    'Auditor',
    'Business Manager',
    'Public Information Officer',
  ];


  officers: any[] = [];

  async ngOnInit() {
    await this.loadOfficers();
  }



  async loadOfficers() {

    try {

      const q = query(
        collection(db, 'officers'),
        orderBy('createdAt', 'desc')
      );


      const snapshot = await getDocs(q);


      this.officers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));


      this.cdr.detectChanges();


    } catch(error) {

      console.error(error);

    }

  }




  async addOfficer() {

  if (
    this.newLastName.trim() === '' ||
    this.newFirstName.trim() === '' ||
    this.newPosition === '' ||
    this.newPin.length !== 6
  ) {

    Swal.fire({
      icon: 'warning',
      title: 'Incomplete Information',
      text: 'Please complete all required fields and enter a valid 6-digit PIN.',
      confirmButtonColor: '#2563EB'
    });

    return;

  }

  const result = await Swal.fire({
    title: 'Add Officer?',
    text: 'Are you sure you want to add this officer?',
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

    await addDoc(collection(db, 'officers'), {

      lastName: this.newLastName.trim(),
      firstName: this.newFirstName.trim(),
      middleName: this.newMiddleName.trim(),

      role: this.role,
      pin: this.newPin,
      position: this.newPosition,

      createdAt: new Date()

    });

    this.newLastName = '';
    this.newFirstName = '';
    this.newMiddleName = '';
    this.newPosition = '';
    this.newPin = '';

    await this.loadOfficers();

    Swal.fire({
      icon: 'success',
      title: 'Officer Added!',
      text: 'The officer has been added successfully.',
      confirmButtonColor: '#2563EB'
    });

  } catch (error) {

    console.error(error);

    Swal.fire({
      icon: 'error',
      title: 'Failed',
      text: 'Unable to add the officer.',
      confirmButtonColor: '#2563EB'
    });

  }

}


  filteredOfficers() {

  return this.officers.filter(officer => {

    return officer.lastName
      .toLowerCase()
      .includes(this.search.toLowerCase().trim());

  });

}


}
