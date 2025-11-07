import connectDb from "@/middleware/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDb();
    const body = await req.json();
    const { email, password } = body;

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return NextResponse.json({ success: true, token }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// import connectDb from "@/middleware/mongoose";
// import User from "@/models/User";
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";

// export async function POST(req) {
//   try {
//     await connectDb();
//     const body = await req.json();
//     const { email, password } = body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
//     }

//     const isPasswordCorrect = await bcrypt.compare(password, user.password);
//     if (!isPasswordCorrect) {
//       return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
//     }

//     return NextResponse.json({
//       success: true,
//       user: {
//         email: user.email,
//         // ⚠️ Do NOT send password
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
//   }
// }