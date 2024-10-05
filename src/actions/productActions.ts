/* eslint-disable prettier/prettier */
interface Product {
    _id: string;
    name: string;
    price: number;
    thumbnail: string;
    imgs: string[];
    description: string;
    category: string;
    stock: number;
    date_added: string;
}

export const fetchAllProducts = (products: Product[]) => ({
    type: 'FETCH_ALL_PRODUCTS',
    payload: products,
  });

  export const addProduct = (product: Product) => ({
    type: 'ADD_PRODUCT',
    payload: product,
  });

  export const deleteProduct = (id: string) => ({
    type: 'DELETE_PRODUCT',
    payload: id,
  });

  export const editProduct = (updatedProduct: Partial<Product>) => ({
    type: 'EDIT_PRODUCT',
    payload: updatedProduct,
  });
