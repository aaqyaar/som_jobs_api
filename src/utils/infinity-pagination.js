exports.infinityPagination = async (model, page, limit, query) => {
  try {
    const total = await model.countDocuments();
    const numberOfPages = Math.ceil(total / limit);
    const currentPage = Math.max(1, Math.min(page, numberOfPages));

    const data = await model
      .find(query)
      .select("-password")
      .skip((currentPage - 1) * limit)
      .limit(limit);
    return {
      numberOfPages,
      currentPage,
      total,
      data,
    };
  } catch (error) {
    throw error;
  }
};
