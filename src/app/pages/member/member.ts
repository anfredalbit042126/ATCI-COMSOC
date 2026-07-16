import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import Swal from 'sweetalert2';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc
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

  /* ==================================================
     Constructor
  ================================================== */

  constructor(
    private cdr: ChangeDetectorRef
  ) {}

  /* ==================================================
     Filters
  ================================================== */

  selectedEducationLevel = '';
  selectedCourse = '';
  selectedStrand = '';
  selectedYear = '';
  searchLastName = '';

  /* ==================================================
     Add Member Form
  ================================================== */

  newLastName = '';
  newFirstName = '';
  newMiddleName = '';
  newEducationLevel = '';
  newCourse = '';
  newStrand = '';
  newYear = '';

  role = 'member';

  /* ==================================================
     Page State
  ================================================== */

  isOfficer = false;

  showAddModal = false;
  showEditModal = false;

  currentPage = 1;
  rowsPerPage = 10;

  /* ==================================================
     Data
  ================================================== */

  members: any[] = [];

  editingMember: any = {
    id: '',
    lastName: '',
    firstName: '',
    middleName: '',
    educationLevel: '',
    course: '',
    strand: '',
    year: ''
  };

  courses = [
    'BSIT',
    'BEED',
    'BSHM',
    'BSBA'
  ];

  collegeYears = [
    '1st Year',
    '2nd Year',
    '3rd Year',
    '4th Year'
  ];

  shsYears = [
    'Grade 11',
    'Grade 12'
  ];

  strands = [
    'STEM',
    'ABM',
    'HUMSS',
    'GAS',
    'TVL'
  ];

  private collegeData = {
  course: '',
  year: ''
  };

  private shsData = {
    strand: '',
    year: ''
  };

  previousEducationLevel = '';

  /* ==================================================
     Lifecycle
  ================================================== */

  async ngOnInit() {

    const user = JSON.parse(
      localStorage.getItem('user') || '{}'
    );

    this.isOfficer = user.role === 'officer';

    await this.loadMembers();

  }

  /* ==================================================
     Load Members
  ================================================== */

  async loadMembers() {

    try {

      const q = query(
        collection(db, 'members'),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);

      this.members = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      this.cdr.detectChanges();

    }

    catch (error) {

      console.error(error);

    }

  }

  /* ==================================================
     Add Member
  ================================================== */

  async addMember() {

    if (
    this.newLastName.trim() === '' ||
    this.newFirstName.trim() === '' ||
    this.newEducationLevel === '' ||
    this.newYear === '' ||
    (
        this.newEducationLevel === 'College'
            ? this.newCourse === ''
            : this.newStrand === ''
    )
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
      cancelButtonColor: '#64748B',

      allowOutsideClick: false,
      allowEscapeKey: false

    });

    if (!result.isConfirmed) {
      return;
    }

    /* Close the Angular modal immediately */
    this.showAddModal = false;

    /* Show loading dialog */
    Swal.fire({
      title: 'Saving...',
      text: 'Please wait.',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {

      await addDoc(
        collection(db, 'members'),
        {
          lastName: this.newLastName.trim(),
          firstName: this.newFirstName.trim(),
          middleName: this.newMiddleName.trim(),

          educationLevel: this.newEducationLevel,

          course:
              this.newEducationLevel === 'College'
                  ? this.newCourse
                  : '',

          strand:
              this.newEducationLevel === 'SHS'
                  ? this.newStrand
                  : '',
          year: this.newYear,

          role: this.role,

          createdAt: new Date()
        }
      );

      this.newLastName = '';
      this.newFirstName = '';
      this.newMiddleName = '';
      this.newEducationLevel = '';
      this.newCourse = '';
      this.newStrand = '';
      this.newYear = '';

      await this.loadMembers();

      Swal.close();

      Swal.fire({
        icon: 'success',
        title: 'Member Added!',
        text: 'The member has been added successfully.',
        confirmButtonColor: '#2563EB'
      });

    }

    catch (error) {

      Swal.close();

      console.error(error);

      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: 'Unable to add the member.'
      });

    }

  }

  /* ==================================================
     Update Member
  ================================================== */

  openEditModal(member: any) {

  this.editingMember = { ...member };

  this.collegeData = {
    course: member.course || '',
    year: member.educationLevel === 'College'
      ? member.year
      : ''
  };

  this.shsData = {
    strand: member.strand || '',
    year: member.educationLevel === 'SHS'
      ? member.year
      : ''
  };

  // IMPORTANT
  this.previousEducationLevel = member.educationLevel;

  this.showEditModal = true;

}

  closeEditModal() {

    this.showEditModal = false;

  }

  async updateMember() {


  // Get original member data
  const originalMember = this.members.find(
    member => member.id === this.editingMember.id
  );


  // Check if nothing changed
  const noChanges =

    originalMember.lastName === this.editingMember.lastName.trim() &&

    originalMember.firstName === this.editingMember.firstName.trim() &&

    originalMember.middleName === this.editingMember.middleName.trim() &&

    originalMember.course === this.editingMember.course &&

    originalMember.year === this.editingMember.year;



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

    title: 'Update Member?',

    text: 'Save the changes?',

    icon: 'question',

    showCancelButton: true,

    confirmButtonText: 'Update',

    cancelButtonText: 'Cancel',

    confirmButtonColor: '#2563EB'

  });



  if (!result.isConfirmed) {

    return;

  }



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

      educationLevel: this.editingMember.educationLevel,

      course:
      this.editingMember.educationLevel === 'College'
          ? this.editingMember.course
          : '',

      strand:
      this.editingMember.educationLevel === 'SHS'
          ? this.editingMember.strand
          : '',

      year: this.editingMember.year


    });



    this.showEditModal = false;


    await this.loadMembers();



    Swal.fire({

      icon: 'success',

      title: 'Updated',

      text: 'Member updated successfully.'

    });


  }


  catch(error) {


    console.error(error);


    Swal.fire({

      icon: 'error',

      title: 'Update Failed'

    });


  }


}

  /* ==================================================
     Delete Member
  ================================================== */

  async deleteMember(member: any) {

    const result = await Swal.fire({

      title: 'Delete Member',

      html: `
        <p>
          Type <b>DELETE</b> below to permanently remove
          <b>${member.firstName} ${member.lastName}</b>
        </p>

        <input
          id="confirmDelete"
          class="swal2-input"
          placeholder="Type DELETE">
      `,

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Delete',
      confirmButtonColor: '#DC2626',

      preConfirm: () => {

        const value = (
          document.getElementById('confirmDelete') as HTMLInputElement
        ).value;

        if (value !== 'DELETE') {

          Swal.showValidationMessage(
            'Please type DELETE'
          );

        }

        return value;

      }

    });

    if (!result.isConfirmed) {
      return;
    }

    try {

      await deleteDoc(
        doc(db, 'members', member.id)
      );

      await this.loadMembers();

      Swal.fire({

        icon: 'success',
        title: 'Deleted',
        text: 'Member removed successfully.'

      });

    }

    catch (error) {

      console.error(error);

      Swal.fire({

        icon: 'error',
        title: 'Delete Failed'

      });

    }

  }

  /* ==================================================
     Filters
  ================================================== */

  filteredMembers() {

    return this.members.filter(member => {

        const educationMatch =
            !this.selectedEducationLevel ||
            member.educationLevel === this.selectedEducationLevel;

        const courseMatch =
            !this.selectedCourse ||
            member.course === this.selectedCourse;

        const strandMatch =
            !this.selectedStrand ||
            member.strand === this.selectedStrand;

        const yearMatch =
            !this.selectedYear ||
            member.year === this.selectedYear;

        const lastNameMatch =
            !this.searchLastName ||
            member.lastName
                .toLowerCase()
                .includes(this.searchLastName.toLowerCase());

        return (
            educationMatch &&
            courseMatch &&
            strandMatch &&
            yearMatch &&
            lastNameMatch
        );

    });

}

  /* ==================================================
     Pagination
  ================================================== */

  paginatedMembers() {

    const start =
      (this.currentPage - 1) * this.rowsPerPage;

    return this.filteredMembers().slice(
      start,
      start + this.rowsPerPage
    );

  }

  totalPages() {

    return Math.ceil(
      this.filteredMembers().length /
      this.rowsPerPage
    );

  }

  nextPage() {

    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }

  }

  previousPage() {

    if (this.currentPage > 1) {
      this.currentPage--;
    }

  }

onEducationLevelChange() {
  this.selectedCourse = '';
  this.selectedStrand = '';
  this.selectedYear = '';
  this.currentPage = 1;
}

onNewEducationLevelChange() {
  this.newCourse = '';
  this.newStrand = '';
  this.newYear = '';
}

onEditEducationLevelChange() {

  // Save the values before switching
  if (this.previousEducationLevel === 'College') {

    this.collegeData.course = this.editingMember.course;
    this.collegeData.year = this.editingMember.year;

  } else {

    this.shsData.strand = this.editingMember.strand;
    this.shsData.year = this.editingMember.year;

  }

  // Restore values after switching
  if (this.editingMember.educationLevel === 'College') {

    this.editingMember.course = this.collegeData.course;
    this.editingMember.year = this.collegeData.year;

    this.editingMember.strand = '';

  } else {

    this.editingMember.strand = this.shsData.strand;
    this.editingMember.year = this.shsData.year;

    this.editingMember.course = '';

  }

  this.previousEducationLevel = this.editingMember.educationLevel;

}
}
