"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

const UploadImage = ({ params }: { params: { orderid: string } }) => {
  const { orderid }: { orderid: string } = params;
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any[]>([]);
  const hasResult = result?.length > 0;
  const failedRules = result?.filter((res) => res.status === "FAIL");
  const hasFail = failedRules.length > 0;

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!fileRef.current?.files?.length) return;

    const file = fileRef.current.files[0];
    const formData = new FormData();
    formData.append("image", file);
    formData.append("orderid", orderid);

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/label/upload`,
        formData,
      );
      setResult(res.data);
    } catch (err) {
      console.log("Error uploading the image", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-dark flex flex-col gap-4 items-center justify-center h-screen">
      <form className="flex flex-col gap-4" onSubmit={handleUpload}>
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="pdf" className="text-xl">
            Upload the Carton image
          </Label>
          <Input
            id="pdf"
            accept="image/*"
            type="file"
            ref={fileRef}
            onClick={() => {
              setResult([]);
            }}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? <Spinner /> : "Upload the Image"}
        </Button>
      </form>
      {hasResult &&
        (hasFail ? (
          <div className="p-2 grid bg-red-400 rounded-md w-full max-w-xs">
            <div className="font-semibold">Failed</div>
            <div className="text-sm">
              {failedRules.map((res, i) => (
                <div key={i}>{res.rule}</div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-2 grid bg-green-400 rounded-md w-full max-w-xs">
            <div className="font-semibold">Passed</div>
          </div>
        ))}
    </div>
  );
};

export default UploadImage;
