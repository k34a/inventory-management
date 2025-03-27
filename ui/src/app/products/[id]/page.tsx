import ProductDetails from "@/components/productDetails";
import { fetchProduct } from "@/utils/products";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const product = await fetchProduct(id);
  return (
    <div>
      <div className="min-h-screen">
        <h1 className="text-3xl font-bold text-center mt-6">Product details</h1>
        <ProductDetails initialValues={product} />
        <Link
          href="/"
          className="hover:underline text-slate-600 hover:text-slate-900 flex justify-center my-6"
        >
          Back to all products
        </Link>
      </div>
    </div>
  );
}
