import express from "express"
import { authMiddleware } from "../middlewares/middleware"
import { AccountModel } from "../models/db"
import mongoose from "mongoose"

const accountRouter = express.Router()

accountRouter.get("/balance", authMiddleware, async (req, res) => {
    //@ts-ignore
    if (!req.userId) {
        res.status(401).json({
            message: "Unauthorized - User ID missing"
        })
    }

    const account = await AccountModel.findOne({
        //@ts-ignore
        userId: req.userId
    })

    res.status(200).json({
        balance: account.balance
    })
})

accountRouter.post("/transfer", authMiddleware, async (req, res) => {
    //@ts-ignore
    if (!req.userId) {
        res.status(401).json({
            message: "Unauthorized - User ID missing"
        })
        return;
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();


        const { amount, transferTo } = req.body;
        //@ts-ignore
        const userAccount = await AccountModel.findOne({ userId: req.userId }).session(session);
        //@ts-ignore

        if (!userAccount) {
            await session.abortTransaction();
            res.status(400).json({
                message: "Invalid account"
            })
            return;
        }

        if (userAccount.balance < amount) {
            await session.abortTransaction();
            res.status(400).json({
                message: "You don't have enough money"
            })
            return;
        }

        const toAccount = await AccountModel.findOne({ userId: transferTo }).session(session)

        if (!toAccount) {
            await session.abortTransaction();
            res.status(400).json({
                message: "Invalid account!"
            })
            return;
        }

        // Perform the transfer 
        //@ts-ignore
        await userAccount.updateOne({ $inc: { balance: -amount } }).session(session);
        await toAccount.updateOne({ $inc: { balance: amount } }).session(session);

        // Commit the transaction
        await session.commitTransaction();

        res.json({
            message: "Transfer successful"
        });
    } catch (err) {
        console.error("Transfer error:", err);
        await session.abortTransaction();
        res.status(500).json({ message: "Internal server error during transfer" });
    } finally {
        session.endSession();
    }
}
)

export { accountRouter }