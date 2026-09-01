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
      return setMsg("Phone number ထည့်ပါ။");
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
      setMsg("Member information ရယူရာမှာ error ဖြစ်နေပါတယ်။");
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
          <>
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

            <div className="stats">
              <div className="stat">
                <span>Total Purchase</span>
                <strong>
                  {Number(member.totalPurchase || 0).toLocaleString()} Ks
                </strong>
              </div>

              <div className="stat">
                <span>Purchase Count</span>
                <strong>
                  {(member.purchases || []).length}
                </strong>
              </div>
            </div>

            <div className="history">
              <h3>Purchase History</h3>

              {(member.purchases || []).length === 0 ? (
                <p className="muted">Purchase မရှိသေးပါ။</p>
              ) : (
                member.purchases.map((item) => (
                  <div className="historyItem" key={item.id}>
                    <div>
                      <strong>
                        {Number(item.amount).toLocaleString()} Ks
                      </strong>
                      <small>
                        {new Date(item.created_at).toLocaleDateString()}
                      </small>
                    </div>

                    <span>
                      +{item.points_earned} Points
                    </span>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
