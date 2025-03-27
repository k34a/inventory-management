import NewProductDetails from "@/components/NewProduct";
import Link from "next/link";

export default async function Page() {
  return (
    <div>
      <div className="min-h-screen">
        <h1 className="text-3xl font-bold text-center mt-6">
          Create New Product
        </h1>
        <NewProductDetails />
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
