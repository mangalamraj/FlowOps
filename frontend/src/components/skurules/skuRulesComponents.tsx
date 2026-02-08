"use client";

import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Order } from "@/types";
import { useRouter } from "next/navigation";
import axios from "axios";
import { RefreshCcw, RotateCw } from "lucide-react";
import { Spinner } from "../ui/spinner";

//Todo: make data fetch more optimised by getting tags from userouter from the last page

const SkuRulesComponents = ({ orderid }: { orderid: string }) => {
  let count = 0;
  const [rules, setRules] = useState<Order>();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();

  function handleSubmit() {
    const found = rules?.dimensionrules?.some(
      (el) => el.reference === "edge" || "bottom" || "center",
    );
    if (found) {
      router.push(`/uploadcarton/${orderid}`);
    }
  }
  function handleCheck() {
    count++;
    if (count === 10) {
      setDisabled(true);
    }
  }

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
        setRules(response.data);
        console.log(response.data);
      } catch (err) {
        setLoading(false);
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  return (
    <>
      {rules?.status === "rules pending" || loading ? (
        <div className="flex justify-center flex-col items-center align-middle h-[80vh] gap-2">
          <div className="">
            <Spinner />
          </div>
          <div>Rules are being fetched</div>
        </div>
      ) : (
        <>
          {" "}
          <div className="flex gap-2 mb-4">
            <Badge>Frozen</Badge>
            <Badge>Need Lable</Badge>
          </div>
          <div>Please follow these instructions</div>
          <div className="flex flex-col gap-2">
            {rules?.rules.slice(0, 10).map((rule, index) => (
              <Card key={index}>
                <CardContent className="flex items-center gap-3 text-xl">
                  <Checkbox
                    id={`rule-${index}`}
                    onCheckedChange={handleCheck}
                  />
                  <Label htmlFor={`rule-${index}`}>{rule}</Label>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button
            className="mt-4 cursor-pointer"
            onClick={handleSubmit}
            disabled={!disabled}
          >
            Complete VAS
          </Button>
        </>
      )}
    </>
  );
};

export default SkuRulesComponents;
