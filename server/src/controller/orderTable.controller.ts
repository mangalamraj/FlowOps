import { Request, Response } from "express";

export const getAllOrders = (req: Request, res: Response) => {
  res.json({
    message: "Hi from getAllOrders",
  });
};

export const uploadOrders = (req: Request, res: Response) => {
  res.json({
    message: "Hi from uploadOrders",
  });
};
