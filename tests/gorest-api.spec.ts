import { test, expect } from '@playwright/test'
import * as dotenv from 'dotenv'
import { faker } from '@faker-js/faker'

test.describe('Gorest API Testing', () => {
    const baseUrl: string = 'https://gorest.co.in/public/v2/users'
    dotenv.config()
    const dataAndHeaders = {
        data: {
            name: faker.person.firstName(),
            gender: 'male',
            email: faker.internet.email(),
            status: 'active'
        },
        headers: {
            Authorization: `Bearer ${process.env.API_TOKEN}`
        },
    }

    test('POST | GET | DELETE Request - Create user, get user and delete it', async ({ request }) => {
        const postResponse = await request.post(baseUrl, dataAndHeaders)
        const postResponseBody = JSON.parse(await postResponse.text())
        expect(postResponse.status()).toBe(201)
        expect(postResponseBody.id).toBeTruthy()

        const getResponse = await request.get(`${baseUrl}/${postResponseBody.id}`, {
            headers: dataAndHeaders.headers
        })
        const getResponseBody = JSON.parse(await getResponse.text())
        console.log(getResponseBody);
        expect(getResponse.status()).toBe(200)
        expect(getResponseBody.name).toBe(dataAndHeaders.data.name)
        expect(getResponseBody.email).toBe(dataAndHeaders.data.email)

        const deleteResponse = await request.delete(`${baseUrl}/${postResponseBody.id}`, {
            headers: dataAndHeaders.headers
        })
        expect(deleteResponse.status()).toBe(204)
    })
})