import UserAddress from './user_address.model';

export async function createUserAddress(address) {
  return UserAddress.query().insert(address).returning('*');
}

export async function patchUserAddress(id, address) {
  return UserAddress.query()
    .where({ id })
    .patch({ ...address, updated_at: UserAddress.fn.now() })
    .returning('*')
    .first();
}
export async function fetchUserAddresses(userId) {
  return UserAddress.query().select('*').where({ user_id: userId });
}
export async function fetchOneUserAddress(userId, addressId) {
  return UserAddress.query()
    .select('*')
    .where({ user_id: userId, id: addressId })
    .first();
}

export async function deleteOneUserAddress(userId, addressId) {
  return UserAddress.query().where({ user_id: userId, id: addressId }).del();
}
