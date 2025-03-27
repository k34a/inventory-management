const BASE_URL = "http://localhost:8000";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

const fetchProducts = async (): Promise<Product[]> => {
  const res = await fetch(`${BASE_URL}/api/products`, {
    method: "GET",
    cache: "no-store",
  });
  const data = await res.json();
  return data;
};

const fetchProduct = async (id: string): Promise<Product> => {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: "GET",
    cache: "no-store",
  });
  const data = await res.json();
  console.log(data);
  return data;
};

interface UpdationErrors {
  error: Array<Record<string, string>>;
}

const updateProduct = async (
  id: string,
  updatedDetails: Omit<Product, "_id">,
  token: string
): Promise<Product | UpdationErrors> => {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(updatedDetails),
  });
  const data = await res.json();
  return data;
};

const createProduct = async (
  details: Omit<Product, "_id">,
  token: string
): Promise<Product | UpdationErrors> => {
  const res = await fetch(`${BASE_URL}/api/products/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(details),
  });
  const data = await res.json();
  return data;
};

interface DeletionData {
  message: string;
}

const deleteProduct = async (
  id: string,
  token: string
): Promise<DeletionData | UpdationErrors> => {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  const data = await res.json();
  return data;
};

export {
  fetchProducts,
  fetchProduct,
  updateProduct,
  createProduct,
  deleteProduct,
};
