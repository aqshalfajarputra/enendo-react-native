import {InMemoryCache} from '@apollo/client';
export const cache = new InMemoryCache({
  typePolicies: {
    Product: {
      // In most inventory management systems, a single UPC code uniquely
      // identifies any product.
      keyFields: ['upc'],
    },
    Person: {
      // In some user account systems, names or emails alone do not have to
      // be unique, but the combination of a person's name and email is
      // uniquely identifying.
      keyFields: ['name', 'email'],
    },
    Book: {
      // If one of the keyFields is an object with fields of its own, you can
      // include those nested keyFields by using a nested array of strings:
      keyFields: ['title', 'author', ['name']],
    },
  },
});
