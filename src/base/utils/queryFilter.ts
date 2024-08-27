
export const userQueryFilter = (search: any) => {
  return {
    pageNumber: search.pageNumber ? search.pageNumber : 1,
    pageSize: search.pageSize ? search.pageSize : 10,
    sortBy: search.sortBy ? search.sortBy : 'createdAt',
    sortDirection: search.sortDirection === 'asc' ? 'ASC' : 'DESC',
    searchLoginTerm: search.searchLoginTerm
      ? search.searchLoginTerm.toLowerCase()
      : null,
    searchEmailTerm: search.searchEmailTerm
      ? search.searchEmailTerm.toLowerCase()
      : null,
  };
};


export const blogQueryFilter = (search: any) => {
  return {
    pageNumber: search.pageNumber ? search.pageNumber : 1,
    pageSize: search.pageSize ? search.pageSize : 10,
    sortBy: search.sortBy ? search.sortBy : 'createdAt',
    sortDirection: search.sortDirection === 'asc' ? 'ASC' : 'DESC',
    searchNameTerm:
      search.searchNameTerm !== undefined ? search.searchNameTerm : null,
  };
};

export const baseQueryFilter = (search: any) => {
  return {
    pageNumber: search.pageNumber ? search.pageNumber : 1,
    pageSize: search.pageSize ? search.pageSize : 10,
    sortBy: search.sortBy ? search.sortBy : 'createdAt',
    sortDirection: search.sortDirection === 'asc' ? 'ASC' : 'DESC',
  };
};