import jwt from "jsonwebtoken";

export function generateToken(payload: any) {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET not configured in .env");
    }

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d", 
    });
}

export function verifyToken(token: string) {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET not configured in .env");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch {
        throw new Error("Invalid token");
    }
}
