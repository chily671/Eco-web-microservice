import { createUser } from './api';

describe('createUser', () => {
  it('should create a new user with the provided data', () => {
    const req = {
      body: {
        username: 'JohnDoe',
        email: 'johndoe@example.com',
        password: 'password123',
      },
    };

    const cart = ['item1', 'item2'];

    const result = createUser(req, cart);

    expect(result.name).toBe(req.body.username);
    expect(result.email).toBe(req.body.email);
    expect(result.password).toBe(req.body.password);
    expect(result.cartData).toEqual(cart);
  });
});