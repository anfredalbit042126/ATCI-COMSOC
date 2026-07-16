export interface Member {

  id?: string;

  lastName: string;

  firstName: string;

  middleName: string;

  educationLevel: 'College' | 'SHS' | '';

  course: string;

  strand: string;

  year: string;

  role: string;

  createdAt?: Date;

}


export interface MemberFilterOptions {

  educationLevel: string;

  course: string;

  strand: string;

  year: string;

  searchLastName: string;

}
