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

  pin = '';

  constructor(private router: Router) {

    // If already logged in, go directly to dashboard
    if (localStorage.getItem('user')) {
      this.router.navigate(['/']);
    }

  }

  async login() {

    if (this.pin.length !== 6) {
      alert('PIN must be exactly 6 digits');
      return;
    }

    try {

      // =========================
      // CHECK ADMINS
      // =========================

      const adminSnap = await getDocs(
        query(
          collection(db, 'admins'),
          where('pin', '==', this.pin)
        )
      );

      if (!adminSnap.empty) {

        const admin = adminSnap.docs[0].data() as UserAccount;

        localStorage.setItem('user', JSON.stringify({
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: admin.role
        }));

        alert(`Welcome ${admin.firstName}`);

        this.router.navigate(['/']);
        return;
      }

      // =========================
      // CHECK OFFICERS
      // =========================

      const officerSnap = await getDocs(
        query(
          collection(db, 'officers'),
          where('pin', '==', this.pin)
        )
      );

      if (!officerSnap.empty) {

        const officer = officerSnap.docs[0].data() as UserAccount;

        localStorage.setItem('user', JSON.stringify({
          firstName: officer.firstName,
          lastName: officer.lastName,
          role: officer.role,
          position: officer.position
        }));

        alert(`Welcome ${officer.firstName}`);

        this.router.navigate(['/']);
        return;
      }

      // =========================
      // CHECK MEMBERS
      // =========================

      const memberSnap = await getDocs(
        query(
          collection(db, 'members'),
          where('pin', '==', this.pin)
        )
      );

      if (!memberSnap.empty) {

        const member = memberSnap.docs[0].data() as UserAccount;

        localStorage.setItem('user', JSON.stringify({
          firstName: member.firstName,
          lastName: member.lastName,
          role: member.role
        }));

        alert(`Welcome ${member.firstName}`);

        this.router.navigate(['/']);
        return;
      }

      alert('Invalid PIN');

    } catch (error) {

      console.error(error);
      alert('Login failed');

    }

  }

}
