export const sortLikes = (postLikes: any)=> {
  let latestReactions = postLikes.flatMap(
    (postLike: any) => postLike.latestReactions
  );

  const afterSort = latestReactions
    .sort(
      (a: any, b: any) =>
        new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    )
    .slice(0, 3);

  return afterSort;
};
