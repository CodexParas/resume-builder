const filterTemplates = (templates, searchTerm) => {
  const lowercaseSearchTerm = searchTerm.toLowerCase();
  return templates.filter((template) => {
    return (
      template?.name?.toLowerCase().includes(lowercaseSearchTerm) ||
      template?.tags?.some((tag) =>
        tag?.toLowerCase()?.includes(lowercaseSearchTerm)
      )
    );
  });
};

export default filterTemplates;
