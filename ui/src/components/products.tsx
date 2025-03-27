import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

const Product = (props: Product) => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-lg group">
      <Link href={`/products/${props._id}`}>
        <div className="flex justify-between">
          <div className="text-3xl font-bold group-hover:underline">
            {props.name}
          </div>
          <div>${props.price}</div>
        </div>
        <p>{props.description}</p>
        <div>Category: {props.category}</div>
      </Link>
    </div>
  );
};

export default Product;
