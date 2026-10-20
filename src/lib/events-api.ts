import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";

type Sql = Awaited<ReturnType<typeof getSql>>;

export type EventItem = {
  id: number;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  location: string;
  category: string;
  categoryId: number;
  organizer: string;
  organizerId: string;
  tone: string;
  status: string;
  priceCents: number;
  capacity: number;
  sold: number;
};

export type Profile = {
  userId: string;
  displayName: string;
  phone: string;
  bio: string;
  role: string;
  email: string;
};

export type TicketItem = {
  id: number;
  code: string;
  status: string;
  amountCents: number;
  title: string;
  startAt: string;
  location: string;
  eventId: number;
  tone: string;
};

export type PaymentItem = {
  id: number;
  amountCents: number;
  status: string;
  last4: string;
  title: string;
  createdAt: string;
  eventId: number;
};

function stamp(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  return String(value ?? "");
}

function num(value: unknown): number {
  return typeof value === "number" ? value : Number(value ?? 0);
}

async function ensureProfile(sql: Sql, userId: string, fallbackName: string) {
  await sql`
    insert into profiles (user_id, display_name)
    values (${userId}, ${fallbackName})
    on conflict (user_id) do nothing
  `;
  const admins = await sql<{ n: number }>`select count(*)::int as n from profiles where role = 'admin'`;
  if (num(admins[0]?.n) === 0) {
    await sql`update profiles set role = 'admin' where user_id = ${userId}`;
  }
}

const EVENT_SELECT = `
  select e.id, e.title, e.description,
         e.start_at, e.end_at, e.location,
         coalesce(c.name, 'General') as category,
         coalesce(e.category_id, 0) as category_id,
         coalesce(nullif(p.display_name, ''), 'My Event') as organizer,
         e.organizer_id, e.tone, e.status, e.price_cents, e.capacity,
         (select count(*)::int from tickets t where t.event_id = e.id and t.status = 'valid') as sold
  from events e
  left join categories c on c.id = e.category_id
  left join profiles p on p.user_id = e.organizer_id
`;

type RawEvent = {
  id: number;
  title: string;
  description: string;
  start_at: unknown;
  end_at: unknown;
  location: string;
  category: string;
  category_id: number;
  organizer: string;
  organizer_id: string;
  tone: string;
  status: string;
  price_cents: number;
  capacity: number;
  sold: number;
};

function mapEvent(r: RawEvent): EventItem {
  return {
    id: num(r.id),
    title: r.title,
    description: r.description,
    startAt: stamp(r.start_at),
    endAt: stamp(r.end_at),
    location: r.location,
    category: r.category,
    categoryId: num(r.category_id),
    organizer: r.organizer,
    organizerId: r.organizer_id,
    tone: r.tone,
    status: r.status,
    priceCents: num(r.price_cents),
    capacity: num(r.capacity),
    sold: num(r.sold),
  };
}

export const listEvents = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql.query<RawEvent>(`${EVENT_SELECT} order by e.start_at asc`);
  return rows.map(mapEvent);
});

export const listCategories = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<{ id: number; name: string }>`select id, name from categories order by name`;
  return rows.map((r) => ({ id: num(r.id), name: r.name }));
});

export const getEvent = createServerFn({ method: "GET" })
  .validator((id: number) => Number(id))
  .handler(async ({ data: id }) => {
    const sql = await getSql();
    const rows = await sql.query<RawEvent>(`${EVENT_SELECT} where e.id = $1`, [id]);
    return rows[0] ? mapEvent(rows[0]) : null;
  });

export const getMe = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const session = await sql<{ email: string; name: string }>`
      select email, name from "user" where id = ${context.userId}
    `;
    const email = session[0]?.email ?? "";
    const name = session[0]?.name ?? "";
    await ensureProfile(sql, context.userId, name);
    const rows = await sql<{
      user_id: string;
      display_name: string;
      phone: string;
      bio: string;
      role: string;
    }>`select user_id, display_name, phone, bio, role from profiles where user_id = ${context.userId}`;
    const row = rows[0];
    const profile: Profile = {
      userId: context.userId,
      displayName: row?.display_name || name,
      phone: row?.phone ?? "",
      bio: row?.bio ?? "",
      role: row?.role ?? "user",
      email,
    };
    return profile;
  });

export const saveProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { displayName: string; phone: string; bio: string }) => ({
    displayName: String(input.displayName ?? "").trim().slice(0, 80),
    phone: String(input.phone ?? "").trim().slice(0, 32),
    bio: String(input.bio ?? "").trim().slice(0, 280),
  }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureProfile(sql, context.userId, data.displayName);
    await sql`
      update profiles
      set display_name = ${data.displayName}, phone = ${data.phone}, bio = ${data.bio}
      where user_id = ${context.userId}
    `;
    return { ok: true };
  });

export const myTickets = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      code: string;
      status: string;
      amount_cents: number;
      title: string;
      start_at: unknown;
      location: string;
      event_id: number;
      tone: string;
    }>`
      select t.id, t.code, t.status, t.amount_cents, e.title, e.start_at, e.location, e.id as event_id, e.tone
      from tickets t
      join events e on e.id = t.event_id
      where t.user_id = ${context.userId}
      order by e.start_at asc
    `;
    return rows.map((r) => ({
      id: num(r.id),
      code: r.code,
      status: r.status,
      amountCents: num(r.amount_cents),
      title: r.title,
      startAt: stamp(r.start_at),
      location: r.location,
      eventId: num(r.event_id),
      tone: r.tone,
    })) satisfies TicketItem[];
  });

export const myPayments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      amount_cents: number;
      status: string;
      last4: string;
      title: string;
      created_at: unknown;
      event_id: number;
    }>`
      select p.id, p.amount_cents, p.status, p.last4, e.title, p.created_at, p.event_id
      from payments p
      join events e on e.id = p.event_id
      where p.user_id = ${context.userId}
      order by p.created_at desc
    `;
    return rows.map((r) => ({
      id: num(r.id),
      amountCents: num(r.amount_cents),
      status: r.status,
      last4: r.last4,
      title: r.title,
      createdAt: stamp(r.created_at),
      eventId: num(r.event_id),
    })) satisfies PaymentItem[];
  });

function ticketCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "ME-";
  for (let i = 0; i < 8; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

function normalizeZm(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("0")) d = `260${d.slice(1)}`;
  if (d.length === 9) d = `260${d}`;
  if (!/^260\d{9}$/.test(d)) throw new Error("Enter a Zambian mobile number, for example 0971234567.");
  return d;
}

function secret(name: string) {
  return process.env[name]?.trim() ?? "";
}

type Wallet = "airtel" | "mtn" | "zamtel" | "btcpay";

function walletReady(provider: Wallet) {
  if (provider === "mtn") return Boolean(secret("MTN_MOMO_SUBSCRIPTION_KEY") && secret("MTN_MOMO_API_USER") && secret("MTN_MOMO_API_KEY"));
  if (provider === "airtel") return Boolean(secret("AIRTEL_CLIENT_ID") && secret("AIRTEL_CLIENT_SECRET") && secret("AIRTEL_BASE_URL"));
  if (provider === "btcpay") return Boolean(secret("BTCPAY_URL") && secret("BTCPAY_STORE_ID") && secret("BTCPAY_API_KEY"));
  return Boolean(secret("ZAMTEL_API_KEY") && secret("ZAMTEL_BASE_URL"));
}

async function pushToWallet(provider: Wallet, input: { msisdn: string; amount: string; reference: string; eventTitle: string }): Promise<{ status: "pending" | "paid"; message: string; reference?: string; checkoutUrl?: string }> {
  if (!walletReady(provider)) {
    const label = provider === "mtn" ? "MTN MoMo" : provider === "airtel" ? "Airtel Money" : provider === "btcpay" ? "BTCPay Server" : "Zamtel";
    throw new Error(`${label} is not connected. The app will not take money until that provider’s keys are set on the server.`);
  }
  if (provider === "mtn") return pushMtn(input);
  if (provider === "airtel") return pushAirtel(input);
  if (provider === "btcpay") return pushBtcpay(input);
  return pushZamtel(input);
}

async function pushMtn(input: { msisdn: string; amount: string; reference: string }) {
  const base = secret("MTN_MOMO_BASE_URL") || "https://sandbox.momodeveloper.mtn.com";
  const basic = Buffer.from(`${secret("MTN_MOMO_API_USER")}:${secret("MTN_MOMO_API_KEY")}`).toString("base64");
  const tokenRes = await fetch(`${base}/collection/token/`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Ocp-Apim-Subscription-Key": secret("MTN_MOMO_SUBSCRIPTION_KEY"),
    },
  });
  if (!tokenRes.ok) throw new Error("MTN rejected the merchant login. Check the collection subscription key and API user.");
  const token = (await tokenRes.json()) as { access_token?: string };
  if (!token.access_token) throw new Error("MTN did not return an access token.");
  const res = await fetch(`${base}/collection/v1_0/requesttopay`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      "Ocp-Apim-Subscription-Key": secret("MTN_MOMO_SUBSCRIPTION_KEY"),
      "X-Reference-Id": input.reference,
      "X-Target-Environment": secret("MTN_MOMO_ENV") || "sandbox",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: input.amount,
      currency: secret("MTN_MOMO_CURRENCY") || "ZMW",
      externalId: input.reference,
      payer: { partyIdType: "MSISDN", partyId: input.msisdn },
      payerMessage: "My Event ticket",
      payeeNote: "My Event",
    }),
  });
  if (res.status !== 202 && !res.ok) throw new Error("MTN did not accept the payment request.");
  return { status: "pending" as const, message: "Approve the MTN MoMo prompt on your phone, then tap Check status." };
}

async function pushAirtel(input: { msisdn: string; amount: string; reference: string }) {
  const base = secret("AIRTEL_BASE_URL").replace(/\/$/, "");
  const tokenRes = await fetch(`${base}/auth/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: secret("AIRTEL_CLIENT_ID"),
      client_secret: secret("AIRTEL_CLIENT_SECRET"),
      grant_type: "client_credentials",
    }),
  });
  if (!tokenRes.ok) throw new Error("Airtel Money rejected the merchant login.");
  const token = (await tokenRes.json()) as { access_token?: string };
  if (!token.access_token) throw new Error("Airtel Money did not return an access token.");
  const res = await fetch(`${base}/merchant/v1/payments/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      "Content-Type": "application/json",
      "X-Country": secret("AIRTEL_COUNTRY") || "ZM",
      "X-Currency": "ZMW",
    },
    body: JSON.stringify({
      reference: input.reference,
      subscriber: { country: secret("AIRTEL_COUNTRY") || "ZM", currency: "ZMW", msisdn: input.msisdn },
      transaction: { amount: input.amount, country: secret("AIRTEL_COUNTRY") || "ZM", currency: "ZMW", id: input.reference },
    }),
  });
  if (!res.ok) throw new Error("Airtel Money did not accept the payment request.");
  return { status: "pending" as const, message: "Approve the Airtel Money prompt on your phone, then tap Check status." };
}

async function pushZamtel(input: { msisdn: string; amount: string; reference: string }) {
  const base = secret("ZAMTEL_BASE_URL").replace(/\/$/, "");
  const res = await fetch(base, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret("ZAMTEL_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      msisdn: input.msisdn,
      amount: input.amount,
      currency: "ZMW",
      reference: input.reference,
      narration: "My Event ticket",
    }),
  });
  if (!res.ok) throw new Error("Zamtel did not accept the payment request.");
  return { status: "pending" as const, message: "Approve the Zamtel prompt on your phone, then tap Check status." };
}

async function pushBtcpay(input: { amount: string; reference: string; eventTitle: string }) {
  const base = secret("BTCPAY_URL").replace(/\/$/, "");
  const storeId = secret("BTCPAY_STORE_ID");
  const res = await fetch(`${base}/api/v1/stores/${encodeURIComponent(storeId)}/invoices`, {
    method: "POST",
    headers: {
      Authorization: `token ${secret("BTCPAY_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: input.amount,
      currency: secret("BTCPAY_CURRENCY") || "USD",
      metadata: { orderId: input.reference, itemDesc: input.eventTitle },
      checkout: { speedPolicy: "MediumSpeed" },
    }),
  });
  if (!res.ok) throw new Error("BTCPay Server did not create an invoice.");
  const body = (await res.json()) as { id?: string; checkoutLink?: string };
  if (!body.id || !body.checkoutLink) throw new Error("BTCPay Server returned an invoice without a checkout link.");
  return {
    status: "pending" as const,
    reference: body.id,
    checkoutUrl: body.checkoutLink,
    message: "Finish payment on the BTCPay invoice, then come back and tap Check status.",
  };
}

async function readBtcpay(invoiceId: string): Promise<"paid" | "pending" | "failed"> {
  const base = secret("BTCPAY_URL").replace(/\/$/, "");
  const storeId = secret("BTCPAY_STORE_ID");
  const res = await fetch(`${base}/api/v1/stores/${encodeURIComponent(storeId)}/invoices/${encodeURIComponent(invoiceId)}`, {
    headers: { Authorization: `token ${secret("BTCPAY_API_KEY")}` },
  });
  if (!res.ok) return "pending";
  const body = (await res.json()) as { status?: string };
  if (body.status === "Settled") return "paid";
  if (body.status === "Invalid" || body.status === "Expired") return "failed";
  return "pending";
}

async function readWalletStatus(provider: string, reference: string): Promise<"paid" | "pending" | "failed"> {
  if (provider === "btcpay") return readBtcpay(reference);
  if (provider === "mtn") {
    const base = secret("MTN_MOMO_BASE_URL") || "https://sandbox.momodeveloper.mtn.com";
    const basic = Buffer.from(`${secret("MTN_MOMO_API_USER")}:${secret("MTN_MOMO_API_KEY")}`).toString("base64");
    const tokenRes = await fetch(`${base}/collection/token/`, {
      method: "POST",
      headers: { Authorization: `Basic ${basic}`, "Ocp-Apim-Subscription-Key": secret("MTN_MOMO_SUBSCRIPTION_KEY") },
    });
    if (!tokenRes.ok) return "pending";
    const token = (await tokenRes.json()) as { access_token?: string };
    const res = await fetch(`${base}/collection/v1_0/requesttopay/${reference}`, {
      headers: {
        Authorization: `Bearer ${token.access_token ?? ""}`,
        "Ocp-Apim-Subscription-Key": secret("MTN_MOMO_SUBSCRIPTION_KEY"),
        "X-Target-Environment": secret("MTN_MOMO_ENV") || "sandbox",
      },
    });
    if (!res.ok) return "pending";
    const body = (await res.json()) as { status?: string };
    if (body.status === "SUCCESSFUL") return "paid";
    if (body.status === "FAILED") return "failed";
    return "pending";
  }
  return "pending";
}

export const purchaseTicket = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { eventId: number; phone?: string; provider?: string }) => {
    const provider = input.provider === "airtel" || input.provider === "mtn" || input.provider === "zamtel" || input.provider === "btcpay" ? input.provider : "";
    return { eventId: Number(input.eventId), phone: String(input.phone ?? ""), provider };
  })
  .handler(async ({ context, data }) => {
    if (!Number.isFinite(data.eventId)) throw new Error("Pick an event.");
    const sql = await getSql();
    await ensureProfile(sql, context.userId, "");
    const events = await sql<{ price_cents: number; capacity: number; status: string; title: string }>`
      select price_cents, capacity, status, title from events where id = ${data.eventId}
    `;
    const event = events[0];
    if (!event || event.status !== "published") throw new Error("This event is not open.");
    const owned = await sql<{ n: number }>`
      select count(*)::int as n from tickets
      where user_id = ${context.userId} and event_id = ${data.eventId} and status = 'valid'
    `;
    if (num(owned[0]?.n) > 0) throw new Error("You already have a ticket.");
    const sold = await sql<{ n: number }>`
      select count(*)::int as n from tickets where event_id = ${data.eventId} and status = 'valid'
    `;
    if (num(sold[0]?.n) >= num(event.capacity)) throw new Error("This event is sold out.");
    if (num(event.price_cents) === 0) {
      const pay = await sql<{ id: number }>`
        insert into payments (user_id, event_id, amount_cents, status, last4, provider)
        values (${context.userId}, ${data.eventId}, 0, 'paid', '', 'free')
        returning id
      `;
      const code = ticketCode();
      await sql`
        insert into tickets (user_id, event_id, payment_id, code, status, amount_cents)
        values (${context.userId}, ${data.eventId}, ${num(pay[0]?.id)}, ${code}, 'valid', 0)
      `;
      return { status: "paid" as const, code, title: event.title };
    }

    const provider = data.provider;
    if (!provider) throw new Error("Choose a payment method.");
    const msisdn = provider === "btcpay" ? "" : normalizeZm(data.phone);
    const reference = crypto.randomUUID();
    const amount = (num(event.price_cents) / 100).toFixed(2);
    const pushed = await pushToWallet(provider as Wallet, { msisdn, amount, reference, eventTitle: event.title });
    const storedRef = pushed.reference || reference;
    const pay = await sql<{ id: number }>`
      insert into payments (user_id, event_id, amount_cents, status, last4, provider, msisdn, reference)
      values (
        ${context.userId}, ${data.eventId}, ${num(event.price_cents)}, ${pushed.status},
        ${msisdn.slice(-4)}, ${provider}, ${msisdn}, ${storedRef}
      )
      returning id
    `;
    if (pushed.status === "paid") {
      const code = ticketCode();
      await sql`
        insert into tickets (user_id, event_id, payment_id, code, status, amount_cents)
        values (${context.userId}, ${data.eventId}, ${num(pay[0]?.id)}, ${code}, 'valid', ${num(event.price_cents)})
      `;
      return { status: "paid" as const, code, title: event.title, paymentId: num(pay[0]?.id) };
    }
    return {
      status: "pending" as const,
      title: event.title,
      paymentId: num(pay[0]?.id),
      message: pushed.message,
      checkoutUrl: pushed.checkoutUrl,
    };
  });

export const refreshPayment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => Number(id))
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    const rows = await sql<{ status: string; provider: string; reference: string; event_id: number; amount_cents: number; title: string }>`
      select p.status, p.provider, p.reference, p.event_id, p.amount_cents, e.title
      from payments p join events e on e.id = p.event_id
      where p.id = ${id} and p.user_id = ${context.userId}
    `;
    const row = rows[0];
    if (!row) throw new Error("Payment not found.");
    if (row.status === "paid") return { status: "paid" as const, title: row.title };
    const next = await readWalletStatus(row.provider, row.reference);
    if (next === "paid") {
      await sql`update payments set status = 'paid' where id = ${id} and user_id = ${context.userId}`;
      const existing = await sql<{ code: string }>`select code from tickets where payment_id = ${id}`;
      if (!existing[0]) {
        const code = ticketCode();
        await sql`
          insert into tickets (user_id, event_id, payment_id, code, status, amount_cents)
          values (${context.userId}, ${row.event_id}, ${id}, ${code}, 'valid', ${num(row.amount_cents)})
        `;
      }
      return { status: "paid" as const, title: row.title };
    }
    if (next === "failed") {
      await sql`update payments set status = 'failed' where id = ${id} and user_id = ${context.userId}`;
      return { status: "failed" as const, title: row.title };
    }
    return { status: "pending" as const, title: row.title };
  });

const TONES = ["ember", "moss", "ink", "tide", "dusk", "clay"];

export const createEvent = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    title: string;
    description: string;
    startAt: string;
    endAt: string;
    location: string;
    categoryId: number;
    priceDollars: number;
    capacity: number;
  }) => ({
    title: String(input.title ?? "").trim().slice(0, 80),
    description: String(input.description ?? "").trim().slice(0, 600),
    startAt: String(input.startAt ?? ""),
    endAt: String(input.endAt ?? ""),
    location: String(input.location ?? "").trim().slice(0, 120),
    categoryId: Number(input.categoryId),
    priceDollars: Math.max(0, Math.round(Number(input.priceDollars) * 100) / 100),
    capacity: Math.max(1, Math.min(5000, Math.round(Number(input.capacity)))),
  }))
  .handler(async ({ context, data }) => {
    if (data.title.length < 3) throw new Error("Give the event a title.");
    if (!data.location) throw new Error("Add a place.");
    const start = new Date(data.startAt);
    const end = new Date(data.endAt);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      throw new Error("Check the start and end times.");
    }
    const sql = await getSql();
    await ensureProfile(sql, context.userId, "");
    const tone = TONES[Math.floor(Math.random() * TONES.length)];
    const rows = await sql<{ id: number }>`
      insert into events (title, description, start_at, end_at, location, category_id, organizer_id, tone, status, price_cents, capacity)
      values (
        ${data.title}, ${data.description}, ${start.toISOString()}, ${end.toISOString()},
        ${data.location}, ${data.categoryId}, ${context.userId}, ${tone}, 'published',
        ${Math.round(data.priceDollars * 100)}, ${data.capacity}
      )
      returning id
    `;
    return { id: num(rows[0]?.id) };
  });

async function requireAdmin(sql: Sql, userId: string) {
  const rows = await sql<{ role: string }>`select role from profiles where user_id = ${userId}`;
  if (rows[0]?.role !== "admin") throw new Error("Admin only.");
}

export const adminOverview = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    const events = await sql<{ n: number }>`select count(*)::int as n from events`;
    const people = await sql<{ n: number }>`select count(*)::int as n from profiles`;
    const tickets = await sql<{ n: number }>`select count(*)::int as n from tickets where status = 'valid'`;
    const revenue = await sql<{ n: number }>`
      select coalesce(sum(amount_cents), 0)::int as n from payments where status = 'paid'
    `;
    return {
      events: num(events[0]?.n),
      people: num(people[0]?.n),
      tickets: num(tickets[0]?.n),
      revenueCents: num(revenue[0]?.n),
    };
  });

export const adminPeople = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    const rows = await sql<{
      user_id: string;
      display_name: string;
      role: string;
      phone: string;
      email: string;
    }>`
      select p.user_id, p.display_name, p.role, p.phone, coalesce(u.email, '') as email
      from profiles p
      left join "user" u on u.id = p.user_id
      order by p.created_at desc
    `;
    return rows.map((r) => ({
      userId: r.user_id,
      displayName: r.display_name,
      role: r.role,
      phone: r.phone,
      email: r.email,
    }));
  });

export const setRole = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { userId: string; role: string }) => ({
    userId: String(input.userId ?? ""),
    role: input.role === "admin" || input.role === "organizer" ? input.role : "user",
  }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    if (data.userId === context.userId && data.role !== "admin") {
      throw new Error("Keep at least your own admin seat.");
    }
    await sql`update profiles set role = ${data.role} where user_id = ${data.userId}`;
    return { ok: true };
  });

export const setEventStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { eventId: number; status: string }) => ({
    eventId: Number(input.eventId),
    status: input.status === "cancelled" || input.status === "draft" ? input.status : "published",
  }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    await sql`update events set status = ${data.status} where id = ${data.eventId}`;
    return { ok: true };
  });

export const adminPayments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    const rows = await sql<{
      id: number;
      amount_cents: number;
      status: string;
      last4: string;
      title: string;
      created_at: unknown;
      email: string;
    }>`
      select p.id, p.amount_cents, p.status, p.last4, e.title, p.created_at, coalesce(u.email, '') as email
      from payments p
      join events e on e.id = p.event_id
      left join "user" u on u.id = p.user_id
      order by p.created_at desc
      limit 40
    `;
    return rows.map((r) => ({
      id: num(r.id),
      amountCents: num(r.amount_cents),
      status: r.status,
      last4: r.last4,
      title: r.title,
      createdAt: stamp(r.created_at),
      email: r.email,
    }));
  });

export const refundPayment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => Number(id))
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    await sql`update payments set status = 'refunded' where id = ${id}`;
    await sql`update tickets set status = 'refunded' where payment_id = ${id}`;
    return { ok: true };
  });
