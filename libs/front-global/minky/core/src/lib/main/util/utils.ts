export const randomVal = () => {
  return (Math.random() * 10).toString(36).substring(3);
};

export const tagTheKlassIfNot = (f: Object | Function) => {
  if (typeof f == 'object') {
    const ob = (f.constructor as any)['_reform_root_tag'];
    if (!ob)
      (f.constructor as any)['_reform_root_tag'] = randomVal() + randomVal();
  } else {
    const ob = (f as any)['_reform_root_tag'];
    if (!ob) (f as any)['_reform_root_tag'] = randomVal() + randomVal();
  }
};
