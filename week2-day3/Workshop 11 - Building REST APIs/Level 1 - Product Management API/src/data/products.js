/**
 * In-memory data storage
 * ในโปรเจคจริงจะใช้ database
 */
let products = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    description: "Latest iPhone with A17 Pro chip",
    price: 42900,
    category: "Electronics",
    stock: 50,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "MacBook Pro M3",
    description: "14-inch MacBook Pro with M3 chip",
    price: 59900,
    category: "Electronics",
    stock: 30,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "AirPods Pro",
    description: "Active Noise Cancellation",
    price: 8990,
    category: "Electronics",
    stock: 100,
    createdAt: new Date().toISOString()
  }
];

let nextId = 4;

function getAll() {
  return products;
}

function getById(id) {
  return products.find(p => p.id === parseInt(id));
}

function create(productData) {
  const newProduct = {
    id: nextId++,
    ...productData,
    createdAt: new Date().toISOString()
  };
  products.push(newProduct);
  return newProduct;
}

function update(id, productData) {
  const index = products.findIndex(p => p.id === parseInt(id));

  if (index === -1) return null;

  products[index] = {
    id: parseInt(id),
    ...productData,
    createdAt: products[index].createdAt,
    updatedAt: new Date().toISOString()
  };

  return products[index];
}

function partialUpdate(id, updates) {
  const index = products.findIndex(p => p.id === parseInt(id));

  if (index === -1) return null;

  products[index] = {
    ...products[index],
    ...updates,
    id: parseInt(id),
    updatedAt: new Date().toISOString()
  };

  return products[index];
}

function remove(id) {
  const index = products.findIndex(p => p.id === parseInt(id));

  if (index === -1) return false;

  products.splice(index, 1);
  return true;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  partialUpdate,
  remove
};
