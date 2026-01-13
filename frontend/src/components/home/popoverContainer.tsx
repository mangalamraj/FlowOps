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
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";

type Tags = {
  category: string;
  is_perishable: boolean;
  is_frozen: boolean;
  needs_label: boolean;
  needs_barcode: boolean;
  ships_case: boolean;
};

const popOverData = [
  "Perishable",
  "Frozen",
  "Needs Label",
  "Needs Barcode",
  "Shipcase",
];
type PopoverProps = Tags;

const PopoverContentComponent = (props: PopoverProps) => {
  const [input, setInput] = useState("");
  const [tags, setTags] = useState<Tags>({
    category: "",
    is_perishable: props?.is_perishable ?? false,
    is_frozen: props?.is_frozen ?? false,
    needs_label: props?.needs_label ?? false,
    needs_barcode: props?.needs_barcode ?? false,
    ships_case: props?.ships_case ?? false,
  });
  const tagMap: Record<string, boolean> = {
    Perishable: tags.is_perishable,
    Frozen: tags.is_frozen,
    "Needs Label": tags.needs_label,
    "Needs Barcode": tags.needs_barcode,
    Shipcase: tags.ships_case,
  };
  function handleAdd() {
    setInput("");
    setTags((prev) => {
      switch (input) {
        case "Perishable":
          return { ...prev, is_perishable: true };
        case "Frozen":
          return { ...prev, is_frozen: true };
        case "Needs Label":
          return { ...prev, needs_label: true };
        case "Needs Barcode":
          return { ...prev, needs_barcode: true };
        case "Shipcase":
          return { ...prev, ships_case: true };
        default:
          return prev;
      }
    });
  }
  function onSubmit(e: SubmitEvent) {
    e.preventDefault();
    try {
      const reponse = axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/addTags`
      );
    } catch (e) {}
  }
  return (
    <>
      <div className="flex justify-between mb-4">
        
        <Select
          value={input}
          onValueChange={(value) => {
            setInput(value);
          }}
        >
          <SelectTrigger className="w-[220px]">
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
        <Button variant={"ghost"} className="rounded-full" onClick={handleAdd}>
          <Plus />
        </Button>
      </div>
      <div className="min-h-8">
        <div className="flex gap-2 flex-wrap text-xs mb-2">
          {tags.is_perishable && <Badge>Perishable</Badge>}
          {tags.is_frozen && <Badge>Frozen</Badge>}
          {tags.needs_label && <Badge>Needs Label</Badge>}
          {tags.needs_barcode && <Badge>Needs Barcode</Badge>}
          {tags.ships_case && <Badge>Shipcase</Badge>}
        </div>
      </div>
      <Button className="w-full">Submit</Button>
    </>
  );
};

export default PopoverContentComponent;
