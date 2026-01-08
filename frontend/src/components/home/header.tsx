"use client";
import { Plus, Upload } from "lucide-react";
import { Button } from "../ui/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

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

  const fileRef = form.register("file");

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
        console.log(response);
      } else {
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
          <Button variant={"outline"} className="cursor-pointer">
            <Upload></Upload>
            <div className="hidden md:block">Import</div>
          </Button>
          <Dialog>
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
      </div>
    </>
  );
};

export default Header;
