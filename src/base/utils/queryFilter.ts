
export const userQueryFilter = (search: any) => {
  return {
    pageNumber: search.pageNumber ? search.pageNumber : 1,
    pageSize: search.pageSize  ? search.pageSize : 10,
    sortBy: search.sortBy ? search.sortBy : 'createdAt',
    sortDirection: search.sortDirection === 'asc' ? "1" : "-1",
    searchLoginTerm: search.searchLoginTerm ? search.searchLoginTerm : null,
    searchEmailTerm: search.searchEmailTerm ? search.searchEmailTerm : null,
  };
};


export const blogQueryFilter = (search: any) => {
  return {
    pageNumber: search.pageNumber  ? search.pageNumber : 1,
    pageSize: search.pageSize  ? search.pageSize : 10,
    sortBy: search.sortBy  ? search.sortBy : 'createdAt',
    sortDirection:
      search.sortDirection === 'asc'
        ? "1"
        : "-1",
    searchNameTerm: search.searchNameTerm !== undefined ? search.searchNameTerm : null,
  };
};

export const baseQueryFilter = (search: any) => {
  return {
    pageNumber: search.pageNumber ? search.pageNumber : 1,
    pageSize: search.pageSize ? search.pageSize : 10,
    sortBy: search.sortBy ? search.sortBy : 'createdAt',
    sortDirection: search.sortDirection === 'asc' ? '1' : '-1',
  };
};