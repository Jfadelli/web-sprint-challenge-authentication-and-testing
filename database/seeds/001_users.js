
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, username: 'jason', password:'$2a$08$3n4x/mxmAgAtQThe4mq8EuEJIgwO1ulhU0A9WwZ74GCRa5F6fSLS2'},
      ]);
    });
};
