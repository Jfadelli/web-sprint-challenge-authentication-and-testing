const supertest = require('supertest')
const server = require('./index')
const authModel = require('./auth/auth-model')
const db = require('./database/dbConfig');

beforeEach(async () => {
    await db('users').truncate()
    await db.seed.run()
})

describe('test routes', () => {

    //TEST CREATE USERS
    test('create a new user, success', async () =>{
        const res = await supertest(server)
            .post('/api/auth/register')
            .send({username: 'bob', password: '12345'})
        const users = await db('users')
    expect(res.status).toBe(201) //<-- test 1
    expect(users).toHaveLength(2)//<-- test 2
    })

    test('create a new user, fail', async () =>{
        const res = await supertest(server)
            .post('/api/auth/register')
            .send({username: '', password: ''})
        const users = await db('users')
    expect(res.status).toBe(400) //<-- test 3
    expect(users).toHaveLength(1)//<-- test 4
    })

    //TEST LOGIN WITH USER
    test('login with a user, success', async() => {
        const res = await supertest(server)
        .post('/api/auth/login')
        .send({username:'jason', password:'12345'})
    expect(res.type).toBe('application/json') //<-- test 1
    expect(res.status).toBe(200) //<-- test 2
    expect(res.body).toBeDefined() //<--test 3
    })
    test('login with a user, fail', async() => {
        const res = await supertest(server)
        .post('/api/auth/login')
        .send({username:'frank', password:'abcde'})
    expect(res.type).toBe('application/json') //<--test 4
    expect(res.status).toBe(401) //<-- test 5

    })


    //TEST JOKES ENDPOINT ACCESS
    test('testing jokes router, access granted', async ()=>{
        let token;
        const userlogin = await supertest(server)
            .post('/api/auth/login')
            .send({ username:'jason', password:'12345' })
        const res = await supertest(server)
            .get('/api/jokes')
            .set('Authorization', userlogin.body.token)
    expect(res.status).toBe(200)//<-- test 1
    expect(res.body).toBeTruthy()//<-- test 2
    expect(res.body).toBeDefined()//<-- test 3
    })

    test('testing jokes router, access denied', async ()=>{
        let token;
        const userlogin = await supertest(server)
            .post('/api/auth/login')
            .send({ username:'JASON', password:'123456' })
        const res = await supertest(server)
            .get('/api/jokes')
    expect(res.status).toBe(401)//<-- test 4

    })
})