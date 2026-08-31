import {NextResponse} from "next/server";
import {supabaseAdmin} from "@/lib/supabase";

export async function GET(req) {
  try {
    const phone = new URL(req.url).searchParams.get("phone");

    if (!phone) {
      return NextResponse.json(
        {error: "Phone is required"},
        {status: 400}
      );
    }

    const sb = supabaseAdmin();

    const {data: customer, error: customerError} = await sb
      .from("customers")
      .select("id,phone,name,points,member_level")
      .eq("phone", phone)
      .maybeSingle();

    if (customerError) throw customerError;

    if (!customer) {
      return NextResponse.json(
        {error: "Member မတွေ့ပါ"},
        {status: 404}
      );
    }

    const {data: purchases, error: purchaseError} = await sb
      .from("purchases")
      .select("id,amount,points_earned,created_at")
      .eq("customer_id", customer.id)
      .order("created_at", {ascending: false});

    if (purchaseError) throw purchaseError;

    const totalPurchase = (purchases || []).reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    return NextResponse.json({
      ...customer,
      totalPurchase,
      purchases: purchases || []
    });

  } catch (e) {
    return NextResponse.json(
      {error: e.message},
      {status: 500}
    );
  }
}
