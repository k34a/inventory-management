"use client";

import React, { FormEvent, useState } from "react";
import Input from "./input";
import Link from "next/link";
import useAuth from "./auth/useAuth";
import { createProduct, deleteProduct, updateProduct } from "@/utils/products";
import { useRouter } from "next/navigation";

interface ProductDetails {
  name: string;
  description: string;
  price: number;
  category: string;
}

const initialValues = {
  name: "",
  description: "",
  price: 0,
  category: "",
};

const NewProductDetails = () => {
  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { token } = useAuth("token");
  const isSignedIn = token != null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = await createProduct(formValues, token ?? "");
    if ("error" in data) {
      setErrors(data.error.reduce((acc, obj) => ({ ...acc, ...obj }), {}));
    } else {
      setErrors({});
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white shadow-md rounded-md max-w-md mx-auto grid grid-cols-1 gap-5"
    >
      <Input
        fieldName="name"
        label="Name"
        value={formValues.name}
        handleInputChange={handleInputChange}
        disabled={loading}
        error={errors.name}
      />
      <Input
        fieldName="description"
        label="Description"
        value={formValues.description}
        handleInputChange={handleInputChange}
        disabled={loading}
        error={errors.description}
      />
      <Input
        fieldName="price"
        label="Price"
        value={String(formValues.price)}
        handleInputChange={handleInputChange}
        disabled={loading}
        error={errors.price}
      />
      <Input
        fieldName="category"
        label="Category"
        value={formValues.category}
        handleInputChange={handleInputChange}
        disabled={loading}
        error={errors.category}
      />
      {isSignedIn ? (
        <div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            disabled={loading}
          >
            Save
          </button>
        </div>
      ) : (
        <div>
          <Link
            className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
            href="/login"
          >
            Login to Create
          </Link>
        </div>
      )}
    </form>
  );
};

export default NewProductDetails;
