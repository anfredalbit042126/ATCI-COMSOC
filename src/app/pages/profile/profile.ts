import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import Swal from 'sweetalert2';

import {
  doc,
  updateDoc
} from 'firebase/firestore';

import { db } from './../../firebase';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})

export class Profile implements OnInit {

  user: any = {};

  editFirstName = '';
  editLastName = '';

  canEdit = false;

  ngOnInit() {

    this.user = JSON.parse(
      localStorage.getItem('user') || '{}'
    );

    this.editFirstName = this.user.firstName || '';
    this.editLastName = this.user.lastName || '';

    this.canEdit =
      this.user.role === 'admin' ||
      this.user.role === 'officer';

  }

  async updateProfile() {

    if (
      this.editFirstName.trim() === '' ||
      this.editLastName.trim() === ''
    ) {

      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Information',
        text: 'First name and last name are required.',
        confirmButtonColor: '#2563EB'
      });

      return;

    }

    if (
      this.editFirstName.trim() === this.user.firstName &&
      this.editLastName.trim() === this.user.lastName
    ) {

      Swal.fire({
        icon: 'info',
        title: 'No Changes',
        text: 'There is no information to update.',
        confirmButtonColor: '#2563EB'
      });

      return;

    }

    if (!this.user.id) {

      Swal.fire({
        icon: 'error',
        title: 'Account Error',
        text: 'Account ID not found. Please login again.',
        confirmButtonColor: '#DC2626'
      });

      return;

    }

    const result = await Swal.fire({
      title: 'Update Profile?',
      text: 'Save the changes?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#2563EB',
      cancelButtonColor: '#64748B'
    });

    if (!result.isConfirmed) {
      return;
    }

    try {

      Swal.fire({
        title: 'Updating...',
        text: 'Please wait.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const collectionName =
        this.user.role === 'admin'
          ? 'admins'
          : 'officers';

      const ref = doc(
        db,
        collectionName,
        this.user.id
      );

      await updateDoc(ref, {
        firstName: this.editFirstName.trim(),
        lastName: this.editLastName.trim()
      });

      this.user.firstName = this.editFirstName.trim();
      this.user.lastName = this.editLastName.trim();

      localStorage.setItem(
        'user',
        JSON.stringify(this.user)
      );

      Swal.close();

      await Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Profile updated successfully.',
        confirmButtonColor: '#2563EB'
      });

    } catch (error) {

      Swal.close();

      console.error(error);

      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Unable to update profile.',
        confirmButtonColor: '#DC2626'
      });

    }

  }

}
