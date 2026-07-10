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

  courses = [
    'BSIT',
    'BEED',
    'BSHM',
    'BSBA'
  ];

  years = [
    '1st Year',
    '2nd Year',
    '3rd Year',
    '4th Year'
  ];

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

      return courseMatch && yearMatch;

    });
  }

    async addMember() {

    if (
      this.newLastName.trim() === '' ||
      this.newFirstName.trim() === '' ||
      this.newCourse === '' ||
      this.newYear === ''
    ) {

      alert('Please complete all required fields.');
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

    } catch (error) {

      console.error(error);
      alert('Failed to add member.');

    }

  }

}
