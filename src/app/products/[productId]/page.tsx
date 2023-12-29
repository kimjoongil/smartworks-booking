interface IParams {
  productId?: string;
}

const ProductPage = async ({ params }: { params: IParams }) => {
  return <div>{params.productId}</div>;
};

export default ProductPage;
