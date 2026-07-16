import {
  Member,
  MemberFilterOptions
} from '../models/member.model';


export class MemberFilter {


  static filter(
    members: Member[],
    filters: MemberFilterOptions
  ): Member[] {


    return members.filter(member => {


      const educationMatch =

        !filters.educationLevel ||

        member.educationLevel === filters.educationLevel;



      const courseMatch =

        !filters.course ||

        member.course === filters.course;



      const strandMatch =

        !filters.strand ||

        member.strand === filters.strand;



      const yearMatch =

        !filters.year ||

        member.year === filters.year;



      const lastNameMatch =

        !filters.searchLastName ||

        member.lastName
          .toLowerCase()
          .includes(
            filters.searchLastName.toLowerCase()
          );



      return (

        educationMatch &&

        courseMatch &&

        strandMatch &&

        yearMatch &&

        lastNameMatch

      );


    });


  }


}
