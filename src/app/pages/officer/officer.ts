import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
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
    'Assistant Secretary',
    'Treasurer',
    'Assistant Treasurer',
    'Auditor',
    'Public Information Officer',
    'Business Manager',
    '1st Year Representative',
    '2nd Year Representative',
    '3rd Year Representative',
    '4th Year Representative'
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
    this.newPosition === ''  ||
    this.newPin.length !== 6
  ) {

    alert('Please complete all required fields.');
    return;

  }


  try {

    await addDoc(collection(db, 'officers'), {

      lastName: this.newLastName.trim(),

      firstName: this.newFirstName.trim(),

      middleName: this.newMiddleName.trim(),

      role: this.role,

      pin:this.newPin,

      position: this.newPosition,

      createdAt: new Date()

    });


    this.newLastName = '';
    this.newFirstName = '';
    this.newMiddleName = '';
    this.newPosition = '';
    this.newPin = '';

    await this.loadOfficers();


  } catch(error) {

    console.error(error);

    alert('Failed to add officer.');

  }

}


  filteredOfficers() {

  return this.officers.filter(officer => {

    const fullname =
      `${officer.lastName} ${officer.firstName} ${officer.middleName}`
      .toLowerCase();


    return fullname.includes(
      this.search.toLowerCase()
    );

  });

}


}
