"use client";

import { use, useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Order } from "@/types";
import axios from "axios";

//Todo: make data fetch more optimised by getting tags from userouter from the last page

const SkuRulesComponents = ({ orderid }: { orderid: string }) => {
  const [orderData, setOrderData] = useState<Order>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/table/getrules`,
          {
            params: {
              orderid: orderid,
            },
          },
        );
        setLoading(false);
        console.log(response.data);
      } catch (err) {
        setLoading(false);
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  });
  return (
    <>
      <div className="flex gap-2 mb-4">
        <Badge>Frozen</Badge>
        <Badge>Need Lable</Badge>
      </div>
      <div>Please follow these instructions</div>
      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4, 5].map((key) => (
          <Card key={key}>
            <CardContent className="flex items-center gap-3 text-xl">
              <Checkbox id="terms" />
              <Label htmlFor="terms">Accept terms and conditions</Label>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button className="mt-4 cursor-pointer">Complete VAS</Button>
    </>
  );
};

export default SkuRulesComponents;
