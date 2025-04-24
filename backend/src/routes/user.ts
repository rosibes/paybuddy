import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import zod, { ParseStatus, string } from "zod";
import { JWT_SECRET } from "../config";
import { AccountModel, UserModel } from "../models/db";
import bcrypt from "bcrypt";
import { AuthenticatedRequest, authMiddleware } from "../middlewares/middleware";


const userRouter = express.Router();

const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string(),
});

const signInSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

interface UserResponse {
    username: string;
    firstName: string;
    lastName: string;
    _id: string;
}



userRouter.post("/signup", async (req: Request, res: Response) => {
    try {
        // Validate input
        const parsed = signupSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                message: "Invalid input",
                issues: parsed.error.errors
            });
            return
        }

        const { username, password, firstName, lastName } = parsed.data;

        // Check if user exists
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            res.status(409).json({
                message: "Username already taken"
            });
            return
        }


        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create({
            username,
            password: hashedPassword,
            firstName,
            lastName
        });

        const userId = user._id;

        // Create the account for user
        const account = await AccountModel.create({
            userId,
            balance: 1 + Math.random() * 1000
        })

        // Generate JWT
        const token = jwt.sign(
            { userId },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Return success response
        res.status(201).json({
            message: "User created successfully",
            token,
            userId: user._id
        });

    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({
            message: "Internal server error"
        });
        return
    }
});


userRouter.post("/signin", async (req: Request, res: Response) => {
    try {
        const body = req.body;

        const parsedData = signInSchema.safeParse(body);
        if (!parsedData.success) {
            res.status(411).json({
                message: "Error while logging in"
            })
            return
        }

        const username = body.username;
        const password = body.password;



        const user = await UserModel.findOne({ username }).select('+password');
        if (!user) {
            res.status(401).json({
                message: "Incorrect username"
            });
            return
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({
                message: "Invalid password"
            });
            return
        }

        const token = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            token,
            userId: user._id,
            username: user.username,
            message: "Login successful"
        });

    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({
            message: "Internal server error"
        });
        return
    }
})


userRouter.put("/update", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    //@ts-ignore
    if (!req.userId) {
        res.status(401).json({
            message: "Unauthorized - User ID missing"
        });
        return;
    }

    // Prevenim orice schimbare a câmpului username
    if (req.body.username) {
        res.status(400).json({
            message: "You cannot change the username (email)"
        });
        return
    }


    const parsedData = updateBody.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            message: "Validation error",
            errors: parsedData.error.errors
        });
        return;
    }

    const updateData: Record<string, string> = {};

    if (parsedData.data.password) updateData.password = parsedData.data.password;
    if (parsedData.data.firstName) updateData.firstName = parsedData.data.firstName;
    if (parsedData.data.lastName) updateData.lastName = parsedData.data.lastName;

    //ne asiguram ca atunci cand se trimite un body gol (adica fara niciun camp din {password, lastname, firstname}, nu il lasa sa mearga)
    if (Object.keys(updateData).length === 0) {
        res.status(400).json({
            message: "No fields to update"
        });
        return
    }

    // Dacă e trimis password, îl hash-uim
    if (updateData.password) {
        const hashed = await bcrypt.hash(updateData.password, 10);
        updateData.password = hashed;
    }

    const result = await UserModel.updateOne(
        //@ts-ignore
        { _id: req.userId },
        { $set: updateData }
    );

    //util pt atunci cand intre timp userul e sters din BD, pt ca jwt va ramane pana expira, chiar daca userul a fost sters intre timp
    if (result.matchedCount === 0) {
        res.status(404).json({
            message: "User not found"
        });
        return;
    }

    res.json({
        message: "Updated successfully"
    });
});


userRouter.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await UserModel.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })


    res.json({
        user: users.map((user: { username: string; firstName: string; lastName: string; _id: string }): UserResponse => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    });
})

userRouter.get("/me", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const user = await UserModel.findById(req.userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return
    }

    res.json({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username
    });
});


export { userRouter }