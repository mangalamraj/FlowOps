"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useRef } from "react";

export default function Home() {
  const fileRef = useRef<HTMLInputElement | null>(null);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!fileRef.current?.files?.length) return;

    const data = new FormData();
    data.append("file", fileRef.current.files[0]);

    try {
      const response = await axios.post(
        "http://localhost:8000/pdf/uploadpdf",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
    } catch (e) {
      console.log("error while uploading the file", e);
    }
  }

  return (
    <div className="bg-dark flex items-center justify-center align-middle h-screen">
      <form className="flex flex-col gap-4" onSubmit={handleUpload}>
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="pdf" className="text-xl">
            Upload the Pdf
          </Label>
          <Input id="pdf" type="file" ref={fileRef} />
        </div>

        <Button type="submit">Upload the Image</Button>
      </form>
    </div>
  );
}
