import { Plus, Upload } from "lucide-react";
import { Button } from "../ui/button";

const Header = () => {
  return (
    <>
      <div className="flex justify-between md:items-center md:align-middle md:w-full">
        <div>
          <div className="font-semibold text-lg">Orders</div>
          <div className="text-sm md:text-base">Manage Your Orders</div>
        </div>
        <div className="flex gap-2">
          <Button variant={"outline"} className="cursor-pointer">
            <Upload></Upload>
            <div className="hidden md:block">Import</div>
          </Button>
          <Button className="bg-blue-800 text-white hover:text-black cursor-pointer">
            <Plus></Plus>
            <div className="hidden md:block">Add Export</div>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Header;
