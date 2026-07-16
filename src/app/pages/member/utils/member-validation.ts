import { Member } from '../models/member.model';


export class MemberValidation {


  static isValid(member: Member): boolean {


    if(member.lastName.trim() === '') {

      return false;

    }


    if(member.firstName.trim() === '') {

      return false;

    }


    if(member.educationLevel === '') {

      return false;

    }


    if(member.year === '') {

      return false;

    }


    if(
      member.educationLevel === 'College' &&
      member.course === ''
    ) {

      return false;

    }


    if(
      member.educationLevel === 'SHS' &&
      member.strand === ''
    ) {

      return false;

    }


    return true;


  }


}
