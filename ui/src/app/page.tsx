import AuthButton from "@/components/auth/button";
import Product from "@/components/products";
import { fetchProducts } from "@/utils/products";
import Link from "next/link";

export default async function Home() {
  const products = await fetchProducts();
  return (
    <div className="grid grid-cols-1 gap-5 w-11/12 max-w-[600px] mx-auto mt-8">
      <div className="flex gap-4 items-center">
        <AuthButton />
        <Link href="/new" className="">
          Create New Product
        </Link>
      </div>
      {products.map((product, index) => (
        <div key={index}>
          <Product {...product} />
        </div>
      ))}
    </div>
  );
}

export const dynamic = "force-dynamic";
