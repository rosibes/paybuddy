import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

interface DecodedToken {
    userId: string;
    [key: string]: any;
}

// Extindem interfața Request ca să aibă userId
export interface AuthenticatedRequest extends Request {
    userId?: string;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
            message: "Authorization header missing or invalid",
        });
        return;
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

        if (!decoded?.userId) {
            res.status(403).json({
                message: "Invalid token",
            });
            return;
        }

        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(403).json({
            message: "Invalid or expired token",
        });
        return;
    }
};
