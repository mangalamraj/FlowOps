"use client";
import { Tags } from "@/components/home/popoverContainer";
import SkuRulesComponents from "@/components/skurules/skuRulesComponents";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

type skuRulePageProp = {
  orderid: string;
  sku: string;
  status: string;
  tags: Tags;
};
const SkuRulesPage = ({ params }: { params: Promise<{ orderid: string }> }) => {
  const { orderid } = React.use(params);
  const router = useRouter();
  function handleHomeClick() {
    router.push("/");
  }
  return (
    <div className="container mx-auto mt-10 flex flex-col gap-2">
      <div>
        <Home
          size={18}
          className="hover:opacity-75 cursor-pointer"
          onClick={handleHomeClick}
        />
      </div>
      <div className="text-2xl font-semibold">{orderid}: Rules</div>
      <SkuRulesComponents orderid={orderid} />
    </div>
  );
};

export default SkuRulesPage;
