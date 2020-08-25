const supertest = require('supertest')
const server = require('./index')
const authModel = require('./auth/auth-model')
const db = require('./database/dbConfig')
// const { test } = require('./knexfile')


beforeEach(async () => {
    await db('users').truncate()
    await db.seed.run()
})

describe('test routes', () => {
    test('create a new user', async () =>{
        const res = await supertest(server)
            .post('/api/auth/register')
            .send({username: 'bob', password: '12345'})
        const users = await db('users')
    expect(res.status).toBe(201) //<-- test 1
    expect(users).toHaveLength(2)//<-- test 2
    })

    test('login with a user', async() => {
        const res = await supertest(server)
        .post('/api/auth/login')
        .send({username:'jason', password:'12345'})
        console.log(res.data)
    expect(res.type).toBe('application/json')
    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    })

    test('testing jokes router', async ()=>{
        function signToken(user) {
            const payload = {
                subject: user.id,
                username: user.username,
            };
          
            const secret = constants.jwtSecret;
          
            const options = {
                expiresIn: "1d",
            };
          
            return jwt.sign(payload, secret, options);
          }
        const userlogin = await supertest(server)
        const token = signToken(user)

            .post('/api/auth/login')
            .send({ username:'jason', password:'12345' })
            console.log(res)
        const res = await supertest(server)
            .get('/api/jokes')
            .set(userlogin.header['Authorization'][0])
        expect(res.status).toBe(200)
        expect(res.body).toBeTruthy()
    })
})