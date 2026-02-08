import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "../ui/badge";

export type Tags = {
  orderid: string;
  is_perishable: boolean;
  is_frozen: boolean;
  is_fragile: boolean;
  is_hazardous: boolean;

  has_inner_pack: boolean;
  has_carton_case: boolean;

  requires_case_shipping_label: boolean;
  requires_pallet_shipping_label: boolean;
  requires_shipping_documents: boolean;

  requires_barcode_gtin: boolean;
  requires_rfid: boolean;

  palletized_item: boolean;
  retail_ready_display: boolean;
  direct_store_delivery: boolean;
};
const TAG_CONFIG = {
  Perishable: "is_perishable",
  Frozen: "is_frozen",
  Fragile: "is_fragile",
  Hazardous: "is_hazardous",

  "Inner Pack": "has_inner_pack",
  "Carton Case": "has_carton_case",

  "Case Shipping Label": "requires_case_shipping_label",
  "Pallet Shipping Label": "requires_pallet_shipping_label",
  "Shipping Documents": "requires_shipping_documents",

  Barcode: "requires_barcode_gtin",
  RFID: "requires_rfid",

  Palletized: "palletized_item",
  "Retail Ready Display": "retail_ready_display",
  "Direct Store Delivery": "direct_store_delivery",
} as const;

const popOverData = Object.keys(TAG_CONFIG);

type PopoverProps = Tags;

const PopoverContentComponent = (props: PopoverProps) => {
  const [input, setInput] = useState<keyof typeof TAG_CONFIG | "">("");
  const [tags, setTags] = useState<Tags>({ ...props });

  const tagMap = Object.entries(TAG_CONFIG).reduce(
    (acc, [label, key]) => {
      acc[label] = tags[key];
      return acc;
    },
    {} as Record<string, boolean>,
  );

  function handleAdd() {
    if (!input) return;

    const key = TAG_CONFIG[input];
    setTags((prev) => ({ ...prev, [key]: true }));
    setInput("");
  }

  async function onSubmit(e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault();

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/table/addTags`, {
        tags,
        orderid: props.orderid,
      });
    } catch (e) {
      console.error("Error while updating/inserting the tags");
    }
  }

  return (
    <>
      <div className="flex justify-between mb-4">
        <Select
          value={input}
          onValueChange={(value) => setInput(value as keyof typeof TAG_CONFIG)}
        >
          <SelectTrigger className="w-55">
            <SelectValue placeholder="Select Tags" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>Tags</SelectLabel>
              {popOverData
                .filter((item) => !tagMap[item])
                .map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button variant="ghost" className="rounded-full" onClick={handleAdd}>
          <Plus />
        </Button>
      </div>

      <div className="min-h-8 mb-3">
        <div className="flex gap-2 flex-wrap text-xs">
          {Object.entries(TAG_CONFIG).map(
            ([label, key]) => tags[key] && <Badge key={key}>{label}</Badge>,
          )}
        </div>
      </div>

      <Button className="w-full" onClick={onSubmit}>
        Submit
      </Button>
    </>
  );
};

export default PopoverContentComponent;
