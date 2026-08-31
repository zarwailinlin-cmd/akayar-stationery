"use client";

import { useState } from "react";
import Link from "next/link";

export default function Member() {
  const [phone, setPhone] = useState("");
  const [member, setMember] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function lookup() {
    setMsg("");
    setMember(null);

    if (!phone.trim()) {
      setMsg("Phone number ထည့်ပါ။");
      return;
    }

    setLoading(true);

    try {
      const r = await fetch(
        "/api/member?phone=" + encodeURIComponent(phone.trim())
      );

      const d = await r.json();

      if (!r.ok) {
        setMsg(d.error || "Member မတွေ့ပါ။");
        return;
      }

      setMember(d);
    } catch (e) {
      setMsg("Server error ဖြစ်နေပါတယ်။");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell">
      <Link href="/" className="back">
        ← AKAYAR Home
      </Link>

      <section className="panel">
        <div className="badge">MEMBER PORTAL</div>

        <h1>My AKAYAR Points</h1>

        <p className="muted">
          Phone number နဲ့ Member account ကိုရှာပါ။
        </p>

        <div className="row">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="09xxxxxxxxx"
          />

          <button onClick={lookup} disabled={loading}>
            {loading ? "ရှာနေပါတယ်..." : "ရှာမယ်"}
          </button>
        </div>

        {msg && <p className="error">{msg}</p>}

        {member && (
          <div className="member">
            <div>
              <div className="muted">Member</div>

              <h2>{member.name}</h2>

              <p>{member.phone}</p>

              <span className="level">
                {member.member_level}
              </span>
            </div>

            <div className="points">
              {member.points}
              <small>POINTS</small>
            </div>
          </div>
        )}

        {member?.purchases?.length > 0 && (
          <div style={{ marginTop: 30 }}>
            <h2>Purchase History</h2>

            {member.purchases.map((purchase) => (
              <div
                key={purchase.id}
                style={{
                  padding: "14px 0",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <strong>
                  {Number(purchase.amount).toLocaleString()} Ks
                </strong>

                <div className="muted">
                  +{purchase.points_earned} Points
                </div>

                <small>
                  {new Date(
                    purchase.created_at
                  ).toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
