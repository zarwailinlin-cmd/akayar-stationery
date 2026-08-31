"use client";

import {useState} from "react";
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
            {loading ? "ရှာနေသည်..." : "ရှာမယ်"}
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

            <div className="summary">
              <div className="summary-card">
                <span>Total Purchase</span>
                <strong>
                  {Number(member.totalPurchase || 0).toLocaleString()} Ks
                </strong>
              </div>

              <div className="summary-card">
                <span>Current Points</span>
                <strong>{member.points} Points</strong>
              </div>
            </div>

            <div className="history">
              <h2>Purchase History</h2>

              {member.purchases?.length ? (
                member.purchases.map((purchase) => (
                  <div className="purchase" key={purchase.id}>
                    <div>
                      <strong>
                        {Number(purchase.amount).toLocaleString()} Ks
                      </strong>

                      <small>
                        {purchase.created_at
                          ? new Date(
                              purchase.created_at
                            ).toLocaleString()
                          : ""}
                      </small>
                    </div>

                    <span>
                      +{purchase.points_earned} Points
                    </span>
                  </div>
                ))
              ) : (
                <p className="muted">
                  Purchase history မရှိသေးပါ။
                </p>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
