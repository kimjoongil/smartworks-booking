"use client";
import { SyntheticEvent, useState } from "react";
import type { brand } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";


const AddProduct = ({ brands }: { brands: brand[] }) => {
  const [title,setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [isOpen, setIsOpen] = useState(false);

    
  const [money, setMoney] = useState(0);

  const addComma = (price: string) => {
    let returnString = price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return returnString;
  };

  const onChangePoints = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    let str = value.replaceAll(",", "");
    setMoney(Number(str));
  };


const router = useRouter();
  const handeSubmit =async (e:SyntheticEvent) => {
    e.preventDefault();
    await axios.post("/api/products/", {
      title: title,
      /* price: Number(price),
      brandId: Number(brand) */
      price: 1,
      brandId: 1,
    });

    setTitle("");
    setPrice("");
    setBrand("");
    router.refresh(); 
    setIsOpen(false);
  }
  
  const handleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button className="btn" onClick={handleModal}>
        글쓰기
      </button>

      <div className={isOpen ? "modal modal-open" : "modal"}>
        <div className="modal-box">
          <h3 className="font-bold text-center text-lg">하고싶은 말</h3>
          <form onSubmit={handeSubmit}>
            <div className="form-control w-full">
              <label className="label font-bold">한줄내용</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-bordered"
                placeholder="What I want to say"
              />
            </div>
            {/* <div className="form-control w-full">
              <label className="label font-bold">Price</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="input input-bordered"
                placeholder="Price"
              />
            </div>
            <div className="form-control w-full">
              <label className="label font-bold">Brand</label>
              <select value={brand} onChange={(e)=>setBrand(e.target.value)} className="select select-bordered">
                <option value="" disabled>
                  Select a Brand
                </option>

                {brands.map((brand) => (
                  <option value={brand.id} key={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div> */}
            <div className="modal-action">
              <button type="button" className="btn" onClick={handleModal}>
                Close
              </button>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
