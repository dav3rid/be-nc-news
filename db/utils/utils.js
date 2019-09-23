exports.formatDates = list => {
  if (list.length < 1) return [];
  const newArr = [];
  list.forEach(obj => {
    const newObj = { ...obj };
    const currentDate = newObj.created_at;
    newObj.created_at = new Date(currentDate);
    newArr.push(newObj);
  });
  return newArr;
};

exports.makeRefObj = (list, keyName = 'title', valueName = 'article_id') => {
  if (list.length < 1) return {};
  const refObj = {};
  list.forEach(obj => {
    refObj[obj[keyName]] = obj[valueName];
  });
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  if (comments.length < 1) return [];
  const newArr = [];
  comments.forEach(comment => {
    const newObj = { ...comment };
    newObj.author = newObj.created_by;
    delete newObj.created_by;

    newObj.article_id = articleRef[newObj.belongs_to];
    delete newObj.belongs_to;

    const currentDate = newObj.created_at;
    newObj.created_at = new Date(currentDate);
    newArr.push(newObj);
  });
  return newArr;
};
