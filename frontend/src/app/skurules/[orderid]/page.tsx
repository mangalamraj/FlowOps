import { Tags } from "@/components/home/popoverContainer";
import SkuRulesComponents from "@/components/skurules/skuRulesComponents";

type skuRulePageProp = {
  orderid: string;
  sku: string;
  status: string;
  tags: Tags;
};
const SkuRulesPage = async ({
  params,
}: {
  params: Promise<{
    orderid: string;
  }>;
}) => {
  const { orderid } = await params;
  return (
    <div className="container mx-auto mt-10 flex flex-col gap-2">
      <div className="text-2xl font-semibold">{orderid}: Rules</div>
      <SkuRulesComponents orderid={orderid} />
    </div>
  );
};

export default SkuRulesPage;
