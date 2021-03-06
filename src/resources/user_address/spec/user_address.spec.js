import request from 'supertest';
import app from '../../../server';
import db from '../../../db/dbconfig';

let userToken;
let dbUser;

const user = {
  firstname: 'kells',
  lastname: 'leo',
  email: 'order@gmail.com',
  password: 'pass12345',
  confirmPassword: 'pass12345',
};

const address = {
  phone_number: '008812343353',
  street_address: '123 my street, my street',
  city: 'my city',
  state: 'My state',
  country: 'My country',
  zipcode: '123456',
};
const updatedAddress = {
  phone_number: '008812343353',
  street_address: '123 my street, my street',
  city: 'myy city',
  state: 'Myy state',
  country: 'Myy country',
  zipcode: '123456',
};
let addressData;

beforeAll(async () => {
  await db.raw('truncate users cascade');

  user.email = 'kelly4eva@gmail.com';
  const userResponse = await request(app)
    .post('/api/v1/auth/register')
    .set('content-type', 'application/json')
    .send(user);

  dbUser = userResponse.body.user;
  userToken = userResponse.body.token;
});

describe('CREATE Address', () => {
  it('should fail if user is not authenticated', async () => {
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/addresses`)
      .set({ Accept: 'application/json' })
      .send({ ...address });
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toEqual(
      'Access denied. You are not authorized to access this route',
    );
  });

  it('should create an address for the logged in user', async () => {
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/addresses`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...address });
    expect(response.statusCode).toBe(201);
    expect(response.body.userAddress.city).toEqual(address.city);
    expect(response.body.message).toEqual(
      'Address has been added successfully',
    );
  });

  it('should fail if phone number is empty', async () => {
    const newAddress = { ...address };
    newAddress.phone_number = '';
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/addresses`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['please input a valid phone number']),
    );
  });

  it('should fail if phone number is empty', async () => {
    const newAddress = { ...address };
    newAddress.phone_number = '';
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/addresses`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['please input a valid phone number']),
    );
  });

  it('should fail if phone number is too long', async () => {
    const newAddress = { ...address };
    newAddress.phone_number = '1234567808765435678';
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/addresses`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['maximum length of phone number reached']),
    );
  });

  it('should fail if street address is empty', async () => {
    const newAddress = { ...address };
    newAddress.street_address = '';
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/addresses`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['street address cannot be empty']),
    );
  });

  it('should fail if street address is too long', async () => {
    const newAddress = { ...address };
    newAddress.street_address = 'hello there,'.trim().repeat(10);
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/addresses`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining([
        'Street address should be at most 100 characters',
      ]),
    );
  });

  it('should fail if city is empty', async () => {
    const newAddress = { ...address };
    newAddress.city = '';
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/addresses`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['City cannot be empty']),
    );
  });

  it('should fail if city is too long', async () => {
    const newAddress = { ...address };
    newAddress.city = 'hello there,I'.trim().repeat(4);
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/addresses`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['maximum length of characters reached']),
    );
  });

  it('should fail if state is empty', async () => {
    const newAddress = { ...address };
    newAddress.state = '';
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/addresses`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['State cannot be empty']),
    );
  });

  it('should fail if state is too long', async () => {
    const newAddress = { ...address };
    newAddress.state = 'hello there,I'.trim().repeat(4);
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/addresses`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['State cannot exceed 50 characters']),
    );
  });

  it('should fail if country is empty', async () => {
    const newAddress = { ...address };
    delete newAddress.country;
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/addresses`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['Country cannot be empty']),
    );
  });

  it('should fail if country is too long', async () => {
    const newAddress = { ...address };
    newAddress.country = 'hello there,I'.trim().repeat(4);
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/addresses`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['Country cannot exceed 50 characters']),
    );
  });
});

describe('UPDATE Address', () => {
  it('should fail if user is not authenticated', async () => {
    addressData = await request(app)
      .post(`/api/v1/users/2/addresses`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...address });
    const response = await request(app)
      .patch(`/api/v1/users/3/addresses/3`)
      .set({ Accept: 'application/json' })
      .send({ ...updatedAddress });
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toEqual(
      'Access denied. You are not authorized to access this route',
    );
  });
  it('should fail if logged in user is not the address owner', async () => {
    const response = await request(app)
      .patch(`/api/v1/users/10/addresses/${addressData.body.userAddress.id}`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...updatedAddress });
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toEqual(
      "You cannot access a resource you didn't create",
    );
  });
  it('should update an address for the logged in user', async () => {
    const response = await request(app)
      .patch(
        `/api/v1/users/${dbUser.id}/addresses/${addressData.body.userAddress.id}`,
      )
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...updatedAddress });

    expect(response.statusCode).toBe(200);
    expect(response.body.userAddress.city).toEqual(updatedAddress.city);
    expect(response.body.message).toEqual(
      'Address has been updated successfully',
    );
  });

  it('should fail if phone number is empty', async () => {
    const newAddress = { ...updatedAddress };
    newAddress.phone_number = '';
    const response = await request(app)
      .patch(
        `/api/v1/users/${dbUser.id}/addresses/${addressData.body.userAddress.id}`,
      )
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['please input a valid phone number']),
    );
  });

  it('should fail if phone number is too long', async () => {
    const newAddress = { ...updatedAddress };
    newAddress.phone_number = '1234567808765435678';
    const response = await request(app)
      .patch(
        `/api/v1/users/${dbUser.id}/addresses/${addressData.body.userAddress.id}`,
      )
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['maximum length of phone number reached']),
    );
  });

  it('should fail if street address is empty', async () => {
    const newAddress = { ...updatedAddress };
    newAddress.street_address = '';
    const response = await request(app)
      .patch(
        `/api/v1/users/${dbUser.id}/addresses/${addressData.body.userAddress.id}`,
      )
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['street address cannot be empty']),
    );
  });

  it('should fail if street address is too long', async () => {
    const newAddress = { ...updatedAddress };
    newAddress.street_address = 'hello there,'.trim().repeat(10);
    const response = await request(app)
      .patch(
        `/api/v1/users/${dbUser.id}/addresses/${addressData.body.userAddress.id}`,
      )
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining([
        'Street address should be at most 100 characters',
      ]),
    );
  });

  it('should fail if city is empty', async () => {
    const newAddress = { ...updatedAddress };
    newAddress.city = '';
    const response = await request(app)
      .patch(
        `/api/v1/users/${dbUser.id}/addresses/${addressData.body.userAddress.id}`,
      )
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['City cannot be empty']),
    );
  });

  it('should fail if city is too long', async () => {
    const newAddress = { ...updatedAddress };
    newAddress.city = 'hello there,I'.trim().repeat(4);
    const response = await request(app)
      .patch(
        `/api/v1/users/${dbUser.id}/addresses/${addressData.body.userAddress.id}`,
      )
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['maximum length of characters reached']),
    );
  });

  it('should fail if state is empty', async () => {
    const newAddress = { ...updatedAddress };
    newAddress.state = '';
    const response = await request(app)
      .patch(
        `/api/v1/users/${dbUser.id}/addresses/${addressData.body.userAddress.id}`,
      )
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['State cannot be empty']),
    );
  });

  it('should fail if state is too long', async () => {
    const newAddress = { ...updatedAddress };
    newAddress.state = 'hello there,I'.trim().repeat(4);
    const response = await request(app)
      .patch(
        `/api/v1/users/${dbUser.id}/addresses/${addressData.body.userAddress.id}`,
      )
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['State cannot exceed 50 characters']),
    );
  });

  it('should fail if country is empty', async () => {
    const newAddress = { ...updatedAddress };
    delete newAddress.country;
    const response = await request(app)
      .patch(
        `/api/v1/users/${dbUser.id}/addresses/${addressData.body.userAddress.id}`,
      )
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['Country cannot be empty']),
    );
  });

  it('should fail if country is too long', async () => {
    const newAddress = { ...updatedAddress };
    newAddress.country = 'hello there,I'.trim().repeat(4);
    const response = await request(app)
      .patch(
        `/api/v1/users/${dbUser.id}/addresses/${addressData.body.userAddress.id}`,
      )
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['Country cannot exceed 50 characters']),
    );
  });
});

describe('GET all user addresses', () => {
  it('should fail if user is not authenticated', async () => {
    const response = await request(app).get(
      `/api/v1/users/${dbUser.id}/addresses`,
    );
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toEqual(
      'Access denied. You are not authorized to access this route',
    );
  });
  it('should fail if logged in user is not the address owner', async () => {
    const response = await request(app)
      .get(`/api/v1/users/1111/addresses`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' });
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toEqual(
      "You cannot access a resource you didn't create",
    );
  });
  it('should fetch all addresses created by the user with the id', async () => {
    const response = await request(app)
      .get(`/api/v1/users/${dbUser.id}/addresses`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual(
      `${response.body.userAddress.length} found`,
    );
  });
});
describe('GET One user address', () => {
  it('should fail if user is not authenticated', async () => {
    const response = await request(app).get(
      `/api/v1/users/${dbUser.id}/addresses`,
    );
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toEqual(
      'Access denied. You are not authorized to access this route',
    );
  });
  it('should fetch the address with id created by the user', async () => {
    const response = await request(app)
      .get(
        `/api/v1/users/${dbUser.id}/addresses/${addressData.body.userAddress.id}`,
      )
      .set({ 'x-auth-token': userToken, Accept: 'application/json' });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('address fetched successfully');
    expect(response.body.userAddress.id).toEqual(
      addressData.body.userAddress.id,
    );
  });
});

describe('DELETE user address', () => {
  it('should fail if user is not authenticated', async () => {
    const response = await request(app).delete(
      `/api/v1/users/${dbUser.id}/addresses/12`,
    );
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toEqual(
      'Access denied. You are not authorized to access this route',
    );
  });
  it('should fail if logged in user is not the address owner', async () => {
    const response = await request(app)
      .delete(`/api/v1/users/10/addresses/${addressData.body.userAddress.id}`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...updatedAddress });
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toEqual(
      "You cannot access a resource you didn't create",
    );
  });
  it('should delete the address', async () => {
    const response = await request(app)
      .delete(
        `/api/v1/users/${dbUser.id}/addresses/${addressData.body.userAddress.id}`,
      )
      .set({ 'x-auth-token': userToken, Accept: 'application/json' });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('address deleted successfully');
  });
});
