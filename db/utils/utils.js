exports.formatDates = list => {
  return list.map(obj => {
    const newObj = { ...obj };
    newObj.created_at = new Date(newObj.created_at);
    return newObj;
  });
};

exports.makeRefObj = (list, keyName = 'title', valueName = 'article_id') => {
  return list.reduce((refObj, currentObj) => {
    refObj[currentObj[keyName]] = currentObj[valueName];
    return refObj;
  }, {});
};

exports.formatComments = (comments, articleRef) => {
  return comments.map(comment => {
    const newObj = { ...comment };
    newObj.author = newObj.created_by;
    delete newObj.created_by;

    newObj.article_id = articleRef[newObj.belongs_to];
    delete newObj.belongs_to;

    newObj.created_at = new Date(newObj.created_at);
    return newObj;
  });
};
