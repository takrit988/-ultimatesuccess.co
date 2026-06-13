import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, activeLesson, isEn } = body;

    if (!message) {
      return NextResponse.json({ error: "Missing message query" }, { status: 400 });
    }

    const lowerMessage = message.toLowerCase();
    let reply = "";

    // Simulated context-aware coaching replies based on active lecture context
    if (isEn) {
      if (activeLesson.includes("Alignment")) {
        reply = "Establishing Corporate Alignment is critical. Ensure your key executives share identical KPIs. Try holding a quarterly alignment workshop to map out the strategy together. What specific organizational alignment challenge are you facing?";
      } else if (activeLesson.includes("Flywheels")) {
        reply = "Growth Flywheels are all about feedback loops: customer success drives referrals, which lowers acquisition cost, permitting reinvestment. How can you automate the link between customer success and referral acquisition in your SME?";
      } else if (activeLesson.includes("Trust")) {
        reply = "High performance teams require trust. Encourage vulnerability-based trust. As a leader, admit mistakes first to pave the way. What's the current trust score of your board?";
      } else {
        reply = "Excellent question. In executive leadership, systemization is key. Make sure you map standard operating procedures before scaling operations. Let me know how I can guide you further on this topic!";
      }
    } else {
      if (activeLesson.includes("Alignment")) {
        reply = "การกำหนดเป้าหมายองค์กรให้ตรงกัน (Corporate Alignment) มีความสำคัญอย่างยิ่งครับ ขั้นแรกควรตรวจทานให้แน่ใจว่าผู้บริหารทุกคนถือดัชนีชี้วัดผลงาน (KPIs) ชุดเดียวกัน หากมีฝ่ายใดที่ขัดแย้งกัน ย่อมกระทบต่อการเติบโต คุณมีข้อกังวลในจุดใดเป็นพิเศษไหมครับ?";
      } else if (activeLesson.includes("Flywheels")) {
        reply = "วงล้อการเติบโตธุรกิจ (Growth Flywheels) เกิดจากการเชื่อมโยงความพึงพอใจของลูกค้าเข้ากับการตลาดแนะนำต่อ เมื่อลูกค้ารักบริการของเรา จะช่วยลดต้นทุนหาลูกค้าใหม่ลงได้มาก ในธุรกิจของคุณ จุดใดที่เป็นคานงัดหลักสำหรับวงล้อนี้ครับ?";
      } else if (activeLesson.includes("Trust")) {
        reply = "การสร้างทีมงานที่มีประสิทธิภาพสูงต้องใช้พื้นฐานความเชื่อมั่นและความรับผิดชอบร่วมกัน (Trust and Accountability) ผู้นำจำเป็นต้องสร้างพื้นที่ปลอดภัยให้ทุกคนกล้าเสนอความเห็นอย่างโปร่งใสครับ";
      } else {
        reply = "เป็นคำถามที่ดีมากครับ ในหลักการจัดการผู้บริหาร การสร้างระบบปฏิบัติการมาตรฐาน (SOPs) เป็นกุญแจสำคัญให้ธุรกิจดำเนินไปได้โดยไม่ต้องพึ่งพาตัวบุคคลตลอดเวลา มีแง่มุมไหนที่คุณต้องการให้ผมวิเคราะห์เพิ่มเติมไหมครับ?";
      }
    }

    // Simulate delay for realistic feeling
    await new Promise((resolve) => setTimeout(resolve, 800));

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ error: "AI endpoint error" }, { status: 500 });
  }
}
