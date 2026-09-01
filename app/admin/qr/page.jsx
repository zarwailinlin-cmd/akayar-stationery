"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";

export default function MemberQR() {
  const [phone, setPhone] = useState("");
  const [url, setUrl] = useState("");

  function generateQR() {
    const cleanPhone = phone.trim();

    if (!cleanPhone) return;

    const memberUrl =
      window.location.origin +
      "/member?phone=" +
      encodeURIComponent(cleanPhone);

    setUrl(memberUrl);
  }

  return (
    <main className="shell">
      <Link href="/admin" className="back">
        ← Admin
      </Link>

      <section className="panel">
        <div className="badge">ADMIN</div>

        <h1>Member QR Code</h1>

        <p className="muted">
          Customer Phone Number ထည့်ပြီး QR Code ထုတ်ပါ။
        </p>

        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="09xxxxxxxxx"
        />

        <button onClick={generateQR}>
          QR Code ထုတ်မယ်
        </button>

        {url && (
          <div
            style={{
              marginTop: "30px",
              textAlign: "center",
            }}
          >
            <QRCodeSVG
              value={url}
              size={240}
              level="H"
            />

            <h3 style={{ marginTop: "20px" }}>
              Customer QR Code
            </h3>

            <p className="muted">
              Customer က ဒီ QR ကို Scan လုပ်ပါ။
            </p>

            <p
              style={{
                fontSize: "12px",
                wordBreak: "break-all",
              }}
            >
              {url}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
