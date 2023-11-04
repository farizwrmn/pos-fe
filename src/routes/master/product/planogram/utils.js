export function filterStoreById (storeId, listAllStores) {
  if (typeof storeId !== 'number' || !Array.isArray(listAllStores)) {
    throw new Error('Invalid input parameters')
  }
  let data = listAllStores.find(x => x.id === storeId)
  return data || storeId
}
