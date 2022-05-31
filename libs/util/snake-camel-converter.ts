import { isArray, isObject } from 'class-validator';

export const snakeToCamel = function (o) {
  if (isObject(o)) {
    const n = {};

    Object.keys(o).forEach((k) => {
      n[toCamel(k)] = snakeToCamel(o[k]);
    });

    return n;
  } else if (isArray(o)) {
    return o.map((i) => {
      return snakeToCamel(i);
    });
  }

  return o;
};

const toCamel = (s) => {
  return s.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace('-', '').replace('_', '');
  });
};

const toSnake = (s) => {
  const result = s.replace(/([A-Z])/g, ' $1');
  return result.split(' ').join('_').toLowerCase();
};

export const camelToSnake = function (o) {
  const n = {};

  if (isObject(o)) {
    Object.keys(o).forEach((k) => {
      n[toSnake(k)] = camelToSnake(o[k]);
    });

    return n;
  } else if (isArray(o)) {
    return o.map((i) => {
      return camelToSnake(i);
    });
  }

  return o;
};
