"use client";

import { useState } from "react";
import Link from "next/link";

export default function QRPage() {
  const [phone, setPhone] = useState("");
  const [member, setMember] = useState(null);
  const [msg, setMsg] = useState("");

  async function findMember() {
    setMsg("");
    setMember(null);

    if (!phone.trim()) {
      setMsg("Phone number ထည့်ပါ။");
      return;
    }

    try {
      const response = await fetch(
        "/api/member?phone=" + encodeURIComponent(phone.trim())
      );

      const data = await response.json();

      if (!response.ok) {
        setMsg(data.error || "Member မတွေ့ပါ။");
        return;
      }

      setMember(data);
    } catch {
      setMsg("Server error ဖြစ်နေပါတယ်။");
    }
  }

  function qrUrl() {
    if (!member) return "";

    const memberUrl =
      window.location.origin + "/member?phone=" +
      encodeURIComponent(member.phone);

    return (
      "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
      encodeURIComponent(memberUrl)
    );
  }

  return (
    <main className="shell">
      <Link href="/" className="back">
        ← AKAYAR Home
      </Link>

      <section className="panel">
        <div className="badge">MEMBER QR</div>

        <h1>Customer QR Code</h1>

        <p className="muted">
          Customer phone number ထည့်ပြီး QR Code ထုတ်ပါ။
        </p>

        <div className="row">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="09xxxxxxxxx"
          />

          <button onClick={findMember}>
            QR ထုတ်မယ်
          </button>
        </div>

        {msg && <p className="error">{msg}</p>}

        {member && (
          <div style={{ textAlign: "center", marginTop: 30 }}>
            <h2>{member.name}</h2>

            <p className="muted">{member.phone}</p>

            <img
              src={qrUrl()}
              alt="AKAYAR Member QR Code"
              width="300"
              height="300"
              style={{
                maxWidth: "100%",
                borderRadius: 16,
                marginTop: 15
              }}
            />

            <div style={{ marginTop: 20 }}>
              <strong>{member.points} Points</strong>
            </div>

            <p className="muted">
              ဒီ QR Code ကို Customer ဖုန်းနဲ့ Scan လုပ်နိုင်ပါတယ်။
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
