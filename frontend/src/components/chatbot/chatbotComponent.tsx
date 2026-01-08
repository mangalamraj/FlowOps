"use client";
import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "../ui/separator";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import CryptoJS from "crypto-js";

type Tmessages = {
  type: string;
  message: string;
  timestamp?: string;
};

const ChatBotPopUp = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Tmessages[]>([]);
  const [loading, setLoading] = useState(false);
  const messageRef = useRef<HTMLDivElement | null>(null);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Client-side encryption with AES
  function encryptData(data: string, secret: string): string {
    return CryptoJS.AES.encrypt(data, secret).toString();
  }

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (input.trim() === "") return;

    const newMessage: Tmessages = {
      type: "user",
      message: input,
    };

    setMessages([...messages, newMessage]);
    setInput("");

    const secretKey = "secret";
    const encryptedInput = encryptData(input, secretKey);

    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/bot/getresponse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ encryptedmessage: encryptedInput }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            type: "bot",
            message: data.summary,
          },
        ]);
        setLoading(false);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            type: "bot",
            message: "Sorry, something went wrong. Please try again.",
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: "bot",
          message: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMessages((prevMessages) => [
      {
        type: "bot",
        message: "Put your order id/sku/warehouse here",
      },
    ]);
  }, []);

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const renderMessages = () => {
    return (
      <>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={cn(
              "p-2 mx-2 my-2 min-w-[45px] max-w-[75%] rounded-lg text-sm",
              msg.type === "user"
                ? "bg-blue-500 self-end text-white"
                : "bg-gray-200 self-start text-black",
            )}
          >
            <p className="whitespace-pre-wrap">{msg.message}</p>
          </div>
        ))}

        {loading && (
          <div
            className={cn(
              "p-2 mx-2 my-2 min-w-[45px] max-w-[75%] rounded-lg text-sm bg-gray-200 self-start text-black",
            )}
          >
            <Spinner />
          </div>
        )}
      </>
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="fixed flex p-0 justify-center m-4 text-center items-center bottom-0 hover:opacity-75 right-0 h-12 w-12 rounded-full"
          aria-label="Open chatbot"
        >
          <Image width={50} height={50} src="/boticon.png" alt="boticon" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="md:w-96 w-[21em] px-2 mr-4 mb-2 h-[500px] md:h-[600px] flex flex-col">
        <div className="flex flex-col gap-4 ml-2">
          <div className="flex items-center">
            <Avatar>
              {/*<AvatarImage src="https://github.com/shadcn.png" />*/}
              <AvatarFallback>FO</AvatarFallback>
            </Avatar>
            <div className="ml-2 mt-auto">
              <h4 className="font-medium leading-none ">FlowOps AI Chatbot</h4>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
          <Separator />
        </div>

        <div className="flex flex-col flex-grow overflow-auto">
          <section
            className="flex flex-col mt-4 overflow-scroll text-sm flex-grow"
            style={{ overflowAnchor: "none" }}
          >
            {renderMessages()}
            <div ref={messageRef}></div>
          </section>
        </div>

        <div>
          <form onSubmit={handleSubmit}>
            {/*{messages.length === 1 && (
              <div
                className="mx-2 mb-2 flex gap-2 overflow-scroll"
                style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
              >
                <Button
                  className={cn("px-2 h-6 rounded-full text-xs")}
                  onClick={() => {
                    setInput("What services does horizonAi provide?");
                    handleSubmit();
                  }}
                >
                  What services does horizonAi provide?
                </Button>

                <Button
                  className={cn("px-2 h-6 rounded-full text-xs")}
                  onClick={() => {
                    setInput("How can I integrate it into my website?");
                    handleSubmit();
                  }}
                >
                  How can I integrate it into my website?
                </Button>
              </div>
            )}*/}

            <Card className="mt-auto flex px-2 py-2 gap-2">
              <div className="flex items-center">
                <Input
                  className={cn(
                    "h-10 dark:bg-[#3B3B3B] bg-gray-100 focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0",
                  )}
                  value={input}
                  onChange={onInputChange}
                  placeholder="Type your message here"
                />
                <Button
                  variant="ghost"
                  className=" py-0"
                  disabled={input === ""}
                >
                  <Send size={20} color="#838383" />
                </Button>
              </div>
            </Card>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ChatBotPopUp;
