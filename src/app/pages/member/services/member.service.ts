import { Injectable } from '@angular/core';

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

import { db } from '../../../firebase';

import { Member } from '../models/member.model';



@Injectable({
  providedIn: 'root'
})


export class MemberService {


  private collectionName = 'members';



  /* ==================================================
     Get All Members
  ================================================== */

  async getMembers(): Promise<Member[]> {


    const q = query(

      collection(
        db,
        this.collectionName
      ),

      orderBy(
        'createdAt',
        'desc'
      )

    );



    const snapshot = await getDocs(q);



    return snapshot.docs.map(document => ({

      id: document.id,

      ...document.data()

    })) as Member[];


  }





  /* ==================================================
     Add Member
  ================================================== */

  async addMember(member: Member) {


    return await addDoc(

      collection(
        db,
        this.collectionName
      ),

      {

        ...member,

        createdAt: new Date()

      }

    );


  }





  /* ==================================================
     Update Member
  ================================================== */

  async updateMember(

    id:string,

    member:Partial<Member>

  ) {


    const reference = doc(

      db,

      this.collectionName,

      id

    );



    return await updateDoc(

      reference,

      member

    );


  }





  /* ==================================================
     Delete Member
  ================================================== */

  async deleteMember(id:string) {


    return await deleteDoc(

      doc(

        db,

        this.collectionName,

        id

      )

    );


  }


}
