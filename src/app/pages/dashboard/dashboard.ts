import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  collection,
  getDocs,
  query,
  orderBy,
  limit
} from 'firebase/firestore';

import { db } from './../../firebase';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  constructor(
    private cdr: ChangeDetectorRef
  ) {}

  totalMembers = 0;
  totalOfficers = 0;

  latestMember = '-';
  latestOfficer = '-';

  courses = 5;
  yearLevels = 4;

  async ngOnInit() {

    await Promise.all([
      this.loadMembers(),
      this.loadOfficers()
    ]);

    // Refresh the UI
    this.cdr.detectChanges();

  }

  async loadMembers() {

    try {

      const snapshot = await getDocs(
        collection(db, 'members')
      );

      console.log('Members count:', snapshot.size);

      this.totalMembers = snapshot.size;

      const latest = await getDocs(
        query(
          collection(db, 'members'),
          orderBy('createdAt', 'desc'),
          limit(1)
        )
      );

      if (!latest.empty) {

        const data: any = latest.docs[0].data();

        this.latestMember =
          `${data.firstName} ${data.lastName}`;

      }

    } catch (error) {

      console.error('Members Error:', error);

    }

  }

  async loadOfficers() {

    try {

      const snapshot = await getDocs(
        collection(db, 'officers')
      );

      console.log('Officers count:', snapshot.size);

      this.totalOfficers = snapshot.size;

      const latest = await getDocs(
        query(
          collection(db, 'officers'),
          orderBy('createdAt', 'desc'),
          limit(1)
        )
      );

      if (!latest.empty) {

        const data: any = latest.docs[0].data();

        this.latestOfficer =
          `${data.firstName} ${data.lastName}`;

      }

    } catch (error) {

      console.error('Officers Error:', error);

    }

  }

}
