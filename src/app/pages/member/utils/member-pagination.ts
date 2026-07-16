export class MemberPagination {


  static paginate<T>(

    data:T[],

    currentPage:number,

    rowsPerPage:number

  ):T[] {


    const start =

      (currentPage - 1) * rowsPerPage;



    return data.slice(

      start,

      start + rowsPerPage

    );


  }





  static totalPages(

    dataLength:number,

    rowsPerPage:number

  ):number {


    return Math.ceil(

      dataLength / rowsPerPage

    );


  }


}
