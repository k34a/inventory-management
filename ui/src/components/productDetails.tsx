"use client";

import React, { FormEvent, useState } from "react";
import Input from "./input";
import Link from "next/link";
import useAuth from "./auth/useAuth";
import { deleteProduct, updateProduct } from "@/utils/products";
import { useRouter } from "next/navigation";

interface ProductDetailsProps {
  initialValues: {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
  };
}

const ProductDetails = ({ initialValues }: ProductDetailsProps) => {
  const [formValues, setFormValues] = useState(initialValues);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { token } = useAuth("token");

  const isSignedIn = token != null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { _id, ...updatedDetails } = formValues;
    const data = await updateProduct(_id, updatedDetails, token ?? "");
    if ("error" in data) {
      setErrors(data.error.reduce((acc, obj) => ({ ...acc, ...obj }), {}));
    } else {
      setErrors({});
      setIsEditing(false);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    const { _id } = formValues;
    const data = await deleteProduct(_id, token ?? "");
    if ("error" in data) {
      setErrors(data.error.reduce((acc, obj) => ({ ...acc, ...obj }), {}));
    } else {
      router.push("/");
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
        disabled={!isEditing || loading}
        error={errors.name}
      />
      <Input
        fieldName="description"
        label="Description"
        value={formValues.description}
        handleInputChange={handleInputChange}
        disabled={!isEditing || loading}
        error={errors.description}
      />
      <Input
        fieldName="price"
        label="Price"
        value={String(formValues.price)}
        handleInputChange={handleInputChange}
        disabled={!isEditing || loading}
        error={errors.price}
      />
      <Input
        fieldName="category"
        label="Category"
        value={formValues.category}
        handleInputChange={handleInputChange}
        disabled={!isEditing || loading}
        error={errors.category}
      />
      {isSignedIn ? (
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleEditClick}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
          {isEditing && (
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              disabled={loading}
            >
              Save
            </button>
          )}
        </div>
      ) : (
        <div>
          <Link
            className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
            href="/login"
          >
            Login to Edit
          </Link>
        </div>
      )}
      {isSignedIn && (
        <div>
          <button
            className="bg-red-600 py-2 px-4 text-white hover:bg-red-500 rounded-md disabled:bg-red-300"
            disabled={loading || isEditing}
            onClick={() => handleDelete()}
          >
            Delete Product
          </button>
        </div>
      )}
    </form>
  );
};

export default ProductDetails;
