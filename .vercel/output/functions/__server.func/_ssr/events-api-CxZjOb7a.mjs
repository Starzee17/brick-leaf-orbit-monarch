import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-mhxlilwP.mjs";
import { t as authMiddleware } from "./middleware-C7HIzWoI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/events-api-CxZjOb7a.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function stamp(value) {
	if (value instanceof Date) return value.toISOString();
	return String(value ?? "");
}
function num(value) {
	return typeof value === "number" ? value : Number(value ?? 0);
}
async function ensureProfile(sql, userId, fallbackName) {
	await sql`
    insert into profiles (user_id, display_name)
    values (${userId}, ${fallbackName})
    on conflict (user_id) do nothing
  `;
	if (num((await sql`select count(*)::int as n from profiles where role = 'admin'`)[0]?.n) === 0) await sql`update profiles set role = 'admin' where user_id = ${userId}`;
}
var EVENT_SELECT = `
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
function mapEvent(r) {
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
		sold: num(r.sold)
	};
}
var listEvents_createServerFn_handler = createServerRpc({
	id: "2084b7008c9ec58b4eb469711a729a42dd1d37e4446be5c87a86883808f84eeb",
	name: "listEvents",
	filename: "src/lib/events-api.ts"
}, (opts) => listEvents.__executeServer(opts));
var listEvents = createServerFn({ method: "GET" }).handler(listEvents_createServerFn_handler, async () => {
	return (await (await getSql()).query(`${EVENT_SELECT} order by e.start_at asc`)).map(mapEvent);
});
var listCategories_createServerFn_handler = createServerRpc({
	id: "32fe69355c2ea602a488d2aa3cce6b089cf0dc663a8ee9941e8b50a20b9c70f3",
	name: "listCategories",
	filename: "src/lib/events-api.ts"
}, (opts) => listCategories.__executeServer(opts));
var listCategories = createServerFn({ method: "GET" }).handler(listCategories_createServerFn_handler, async () => {
	return (await (await getSql())`select id, name from categories order by name`).map((r) => ({
		id: num(r.id),
		name: r.name
	}));
});
var getEvent_createServerFn_handler = createServerRpc({
	id: "4d2b45aff15a88d51be79b7fc4bedc54b775eacb5c97104b1c60aef383df0b31",
	name: "getEvent",
	filename: "src/lib/events-api.ts"
}, (opts) => getEvent.__executeServer(opts));
var getEvent = createServerFn({ method: "GET" }).validator((id) => Number(id)).handler(getEvent_createServerFn_handler, async ({ data: id }) => {
	const rows = await (await getSql()).query(`${EVENT_SELECT} where e.id = $1`, [id]);
	return rows[0] ? mapEvent(rows[0]) : null;
});
var getMe_createServerFn_handler = createServerRpc({
	id: "053fce5c75fc7a9a032a23b5dbe89661f603532d7a6a4e7455f322a7564ab395",
	name: "getMe",
	filename: "src/lib/events-api.ts"
}, (opts) => getMe.__executeServer(opts));
var getMe = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMe_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const session = await sql`
      select email, name from "user" where id = ${context.userId}
    `;
	const email = session[0]?.email ?? "";
	const name = session[0]?.name ?? "";
	await ensureProfile(sql, context.userId, name);
	const row = (await sql`select user_id, display_name, phone, bio, role from profiles where user_id = ${context.userId}`)[0];
	return {
		userId: context.userId,
		displayName: row?.display_name || name,
		phone: row?.phone ?? "",
		bio: row?.bio ?? "",
		role: row?.role ?? "user",
		email
	};
});
var saveProfile_createServerFn_handler = createServerRpc({
	id: "b346cfaeaa570ac4091c7ffc0de3a8fb79707f1e470fbb97908d9aa8b2d012cb",
	name: "saveProfile",
	filename: "src/lib/events-api.ts"
}, (opts) => saveProfile.__executeServer(opts));
var saveProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	displayName: String(input.displayName ?? "").trim().slice(0, 80),
	phone: String(input.phone ?? "").trim().slice(0, 32),
	bio: String(input.bio ?? "").trim().slice(0, 280)
})).handler(saveProfile_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureProfile(sql, context.userId, data.displayName);
	await sql`
      update profiles
      set display_name = ${data.displayName}, phone = ${data.phone}, bio = ${data.bio}
      where user_id = ${context.userId}
    `;
	return { ok: true };
});
var myTickets_createServerFn_handler = createServerRpc({
	id: "8e94c339119602ecd51a5e0f44e52c4d3cca748d8e65277b1173c16e147a315f",
	name: "myTickets",
	filename: "src/lib/events-api.ts"
}, (opts) => myTickets.__executeServer(opts));
var myTickets = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(myTickets_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select t.id, t.code, t.status, t.amount_cents, e.title, e.start_at, e.location, e.id as event_id, e.tone
      from tickets t
      join events e on e.id = t.event_id
      where t.user_id = ${context.userId}
      order by e.start_at asc
    `).map((r) => ({
		id: num(r.id),
		code: r.code,
		status: r.status,
		amountCents: num(r.amount_cents),
		title: r.title,
		startAt: stamp(r.start_at),
		location: r.location,
		eventId: num(r.event_id),
		tone: r.tone
	}));
});
var myPayments_createServerFn_handler = createServerRpc({
	id: "7a2e7fc024959af8b7658ddfd6eee264d2982b261d74c5993ffd02fdc6e23c8a",
	name: "myPayments",
	filename: "src/lib/events-api.ts"
}, (opts) => myPayments.__executeServer(opts));
var myPayments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(myPayments_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select p.id, p.amount_cents, p.status, p.last4, e.title, p.created_at, p.event_id
      from payments p
      join events e on e.id = p.event_id
      where p.user_id = ${context.userId}
      order by p.created_at desc
    `).map((r) => ({
		id: num(r.id),
		amountCents: num(r.amount_cents),
		status: r.status,
		last4: r.last4,
		title: r.title,
		createdAt: stamp(r.created_at),
		eventId: num(r.event_id)
	}));
});
function ticketCode() {
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	let out = "ME-";
	for (let i = 0; i < 8; i++) out += alphabet[Math.floor(Math.random() * 32)];
	return out;
}
var purchaseTicket_createServerFn_handler = createServerRpc({
	id: "cf7fb82f421bbc4d9edef7ecd80c34df812e973d73352b099b45e73744332e1e",
	name: "purchaseTicket",
	filename: "src/lib/events-api.ts"
}, (opts) => purchaseTicket.__executeServer(opts));
var purchaseTicket = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	eventId: Number(input.eventId),
	last4: String(input.last4 ?? "").replace(/\D/g, "").slice(-4)
})).handler(purchaseTicket_createServerFn_handler, async ({ context, data }) => {
	if (!Number.isFinite(data.eventId)) throw new Error("Pick an event.");
	const sql = await getSql();
	await ensureProfile(sql, context.userId, "");
	const event = (await sql`
      select price_cents, capacity, status, title from events where id = ${data.eventId}
    `)[0];
	if (!event || event.status !== "published") throw new Error("This event is not open.");
	if (num((await sql`
      select count(*)::int as n from tickets
      where user_id = ${context.userId} and event_id = ${data.eventId} and status = 'valid'
    `)[0]?.n) > 0) throw new Error("You already have a ticket.");
	if (num((await sql`
      select count(*)::int as n from tickets where event_id = ${data.eventId} and status = 'valid'
    `)[0]?.n) >= num(event.capacity)) throw new Error("This event is sold out.");
	if (num(event.price_cents) > 0 && data.last4.length !== 4) throw new Error("Enter a card so we can take the last four digits.");
	const pay = await sql`
      insert into payments (user_id, event_id, amount_cents, status, last4)
      values (${context.userId}, ${data.eventId}, ${num(event.price_cents)}, 'paid', ${data.last4})
      returning id
    `;
	const code = ticketCode();
	return {
		code: (await sql`
      insert into tickets (user_id, event_id, payment_id, code, status, amount_cents)
      values (${context.userId}, ${data.eventId}, ${num(pay[0]?.id)}, ${code}, 'valid', ${num(event.price_cents)})
      returning id, code
    `)[0]?.code ?? code,
		title: event.title
	};
});
var TONES = [
	"ember",
	"moss",
	"ink",
	"tide",
	"dusk",
	"clay"
];
var createEvent_createServerFn_handler = createServerRpc({
	id: "1028514e52a73e2e2cb6ab7c4aec08581242e1a9ccba0ecc9e8eaa3bd60e837d",
	name: "createEvent",
	filename: "src/lib/events-api.ts"
}, (opts) => createEvent.__executeServer(opts));
var createEvent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	title: String(input.title ?? "").trim().slice(0, 80),
	description: String(input.description ?? "").trim().slice(0, 600),
	startAt: String(input.startAt ?? ""),
	endAt: String(input.endAt ?? ""),
	location: String(input.location ?? "").trim().slice(0, 120),
	categoryId: Number(input.categoryId),
	priceDollars: Math.max(0, Math.round(Number(input.priceDollars) * 100) / 100),
	capacity: Math.max(1, Math.min(5e3, Math.round(Number(input.capacity))))
})).handler(createEvent_createServerFn_handler, async ({ context, data }) => {
	if (data.title.length < 3) throw new Error("Give the event a title.");
	if (!data.location) throw new Error("Add a place.");
	const start = new Date(data.startAt);
	const end = new Date(data.endAt);
	if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) throw new Error("Check the start and end times.");
	const sql = await getSql();
	await ensureProfile(sql, context.userId, "");
	const tone = TONES[Math.floor(Math.random() * TONES.length)];
	return { id: num((await sql`
      insert into events (title, description, start_at, end_at, location, category_id, organizer_id, tone, status, price_cents, capacity)
      values (
        ${data.title}, ${data.description}, ${start.toISOString()}, ${end.toISOString()},
        ${data.location}, ${data.categoryId}, ${context.userId}, ${tone}, 'published',
        ${Math.round(data.priceDollars * 100)}, ${data.capacity}
      )
      returning id
    `)[0]?.id) };
});
async function requireAdmin(sql, userId) {
	if ((await sql`select role from profiles where user_id = ${userId}`)[0]?.role !== "admin") throw new Error("Admin only.");
}
var adminOverview_createServerFn_handler = createServerRpc({
	id: "ae14965737adb62e61972fee86726a7fd180b79541b32eb0cb9176df5417dcfd",
	name: "adminOverview",
	filename: "src/lib/events-api.ts"
}, (opts) => adminOverview.__executeServer(opts));
var adminOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminOverview_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	const events = await sql`select count(*)::int as n from events`;
	const people = await sql`select count(*)::int as n from profiles`;
	const tickets = await sql`select count(*)::int as n from tickets where status = 'valid'`;
	const revenue = await sql`
      select coalesce(sum(amount_cents), 0)::int as n from payments where status = 'paid'
    `;
	return {
		events: num(events[0]?.n),
		people: num(people[0]?.n),
		tickets: num(tickets[0]?.n),
		revenueCents: num(revenue[0]?.n)
	};
});
var adminPeople_createServerFn_handler = createServerRpc({
	id: "441c29d3b56bbcbdc49beab3b4e1ee5c2a07f0e8fb615b6d186fe77cbb7dfe90",
	name: "adminPeople",
	filename: "src/lib/events-api.ts"
}, (opts) => adminPeople.__executeServer(opts));
var adminPeople = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminPeople_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	return (await sql`
      select p.user_id, p.display_name, p.role, p.phone, coalesce(u.email, '') as email
      from profiles p
      left join "user" u on u.id = p.user_id
      order by p.created_at desc
    `).map((r) => ({
		userId: r.user_id,
		displayName: r.display_name,
		role: r.role,
		phone: r.phone,
		email: r.email
	}));
});
var setRole_createServerFn_handler = createServerRpc({
	id: "b9e4f18e75b456c21170f8e6700287caef7aff03d46c03e7b203f77680c83065",
	name: "setRole",
	filename: "src/lib/events-api.ts"
}, (opts) => setRole.__executeServer(opts));
var setRole = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	userId: String(input.userId ?? ""),
	role: input.role === "admin" || input.role === "organizer" ? input.role : "user"
})).handler(setRole_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	if (data.userId === context.userId && data.role !== "admin") throw new Error("Keep at least your own admin seat.");
	await sql`update profiles set role = ${data.role} where user_id = ${data.userId}`;
	return { ok: true };
});
var setEventStatus_createServerFn_handler = createServerRpc({
	id: "006fd7345f8f369e529824d078fd0811648c00d8de92ea6c1fde688e6b268b42",
	name: "setEventStatus",
	filename: "src/lib/events-api.ts"
}, (opts) => setEventStatus.__executeServer(opts));
var setEventStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	eventId: Number(input.eventId),
	status: input.status === "cancelled" || input.status === "draft" ? input.status : "published"
})).handler(setEventStatus_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	await sql`update events set status = ${data.status} where id = ${data.eventId}`;
	return { ok: true };
});
var adminPayments_createServerFn_handler = createServerRpc({
	id: "54d1c09ff6ba2d8955c0575e2730936549f9c3f726b0fe37259880ea366fcfcc",
	name: "adminPayments",
	filename: "src/lib/events-api.ts"
}, (opts) => adminPayments.__executeServer(opts));
var adminPayments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminPayments_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	return (await sql`
      select p.id, p.amount_cents, p.status, p.last4, e.title, p.created_at, coalesce(u.email, '') as email
      from payments p
      join events e on e.id = p.event_id
      left join "user" u on u.id = p.user_id
      order by p.created_at desc
      limit 40
    `).map((r) => ({
		id: num(r.id),
		amountCents: num(r.amount_cents),
		status: r.status,
		last4: r.last4,
		title: r.title,
		createdAt: stamp(r.created_at),
		email: r.email
	}));
});
var refundPayment_createServerFn_handler = createServerRpc({
	id: "1863a95af6604c0bcb2935504b45d2bcf4f557d937f44a2465164137a7e18354",
	name: "refundPayment",
	filename: "src/lib/events-api.ts"
}, (opts) => refundPayment.__executeServer(opts));
var refundPayment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => Number(id)).handler(refundPayment_createServerFn_handler, async ({ context, data: id }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	await sql`update payments set status = 'refunded' where id = ${id}`;
	await sql`update tickets set status = 'refunded' where payment_id = ${id}`;
	return { ok: true };
});
//#endregion
export { adminOverview_createServerFn_handler, adminPayments_createServerFn_handler, adminPeople_createServerFn_handler, createEvent_createServerFn_handler, getEvent_createServerFn_handler, getMe_createServerFn_handler, listCategories_createServerFn_handler, listEvents_createServerFn_handler, myPayments_createServerFn_handler, myTickets_createServerFn_handler, purchaseTicket_createServerFn_handler, refundPayment_createServerFn_handler, saveProfile_createServerFn_handler, setEventStatus_createServerFn_handler, setRole_createServerFn_handler };
