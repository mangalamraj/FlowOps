"use client";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { FileDown } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useState } from "react";

const formSchema = z.object({
  file: z
    .any()
    .optional()
    .refine((files) => !files || files instanceof FileList, "Invalid file"),
});

const Header = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [open, setOpen] = useState(false);

  const fileRef = form.register("file");
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const file = data.file[0];

    if (!file) {
      alert("Please select a file");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/table/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (response) {
        toast.success("Success!");
        router.replace("/");
        setOpen(false);

        setTimeout(() => {
          window.location.reload();
        }, 150);

        console.log(response);
      } else {
        toast.error("Error while uploading the data!");
        console.log("Upload failed");
      }
    } catch (err) {
      console.log("Error during upload", err);
    }
  };
  return (
    <>
      <div className="flex justify-between md:items-center md:align-middle md:w-full">
        <div>
          <div className="font-semibold text-lg">Orders</div>
          <div className="text-sm md:text-base">Manage Your Orders</div>
        </div>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <a href="/data.csv" download="data">
                <Button variant={"outline"} className="cursor-pointer">
                  <span className="flex items-center gap-2">
                    <FileDown />
                    <span className="hidden md:block">Get Sample CSV</span>
                  </span>
                </Button>
              </a>
            </TooltipTrigger>
            <TooltipContent>Get your sample csv!</TooltipContent>
          </Tooltip>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-800 text-white hover:text-black cursor-pointer">
                <span className="flex items-center gap-2">
                  <Plus />
                  <span className="hidden md:block">Add Export</span>
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Your CSV</DialogTitle>
                <DialogDescription>
                  Click the the box to upload your CSV
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>File</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              placeholder="shadcn"
                              {...fileRef}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />{" "}
                  <Button type="submit" className="mt-2">
                    Submit
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <Toaster />
      </div>
    </>
  );
};

export default Header;
