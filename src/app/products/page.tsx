import { PrismaClient } from "@prisma/client";
import AddProduct from "./addProduct";
import DeleteProduct from "./deleteProduct";
import UpdateProduct from "./updateProduct";
const prisma = new PrismaClient();

const getProducts = async () => {
  const res = await prisma.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      brandId: true,
      brand: true,
    },
    orderBy: {
      title: "desc",
    },
  });

  return res;
};

const getBrands = async () => {
  const res = await prisma.brand.findMany();
  return res;
};

const Product = async () => {
  const [products, brands] = await Promise.all([getProducts(), getBrands()]);

  return (
    <div>
      <div className="justify-between mb-2">
        <h2 className="text-2xl font-bold">익명 한줄 낙서</h2>
        <AddProduct brands={brands} />
      </div>
      <table className="table">
        <colgroup>
          <col style={{ width: "5%" }} />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th>#</th>
            <th>한줄내용</th>
            {/* <th>PRICE</th>
            <th>BRAND</th>
            <th className="text-center">ACTIONS</th> */}
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>
              <td>{product.title}</td>
              {/*<td>{product.price}</td>
              <td>{product.brand.name}</td>
              <td className="flex justify-center space-x-1">
                <UpdateProduct brands={brands} product={product} />
                <DeleteProduct product={product} />
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Product;
