import { Tags } from "@/components/home/popoverContainer";
import SkuRulesComponents from "@/components/skurules/skuRulesComponents";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  console.log("hii2", orderid);
  return (
    <div className="container mx-auto mt-10 flex flex-col gap-2">
      <div className="text-2xl font-semibold">{orderid}: Rules</div>
      <SkuRulesComponents orderid={orderid} />
    </div>
  );
};

export default SkuRulesPage;
