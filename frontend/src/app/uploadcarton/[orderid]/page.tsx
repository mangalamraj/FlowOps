"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useRef, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

const uploadImage = () => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!fileRef.current?.files?.length) return;
    const file = fileRef.current?.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/label/upload`,
        formData,
      );
      console.log(res);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log("Error uploading the image", err);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="bg-dark flex items-center justify-center align-middle h-screen">
      <form className="flex flex-col gap-4" onSubmit={handleUpload}>
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="pdf" className="text-xl">
            Upload the Carton image
          </Label>
          <Input id="pdf" accept="image/*" type="file" ref={fileRef} />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? <Spinner /> : "Upload the Image"}
        </Button>
      </form>
    </div>
  );
};

export default uploadImage;
