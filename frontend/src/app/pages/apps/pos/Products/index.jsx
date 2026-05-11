// Local Imports
import { ProductCard } from "./ProductCard";

// ----------------------------------------------------------------------

const products = [
  {
    uid: "1",
    image: "/images/foods/food-1.jpg",
    name: "Duck Salad",
    category: "Pizza",
    price: "35.00",
  },
  {
    uid: "2",
    image: "/images/foods/food-2.jpg",
    name: "Breakfast board",
    category: "Taco",
    price: "14.00",
  },
  {
    uid: "3",
    image: "/images/foods/food-3.jpg",
    name: "Hummus",
    category: "Sandwich",
    price: "24.00",
  },
  {
    uid: "4",
    image: "/images/foods/food-4.jpg",
    name: "Roast beef",
    category: "Kebab",
    price: "17.50",
  },
  {
    uid: "5",
    image: "/images/foods/food-5.jpg",
    name: "Tuna salad",
    category: "Popcorn",
    price: "35.00",
  },
  {
    uid: "6",
    image: "/images/foods/food-6.jpg",
    name: "Salmon",
    category: "Burger",
    price: "48.00",
  },
  {
    uid: "7",
    image: "/images/foods/food-7.jpg",
    name: "California roll",
    category: "Taco",
    price: "74.00",
  },
  {
    uid: "8",
    image: "/images/foods/food-8.jpg",
    name: "Sashimi",
    category: "Burrito",
    price: "74.00",
  },
  {
    uid: "9",
    image: "/images/foods/food-9.jpg",
    name: "Pub salad",
    category: "Salad",
    price: "62.00",
  },
  {
    uid: "10",
    image: "/images/foods/food-10.jpg",
    name: "Duck carpaccio",
    category: "Popcorn",
    price: "16.00",
  },
  {
    uid: "11",
    image: "/images/foods/food-11.jpg",
    name: "Maui food",
    category: "Hot Dog",
    price: "32.00",
  },
  {
    uid: "12",
    image: "/images/foods/food-12.jpg",
    name: "Scottish salmon",
    category: "Burger",
    price: "36.00",
  },
];

export function Products() {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4 sm:mt-5 sm:gap-5 lg:mt-6 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.uid} {...product} />
      ))}
    </div>
  );
}
