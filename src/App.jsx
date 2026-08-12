import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  ShoppingBag, Search, Star, Package, Users, TrendingUp, LogOut, Plus, Pencil, Trash2, X, Check,
  ChevronRight, LayoutDashboard, ClipboardList, BarChart3, Shield, Truck, Tag, MessageSquare,
  Minus, ArrowLeft, CreditCard, Wallet, MapPin, Download, RotateCcw, Eye, EyeOff, Menu, Filter,
  Printer, Mail, CheckCircle2, AlertTriangle, Settings, UserCog, Camera, ScanLine, Fingerprint,
  Smartphone, Send, ShieldCheck, Ban, ArchiveRestore, Globe, QrCode, Server, Sparkles, Bot, Loader2,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid,
} from "recharts";

/* ============================================================================
   DESIGN TOKENS
   Primary (bronze):  #8A5A1F      Gold accent:      #C9A227
   Deep ink:           #2B2013      Cream surface:    #FAF6EC
   Card surface:       #FFFFFF      Hairline:         #E3D8BD
   Success:            #2F7A4F      Danger:           #B23B3B      Info: #3B5A8A
============================================================================ */
const T = {
  primary: "#8A5A1F",
  primaryDark: "#5E3E15",
  gold: "#C9A227",
  ink: "#2B2013",
  sub: "#7A6B52",
  cream: "#FAF6EC",
  surface: "#FFFFFF",
  hair: "#E7DBB8",
  success: "#2F7A4F",
  danger: "#B23B3B",
  info: "#3B5A8A",
};

const FONT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
  .ss-root { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; color:${T.ink}; }
  .ss-display { font-family: 'Fraunces', Georgia, serif; }
  .ss-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
  .ss-scroll::-webkit-scrollbar{ width:8px; height:8px; }
  .ss-scroll::-webkit-scrollbar-thumb{ background:${T.hair}; border-radius:8px; }
  .ss-receipt-edge{ position:relative; }
  .ss-receipt-edge::before{
    content:""; position:absolute; left:0; right:0; top:-1px; height:10px;
    background-image: radial-gradient(circle at 8px 0, transparent 7px, ${T.cream} 7.5px);
    background-size: 16px 10px; background-repeat: repeat-x; transform: translateY(-100%);
  }
  .ss-btn{ transition: transform .12s ease, box-shadow .12s ease, background-color .12s ease; }
  .ss-btn:active{ transform: translateY(1px) scale(0.99); }
  .ss-card{ transition: box-shadow .15s ease, transform .15s ease; }
  .ss-card:hover{ box-shadow: 0 10px 24px -12px rgba(43,32,19,0.28); transform: translateY(-2px); }
  .ss-fade-in{ animation: ssFadeIn .25s ease both; }
  .ss-spin{ animation: ssSpin .8s linear infinite; }
  @keyframes ssSpin{ from{ transform: rotate(0deg);} to{ transform: rotate(360deg);} }
  @keyframes ssFadeIn{ from{ opacity:0; transform: translateY(6px);} to{opacity:1; transform:translateY(0);} }
  .ss-slide-in{ animation: ssSlideIn .28s cubic-bezier(.2,.8,.2,1) both; }
  @keyframes ssSlideIn{ from{ transform: translateX(100%);} to{ transform: translateX(0);} }
  input[type=text]:focus, input[type=email]:focus, input[type=password]:focus, input[type=number]:focus, textarea:focus, select:focus{
    outline:none; box-shadow: 0 0 0 3px rgba(201,162,39,0.35); border-color:${T.primary} !important;
  }
  .ss-seal{
    background: radial-gradient(circle at 32% 28%, ${T.gold}, ${T.primary} 65%);
    box-shadow: inset 0 -3px 6px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.25);
  }
`;

/* ============================================================================
   SEED DATA
============================================================================ */
const CATEGORIES = ["All", "Electronics", "Apparel", "Furniture", "Stationery"];

const seedProducts = () => ([
  { id: 1, name: "Wireless Mouse", category: "Electronics", price: 45000, stock: 120, sku: "SKU-1042", rating: 4.6, reviews: 132, desc: "Ergonomic 2.4GHz wireless mouse with silent clicks and a 12-month battery life." },
  { id: 2, name: "Portable Bluetooth Speaker 20W", category: "Electronics", price: 120000, stock: 54, sku: "SKU-1090", rating: 4.6, reviews: 132, desc: "Water-resistant portable speaker with 20W output, 12-hour battery, and Bluetooth 5.2." },
  { id: 3, name: "Ergonomic Office Chair", category: "Furniture", price: 280000, stock: 8, sku: "SKU-2071", rating: 4.2, reviews: 46, desc: "Adjustable lumbar-support chair with breathable mesh back and padded armrests." },
  { id: 4, name: "Cotton T-Shirt (M)", category: "Apparel", price: 35000, stock: 0, sku: "SKU-3312", rating: 3.9, reviews: 21, desc: "100% combed cotton crew-neck tee, pre-shrunk, available in five colours." },
  { id: 5, name: "Notebook A5 (Dotted)", category: "Stationery", price: 6000, stock: 310, sku: "SKU-4501", rating: 4.8, reviews: 88, desc: "160-page dotted-grid notebook with a hardback cover and ribbon bookmark." },
  { id: 6, name: "Mechanical Keyboard (Brown Switch)", category: "Electronics", price: 165000, stock: 27, sku: "SKU-1105", rating: 4.7, reviews: 64, desc: "Hot-swappable mechanical keyboard with per-key RGB and a solid aluminium frame." },
  { id: 7, name: "Study Desk Lamp", category: "Furniture", price: 52000, stock: 40, sku: "SKU-2140", rating: 4.4, reviews: 33, desc: "Dimmable LED desk lamp with three colour-temperature modes and USB charging port." },
  { id: 8, name: "Canvas Tote Bag", category: "Apparel", price: 28000, stock: 76, sku: "SKU-3390", rating: 4.5, reviews: 58, desc: "Heavy-duty 12oz canvas tote with reinforced stitching, fits a 15-inch laptop." },
  { id: 9, name: "Sticky Notes Pack (6-Colour)", category: "Stationery", price: 9000, stock: 200, sku: "SKU-4520", rating: 4.3, reviews: 19, desc: "6 pads of 100 sticky notes each, ideal for planning boards and study notes." },
  { id: 10, name: "Noise-Cancelling Headphones", category: "Electronics", price: 310000, stock: 15, sku: "SKU-1150", rating: 4.8, reviews: 210, desc: "Over-ear ANC headphones with 30-hour battery life and plush memory-foam pads." },
]);

const seedCoupons = () => ([
  { code: "WELCOME10", type: "percent", value: 10, expiry: "2026-12-31", used: 214, status: "active" },
  { code: "FREESHIP", type: "fixed", value: 8000, expiry: "2026-09-30", used: 58, status: "active" },
  { code: "EID2026", type: "percent", value: 15, expiry: "2026-06-20", used: 340, status: "expired" },
]);

const seedOrders = () => ([
  { id: "ORD-20260716-001", customer: "Grace Nabirye", email: "grace@example.com", total: 272438, status: "processing", payment: "PayPal", date: "2026-07-16", items: [{ name: "Wireless Mouse", qty: 2, price: 45000 }, { name: "Notebook A5 (Dotted)", qty: 3, price: 6000 }] },
  { id: "ORD-20260716-002", customer: "Peter Okello", email: "peter@example.com", total: 89000, status: "shipped", payment: "Card", date: "2026-07-16", items: [{ name: "Sticky Notes Pack (6-Colour)", qty: 1, price: 9000 }] },
  { id: "ORD-20260715-013", customer: "Sarah Kintu", email: "sarah@example.com", total: 512000, status: "delivered", payment: "PayPal", date: "2026-07-15", items: [{ name: "Noise-Cancelling Headphones", qty: 1, price: 310000 }] },
  { id: "ORD-20260714-009", customer: "Moses Aliga", email: "moses@example.com", total: 24000, status: "cancelled", payment: "Card", date: "2026-07-14", items: [{ name: "Canvas Tote Bag", qty: 1, price: 28000 }] },
]);

const seedStaff = () => ([
  { id: 1, name: "Abubakar Tijjani", role: "Super Sys Admin", email: "admin@shopsphere.test", status: "Active", joined: "10 Jun 2026" },
  { id: 2, name: "Halima Bello", role: "Store Manager", email: "halima@shopsphere.test", status: "Active", joined: "12 Jun 2026" },
  { id: 3, name: "John Okoro", role: "Inventory Manager", email: "john@shopsphere.test", status: "Active", joined: "14 Jun 2026" },
  { id: 4, name: "Grace S.", role: "Sales / Cashier", email: "grace.s@shopsphere.test", status: "Active", joined: "18 Jun 2026" },
  { id: 5, name: "Peter Kato", role: "Delivery Officer", email: "peter@shopsphere.test", status: "Inactive", joined: "20 Jun 2026" },
]);

const ROLES = [
  { name: "Super Sys Admin", perms: ["Dashboard", "Products", "Orders", "Payments", "Shipments", "Coupons", "Reports", "Roles", "Settings"], members: 1 },
  { name: "Sys Admin", perms: ["Dashboard", "Products", "Orders", "Reports", "Settings"], members: 1 },
  { name: "Store Manager", perms: ["Dashboard", "Products", "Orders", "Shipments", "Coupons", "Reports"], members: 1 },
  { name: "Inventory Manager", perms: ["Dashboard", "Products"], members: 1 },
  { name: "Receptionist", perms: ["Dashboard", "Orders"], members: 0 },
  { name: "Sales / Cashier", perms: ["Dashboard", "Orders", "Payments"], members: 1 },
  { name: "Delivery Officer", perms: ["Dashboard", "Shipments"], members: 1 },
  { name: "Accountant", perms: ["Dashboard", "Reports", "Payments"], members: 0 },
];
const ROLE_NAMES = ROLES.map((r) => r.name);

const seedChats = () => ([
  { id: 1, customer: "Grace Nabirye", lastSeen: "2 min ago", unread: 1, messages: [
      { from: "customer", text: "Hi, is the Bluetooth Speaker still in stock?", time: "10:02 AM" },
      { from: "staff", text: "Yes! We have 54 units available.", time: "10:04 AM" },
      { from: "customer", text: "Great, thank you!", time: "10:05 AM" },
    ] },
  { id: 2, customer: "Peter Okello", lastSeen: "1 hr ago", unread: 0, messages: [
      { from: "customer", text: "Can I change my delivery address for ORD-20260716-002?", time: "9:10 AM" },
      { from: "staff", text: "Sure, please share the new address and we'll update it.", time: "9:15 AM" },
    ] },
  { id: 3, customer: "Sarah Kintu", lastSeen: "Yesterday", unread: 0, messages: [
      { from: "customer", text: "The headphones arrived, thank you for the fast delivery!", time: "Yesterday" },
    ] },
]);

const seedHardware = () => ([
  { id: "camera", name: "Product Photo Camera", icon: "Camera", desc: "Captures product images directly into the catalogue form.", connected: true },
  { id: "barcode", name: "Barcode Scanner", icon: "ScanLine", desc: "USB/Bluetooth scanner for SKU lookup at checkout and stock intake.", connected: true },
  { id: "qr", name: "QR Code Reader", icon: "QrCode", desc: "Scans QR receipts and shipment labels for quick order lookup.", connected: false },
  { id: "fingerprint", name: "Fingerprint Reader", icon: "Fingerprint", desc: "Biometric staff clock-in and secure till access.", connected: false },
]);


const REVENUE_TREND = [
  { m: "Feb", v: 3.2 }, { m: "Mar", v: 4.1 }, { m: "Apr", v: 3.8 }, { m: "May", v: 5.0 },
  { m: "Jun", v: 6.2 }, { m: "Jul", v: 8.4 },
];
const STATUS_SPLIT = [
  { name: "Delivered", value: 45, color: T.success },
  { name: "Shipped", value: 25, color: T.info },
  { name: "Processing", value: 20, color: T.gold },
  { name: "Cancelled", value: 10, color: T.danger },
];

const money = (n) => "UGX " + Math.round(n).toLocaleString("en-UG");
const fmtId = (n) => "SPH-" + String(n).padStart(4, "0");

/* ============================================================================
   AI HELPER — real calls to Claude via the Anthropic Messages API.
   No API key is needed here; the platform handles auth for artifacts.
============================================================================ */
async function askAI(messages, { maxTokens = 700, system } = {}) {
  // FREE LOCAL OPTION: Google Gemini has a genuine no-card free tier.
  // If a Gemini key is present (set via window.__GEMINI_API_KEY__ — see setup notes),
  // use it. Otherwise fall back to the keyless Claude call, which is free automatically
  // when this file runs inside the Claude.ai chat/artifact preview.
 const geminiKey = import.meta.env.VITE_GEMINI_API_KEY || null;

  if (geminiKey) {
    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
    const body = { contents, generationConfig: { maxOutputTokens: maxTokens } };
    if (system) body.systemInstruction = { parts: [{ text: system }] };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiKey}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
    );
    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      throw new Error(`AI request failed (${response.status}). ${errText.slice(0, 140)}`);
    }
    const data = await response.json();
    const text = (data?.candidates?.[0]?.content?.parts || [])
      .map((p) => p.text || "")
      .join("\n")
      .trim();
    if (!text) throw new Error("AI returned an empty response.");
    return text;
  }

  // Default path: works free, automatically, inside the Claude.ai chat preview.
  const body = { model: "claude-sonnet-4-6", max_tokens: maxTokens, messages };
  if (system) body.system = system;
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(
      `AI request failed (${response.status}). Outside this chat preview, set up a free Gemini key ` +
      `(see setup notes) so window.__GEMINI_API_KEY__ is available.`
    );
  }
  const data = await response.json();
  const text = (data.content || [])
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();
  if (!text) throw new Error("AI returned an empty response.");
  return text;
}

function businessSnapshot(products, orders, coupons) {
  const active = products.filter((p) => !p.deleted);
  const lowStock = active.filter((p) => p.stock > 0 && p.stock <= 10);
  const outOfStock = active.filter((p) => p.stock === 0);
  const revenue = orders.filter((o) => o.status !== "cancelled" && o.status !== "voided").reduce((s, o) => s + o.total, 0);
  const byStatus = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {});
  return [
    `Total active products: ${active.length}`,
    `Low stock (<=10): ${lowStock.map((p) => `${p.name} (${p.stock})`).join(", ") || "none"}`,
    `Out of stock: ${outOfStock.map((p) => p.name).join(", ") || "none"}`,
    `Total orders: ${orders.length}, breakdown by status: ${JSON.stringify(byStatus)}`,
    `Total revenue (excluding cancelled/voided): ${money(revenue)}`,
    `Active coupons: ${coupons.filter((c) => c.status === "active").map((c) => c.code).join(", ") || "none"}`,
    `Recent orders: ${orders.slice(0, 5).map((o) => `${o.id} - ${o.customer} - ${money(o.total)} - ${o.status}`).join(" | ")}`,
  ].join("\n");
}

/* ============================================================================
   SMALL UI PRIMITIVES
============================================================================ */
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="ss-fade-in" style={{
      position: "fixed", top: 18, right: 18, zIndex: 200, background: T.ink, color: "#fff",
      padding: "12px 18px", borderRadius: 10, display: "flex", alignItems: "center", gap: 10,
      boxShadow: "0 10px 30px rgba(0,0,0,0.25)", fontSize: 14, maxWidth: 320,
    }}>
      <CheckCircle2 size={18} color={T.gold} />
      <span>{toast}</span>
    </div>
  );
}

function Badge({ children, tone = "neutral" }) {
  const tones = {
    success: { bg: "#E7F3EC", fg: T.success },
    danger: { bg: "#FBEAEA", fg: T.danger },
    warn: { bg: "#FCF3D9", fg: "#8A6D00" },
    info: { bg: "#E9EEF7", fg: T.info },
    neutral: { bg: "#F1EBD9", fg: T.sub },
  };
  const c = tones[tone] || tones.neutral;
  return (
    <span style={{
      background: c.bg, color: c.fg, fontSize: 11.5, fontWeight: 700, padding: "3px 10px",
      borderRadius: 999, letterSpacing: 0.2, whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

const orderStatusTone = { pending: "warn", processing: "info", shipped: "info", delivered: "success", cancelled: "danger", voided: "danger" };

function Btn({ children, onClick, variant = "primary", size = "md", icon: Icon, style, type = "button", disabled }) {
  const sizes = { sm: "6px 12px", md: "10px 18px", lg: "13px 24px" };
  const fontSizes = { sm: 12.5, md: 14, lg: 15.5 };
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    borderRadius: 9, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
    padding: sizes[size], fontSize: fontSizes[size], border: "1px solid transparent",
    opacity: disabled ? 0.55 : 1, ...style,
  };
  const variants = {
    primary: { background: T.primary, color: "#fff" },
    gold: { background: T.gold, color: T.ink },
    outline: { background: "transparent", color: T.primary, borderColor: T.primary },
    ghost: { background: "transparent", color: T.ink },
    danger: { background: "transparent", color: T.danger, borderColor: "#EBC9C9" },
    subtle: { background: T.cream, color: T.ink, borderColor: T.hair },
  };
  return (
    <button type={type} disabled={disabled} className="ss-btn" onClick={onClick} style={{ ...base, ...variants[variant] }}>
      {Icon && <Icon size={size === "lg" ? 18 : 15} />}
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <span style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: T.sub, marginBottom: 6 }}>{label}</span>
      {children}
    </label>
  );
}
const inputStyle = {
  width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${T.hair}`,
  fontSize: 14, background: "#fff", color: T.ink, boxSizing: "border-box",
};

function Modal({ title, onClose, children, width = 480 }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(43,32,19,0.45)", zIndex: 150, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div className="ss-fade-in ss-scroll" style={{ background: "#fff", borderRadius: 14, width, maxWidth: "100%", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 30px 60px rgba(0,0,0,0.3)" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: `1px solid ${T.hair}` }}>
          <h3 className="ss-display" style={{ margin: 0, fontSize: 19, fontWeight: 600 }}>{title}</h3>
          <button onClick={onClose} style={{ background: T.cream, border: "none", borderRadius: 8, padding: 6, cursor: "pointer" }}><X size={16} /></button>
        </div>
        <div style={{ padding: 22 }}>{children}</div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, tone = T.primary, Icon }) {
  return (
    <div className="ss-card" style={{ background: "#fff", border: `1px solid ${T.hair}`, borderRadius: 14, padding: 18, flex: 1, minWidth: 150 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: `${tone}1A`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={17} color={tone} />
        </div>
        {sub && <span style={{ fontSize: 11.5, fontWeight: 700, color: tone }}>{sub}</span>}
      </div>
      <div className="ss-display" style={{ fontSize: 22, fontWeight: 700, color: T.ink }}>{value}</div>
      <div style={{ fontSize: 12.5, color: T.sub, marginTop: 2 }}>{label}</div>
    </div>
  );
}

/* ============================================================================
   PRODUCT VISUAL (stylised placeholder, no external image dependency)
============================================================================ */
function ProductArt({ product, height = 150 }) {
  const hues = {
    Electronics: ["#C9A227", "#8A5A1F"],
    Furniture: ["#B98B3E", "#6B4A1E"],
    Apparel: ["#A6784B", "#7A5230"],
    Stationery: ["#D8B65C", "#8A5A1F"],
  };
  const [c1, c2] = hues[product.category] || [T.gold, T.primary];
  return (
    <div style={{
      height, borderRadius: 10, background: `linear-gradient(135deg, ${c1}33, ${c2}22)`,
      display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden",
    }}>
      <div className="ss-seal" style={{ width: 54, height: 54, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Package size={24} color="#fff" />
      </div>
      {product.stock === 0 && (
        <div style={{ position: "absolute", top: 8, left: 8 }}><Badge tone="danger">Out of stock</Badge></div>
      )}
      {product.stock > 0 && product.stock <= 10 && (
        <div style={{ position: "absolute", top: 8, left: 8 }}><Badge tone="warn">Low stock</Badge></div>
      )}
    </div>
  );
}

/* ============================================================================
   STOREFRONT
============================================================================ */
function Stars({ rating, size = 12 }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} fill={i <= Math.round(rating) ? T.gold : "none"} color={T.gold} />
      ))}
    </span>
  );
}

function StoreHeader({ cartCount, onCartClick, onAdminClick, search, setSearch }) {
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(250,246,236,0.92)", backdropFilter: "blur(6px)", borderBottom: `1px solid ${T.hair}` }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="ss-seal" style={{ width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShoppingBag size={16} color="#fff" />
          </div>
          <span className="ss-display" style={{ fontSize: 21, fontWeight: 700, color: T.ink }}>ShopSphere</span>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", background: "#fff", border: `1px solid ${T.hair}`, borderRadius: 10, padding: "8px 12px", gap: 8, maxWidth: 460 }}>
          <Search size={15} color={T.sub} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products, SKU..." style={{ border: "none", outline: "none", fontSize: 13.5, flex: 1, background: "transparent" }} />
        </div>
        <div style={{ flex: 1 }} />
        <button onClick={onAdminClick} className="ss-btn" style={{ background: "transparent", border: `1px solid ${T.hair}`, borderRadius: 9, padding: "8px 14px", fontSize: 13, fontWeight: 700, color: T.sub, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <UserCog size={15} /> Admin
        </button>
        <button onClick={onCartClick} className="ss-btn" style={{ background: T.primary, border: "none", borderRadius: 9, padding: "9px 16px", fontSize: 13.5, fontWeight: 700, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
          <ShoppingBag size={16} /> Cart
          {cartCount > 0 && (
            <span style={{ background: T.gold, color: T.ink, borderRadius: 999, fontSize: 11, fontWeight: 800, minWidth: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>{cartCount}</span>
          )}
        </button>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <div style={{ background: `linear-gradient(120deg, ${T.primaryDark}, ${T.primary} 55%, ${T.gold})`, color: "#fff" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "56px 20px", display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 380px" }}>
          <div style={{ display: "inline-block", fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", background: "rgba(255,255,255,0.16)", padding: "5px 12px", borderRadius: 999, marginBottom: 16 }}>
            New season stock just arrived
          </div>
          <h1 className="ss-display" style={{ fontSize: 42, lineHeight: 1.08, fontWeight: 600, margin: "0 0 14px" }}>
            Everything your day needs, one till, no queue.
          </h1>
          <p style={{ fontSize: 15.5, opacity: 0.92, maxWidth: 460, marginBottom: 22 }}>
            Electronics, furniture, apparel and stationery — sourced, stocked, and shipped from a single storefront built for real orders, real receipts, real reporting.
          </p>
        </div>
        <div style={{ flex: "1 1 260px", display: "flex", justifyContent: "center" }}>
          <div className="ss-receipt-edge" style={{ background: "#fff", color: T.ink, borderRadius: "4px 4px 10px 10px", padding: "22px 22px 18px", width: 250, boxShadow: "0 24px 48px rgba(0,0,0,0.28)", transform: "rotate(-2deg)" }}>
            <div className="ss-mono" style={{ fontSize: 11, color: T.sub, marginBottom: 8 }}>RECEIPT #INV-20260716-0001</div>
            <div style={{ borderTop: `1px dashed ${T.hair}`, borderBottom: `1px dashed ${T.hair}`, padding: "10px 0", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 6 }}><span>Wireless Mouse</span><span>45,000</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 6 }}><span>BT Speaker</span><span>120,000</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}><span>Notebook A5</span><span>6,000</span></div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800 }}><span>TOTAL</span><span>UGX 272,438</span></div>
            <div style={{ fontSize: 10.5, color: T.sub, marginTop: 8 }}>PAID via PayPal · Thank you!</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   MAIN APP
============================================================================ */
export default function ShopSphereApp() {
  const [mode, setMode] = useState("store"); // store | admin-login | admin
  const [toast, setToast] = useState(null);
  const toastRef = useRef(null);
  const notify = (msg) => {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 2600);
  };

  // shared data (in-memory, resets on reload by design)
  const [products, setProducts] = useState(seedProducts);
  const [coupons, setCoupons] = useState(seedCoupons);
  const [orders, setOrders] = useState(seedOrders);
  const [staff, setStaff] = useState(seedStaff);
  const [orderSeq, setOrderSeq] = useState(3);
  const [chats, setChats] = useState(seedChats);
  const [hardware, setHardware] = useState(seedHardware);
  const [aiHistory, setAiHistory] = useState([]);

  // storefront state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]); // {id, qty}
  const [cartOpen, setCartOpen] = useState(false);
  const [quickView, setQuickView] = useState(null);
  const [storeView, setStoreView] = useState("shop"); // shop | checkout | receipt
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [shipping, setShipping] = useState({ name: "", phone: "", address: "", email: "" });
  const [payMethod, setPayMethod] = useState("paypal");
  const [checkoutCaptcha, setCheckoutCaptcha] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  // admin state
  const [adminTab, setAdminTab] = useState("dashboard");
  const [adminUser, setAdminUser] = useState(null);
  const [productModal, setProductModal] = useState(null); // {mode:'new'|'edit', data}
  const [staffModal, setStaffModal] = useState(null);
  const [reportPeriod, setReportPeriod] = useState("Monthly");

  const filteredProducts = useMemo(() => {
    return products.filter((p) => !p.deleted &&
      (category === "All" || p.category === category) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))
    );
  }, [products, category, search]);

  const cartItems = cart.map((c) => ({ ...c, product: products.find((p) => p.id === c.id && !p.deleted) })).filter((c) => c.product);
  const cartCount = cartItems.reduce((s, c) => s + c.qty, 0);
  const subtotal = cartItems.reduce((s, c) => s + c.qty * c.product.price, 0);
  const discount = appliedCoupon
    ? appliedCoupon.type === "percent" ? Math.round(subtotal * appliedCoupon.value / 100) : appliedCoupon.value
    : 0;
  const tax = Math.round((subtotal - discount) * 0.18);
  const shippingFee = subtotal > 0 ? (appliedCoupon?.code === "FREESHIP" ? 0 : 8000) : 0;
  const total = Math.max(0, subtotal - discount) + tax + shippingFee;

  function addToCart(product, qty = 1) {
    if (product.stock === 0) { notify(`${product.name} is out of stock.`); return; }
    setCart((prev) => {
      const existing = prev.find((c) => c.id === product.id);
      const currentQty = existing ? existing.qty : 0;
      if (currentQty + qty > product.stock) { notify(`Only ${product.stock} in stock.`); return prev; }
      if (existing) return prev.map((c) => c.id === product.id ? { ...c, qty: c.qty + qty } : c);
      return [...prev, { id: product.id, qty }];
    });
    notify(`Added "${product.name}" to cart.`);
  }
  function setQty(id, qty) {
    const product = products.find((p) => p.id === id);
    if (qty < 1) { setCart((prev) => prev.filter((c) => c.id !== id)); return; }
    if (product && qty > product.stock) { notify(`Only ${product.stock} in stock.`); return; }
    setCart((prev) => prev.map((c) => c.id === id ? { ...c, qty } : c));
  }
  function removeFromCart(id) { setCart((prev) => prev.filter((c) => c.id !== id)); }

  function applyCoupon() {
    const code = couponInput.trim().toUpperCase();
    const found = coupons.find((c) => c.code === code);
    if (!found) { setCouponError("Coupon code not found."); setAppliedCoupon(null); return; }
    if (found.status !== "active" || new Date(found.expiry) < new Date("2026-07-16")) {
      setCouponError("This coupon has expired or is inactive."); setAppliedCoupon(null); return;
    }
    setAppliedCoupon(found); setCouponError(""); notify(`Coupon "${found.code}" applied.`);
  }

  function placeOrder() {
    if (!shipping.name || !shipping.address || !shipping.phone) { notify("Please complete your shipping details."); return; }
    if (!checkoutCaptcha) { notify("Please confirm you're not a robot before paying."); return; }
    const payLabel = payMethod === "paypal" ? "PayPal" : payMethod === "mobile" ? "Mobile Money" : "Card";
    const newId = `ORD-20260716-${String(orderSeq).padStart(3, "0")}`;
    const order = {
      id: newId, customer: shipping.name, email: shipping.email || "guest@shopsphere.test",
      total, status: "processing", payment: payLabel,
      date: "2026-07-16", items: cartItems.map((c) => ({ name: c.product.name, qty: c.qty, price: c.product.price })),
    };
    setOrders((prev) => [order, ...prev]);
    setOrderSeq((s) => s + 1);
    setProducts((prev) => prev.map((p) => {
      const inCart = cartItems.find((c) => c.id === p.id);
      return inCart ? { ...p, stock: Math.max(0, p.stock - inCart.qty) } : p;
    }));
    setLastOrder({ ...order, subtotal, discount, tax, shippingFee, coupon: appliedCoupon?.code });
    setCart([]); setAppliedCoupon(null); setCouponInput(""); setCheckoutCaptcha(false);
    setStoreView("receipt");
    notify("Payment captured. Order confirmed — email sent!");
  }

  function downloadCsv(filename, headers, rows) {
    const csv = [headers.join(","), ...rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    notify(`Exported ${filename}`);
  }

  return (
    <div className="ss-root" style={{ background: T.cream, minHeight: "100%" }}>
      <style>{FONT_CSS}</style>
      <Toast toast={toast} />
      {mode === "store" && (
        <StorefrontApp
          {...{
            products, filteredProducts, category, setCategory, search, setSearch,
            cart, cartItems, cartCount, subtotal, discount, tax, shippingFee, total,
            cartOpen, setCartOpen, addToCart, setQty, removeFromCart,
            quickView, setQuickView, storeView, setStoreView,
            couponInput, setCouponInput, appliedCoupon, applyCoupon, couponError, setCouponError, setAppliedCoupon,
            shipping, setShipping, payMethod, setPayMethod, placeOrder, lastOrder,
            checkoutCaptcha, setCheckoutCaptcha, chats, setChats,
            onAdminClick: () => setMode("admin-login"), notify,
          }}
        />
      )}
      {mode === "admin-login" && (
        <AdminLogin
          onBack={() => setMode("store")}
          onLogin={(u) => { setAdminUser(u); setMode("admin"); setAdminTab("dashboard"); notify(`Welcome back, ${u}.`); }}
        />
      )}
      {mode === "admin" && (
        <AdminApp
          {...{
            adminTab, setAdminTab, adminUser,
            products, setProducts, orders, setOrders, coupons, setCoupons, staff, setStaff,
            chats, setChats, hardware, setHardware, aiHistory, setAiHistory,
            productModal, setProductModal, staffModal, setStaffModal, reportPeriod, setReportPeriod, downloadCsv, notify,
            onLogout: () => { setMode("store"); setAdminUser(null); },
            onViewStore: () => setMode("store"),
          }}
        />
      )}
    </div>
  );
}

/* ============================================================================
   STOREFRONT APP
============================================================================ */
function StorefrontApp(props) {
  const {
    products, filteredProducts, category, setCategory, search, setSearch,
    cartItems, cartCount, subtotal, discount, tax, shippingFee, total,
    cartOpen, setCartOpen, addToCart, setQty, removeFromCart,
    quickView, setQuickView, storeView, setStoreView,
    couponInput, setCouponInput, appliedCoupon, applyCoupon, couponError, setAppliedCoupon,
    shipping, setShipping, payMethod, setPayMethod, placeOrder, lastOrder,
    checkoutCaptcha, setCheckoutCaptcha, chats, setChats,
    onAdminClick, notify,
  } = props;

  if (storeView === "checkout") {
    return (
      <div>
        <StoreHeader cartCount={cartCount} onCartClick={() => setCartOpen(true)} onAdminClick={onAdminClick} search={search} setSearch={setSearch} />
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "34px 20px" }}>
          <button onClick={() => setStoreView("shop")} className="ss-btn" style={{ background: "none", border: "none", color: T.sub, fontSize: 13.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", marginBottom: 20 }}>
            <ArrowLeft size={15} /> Back to shop
          </button>
          <h1 className="ss-display" style={{ fontSize: 27, fontWeight: 600, marginBottom: 22 }}>Checkout</h1>
          <div style={{ display: "flex", gap: 26, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 380px", background: "#fff", border: `1px solid ${T.hair}`, borderRadius: 14, padding: 22 }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><MapPin size={16} color={T.primary} /> Shipping details</h3>
              <Field label="Full name">
                <input style={inputStyle} value={shipping.name} onChange={(e) => setShipping({ ...shipping, name: e.target.value })} placeholder="e.g. Grace Nabirye" />
              </Field>
              <Field label="Email (for order confirmation)">
                <input style={inputStyle} value={shipping.email} onChange={(e) => setShipping({ ...shipping, email: e.target.value })} placeholder="you@example.com" />
              </Field>
              <Field label="Phone number">
                <input style={inputStyle} value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} placeholder="e.g. 0772 456 019" />
              </Field>
              <Field label="Delivery address">
                <textarea rows={3} style={{ ...inputStyle, resize: "vertical" }} value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} placeholder="Street, city, landmark" />
              </Field>

              <h3 style={{ fontSize: 14, fontWeight: 800, margin: "22px 0 12px", display: "flex", alignItems: "center", gap: 8 }}><CreditCard size={16} color={T.primary} /> Payment method</h3>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => setPayMethod("paypal")} className="ss-btn" style={{ flex: 1, padding: "12px", borderRadius: 10, border: `2px solid ${payMethod === "paypal" ? T.primary : T.hair}`, background: payMethod === "paypal" ? "#F3E6C8" : "#fff", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <Wallet size={20} color={T.primary} /><span style={{ fontSize: 12.5, fontWeight: 700 }}>PayPal</span>
                </button>
                <button onClick={() => setPayMethod("card")} className="ss-btn" style={{ flex: 1, padding: "12px", borderRadius: 10, border: `2px solid ${payMethod === "card" ? T.primary : T.hair}`, background: payMethod === "card" ? "#F3E6C8" : "#fff", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <CreditCard size={20} color={T.primary} /><span style={{ fontSize: 12.5, fontWeight: 700 }}>Visa / Mastercard</span>
                </button>
                <button onClick={() => setPayMethod("mobile")} className="ss-btn" style={{ flex: 1, padding: "12px", borderRadius: 10, border: `2px solid ${payMethod === "mobile" ? T.primary : T.hair}`, background: payMethod === "mobile" ? "#F3E6C8" : "#fff", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <Smartphone size={20} color={T.primary} /><span style={{ fontSize: 12.5, fontWeight: 700 }}>Mobile Money</span>
                </button>
              </div>
              {payMethod === "mobile" && (
                <Field label="Mobile money number">
                  <input style={inputStyle} placeholder="e.g. 0772 456 019 (MTN / Airtel)" />
                </Field>
              )}
              <p style={{ fontSize: 11.5, color: T.sub, marginTop: 10 }}>Sandbox mode — no real charge is made. This simulates a gateway redirect and callback as described in the system documentation.</p>

              <div onClick={() => setCheckoutCaptcha((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 18, padding: "12px 14px", border: `1px solid ${T.hair}`, borderRadius: 10, background: "#fff", cursor: "pointer", width: "fit-content" }}>
                <div style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${checkoutCaptcha ? T.success : T.hair}`, background: checkoutCaptcha ? T.success : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {checkoutCaptcha && <Check size={13} color="#fff" />}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600 }}>I'm not a robot</span>
                <ShieldCheck size={16} color={T.sub} style={{ marginLeft: 4 }} />
              </div>
            </div>

            <div style={{ flex: "1 1 300px" }}>
              <OrderSummary {...{ cartItems, subtotal, discount, tax, shippingFee, total, appliedCoupon }} />
              <Btn variant="primary" size="lg" style={{ width: "100%", marginTop: 14 }} disabled={!checkoutCaptcha} onClick={placeOrder}>Pay {money(total)} & Place Order</Btn>
              {!checkoutCaptcha && <p style={{ fontSize: 11, color: T.sub, textAlign: "center", marginTop: 8 }}>Confirm you're not a robot to enable payment.</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (storeView === "receipt" && lastOrder) {
    return (
      <div>
        <StoreHeader cartCount={0} onCartClick={() => {}} onAdminClick={onAdminClick} search={search} setSearch={setSearch} />
        <div style={{ maxWidth: 620, margin: "0 auto", padding: "44px 20px", textAlign: "center" }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#E7F3EC", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
            <CheckCircle2 size={30} color={T.success} />
          </div>
          <h1 className="ss-display" style={{ fontSize: 26, fontWeight: 600, marginBottom: 6 }}>Order confirmed</h1>
          <p style={{ color: T.sub, marginBottom: 26 }}>A receipt has been emailed to {lastOrder.email}.</p>

          <div className="ss-receipt-edge" style={{ background: "#fff", border: `1px solid ${T.hair}`, borderRadius: "6px 6px 14px 14px", padding: 24, textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span className="ss-mono" style={{ fontSize: 12, color: T.sub }}>{lastOrder.id}</span>
              <Badge tone="success">PAID</Badge>
            </div>
            <div style={{ fontSize: 12.5, color: T.sub, marginBottom: 14 }}>16 Jul 2026 · Paid via {lastOrder.payment}</div>
            <div style={{ borderTop: `1px dashed ${T.hair}`, borderBottom: `1px dashed ${T.hair}`, padding: "12px 0", marginBottom: 12 }}>
              {lastOrder.items.map((it, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 6 }}>
                  <span>{it.name} × {it.qty}</span><span>{money(it.price * it.qty)}</span>
                </div>
              ))}
            </div>
            <Row label="Subtotal" value={money(lastOrder.subtotal)} />
            {lastOrder.coupon && <Row label={`Discount (${lastOrder.coupon})`} value={"-" + money(lastOrder.discount)} />}
            <Row label="Tax (18%)" value={money(lastOrder.tax)} />
            <Row label="Shipping" value={lastOrder.shippingFee === 0 ? "Free" : money(lastOrder.shippingFee)} />
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 16, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.hair}` }}>
              <span>Total paid</span><span style={{ color: T.primary }}>{money(lastOrder.total)}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
            <Btn variant="outline" icon={Printer} onClick={() => window.print()}>Print receipt</Btn>
            <Btn variant="primary" onClick={() => setStoreView("shop")}>Continue shopping</Btn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <StoreHeader cartCount={cartCount} onCartClick={() => setCartOpen(true)} onAdminClick={onAdminClick} search={search} setSearch={setSearch} />
      <Hero />

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "36px 20px 60px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <Filter size={15} color={T.sub} />
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className="ss-btn" style={{
              padding: "7px 16px", borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: "pointer",
              border: `1px solid ${category === c ? T.primary : T.hair}`,
              background: category === c ? T.primary : "#fff", color: category === c ? "#fff" : T.ink,
            }}>{c}</button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <EmptyState title="No products found" body="Try a different search term or category." />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 20 }}>
            {filteredProducts.map((p) => (
              <div key={p.id} className="ss-card" style={{ background: "#fff", border: `1px solid ${T.hair}`, borderRadius: 14, padding: 14, cursor: "pointer" }} onClick={() => setQuickView(p)}>
                <ProductArt product={p} />
                <div style={{ fontSize: 10.5, fontWeight: 700, color: T.gold, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 12 }}>{p.category}</div>
                <div style={{ fontSize: 14.5, fontWeight: 700, margin: "3px 0 6px", lineHeight: 1.3 }}>{p.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <Stars rating={p.rating} /><span style={{ fontSize: 11.5, color: T.sub }}>({p.reviews})</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span className="ss-mono" style={{ fontWeight: 700, fontSize: 15, color: T.primary }}>{money(p.price)}</span>
                  <button onClick={(e) => { e.stopPropagation(); addToCart(p, 1); }} className="ss-btn" style={{ background: T.ink, color: "#fff", border: "none", borderRadius: 8, padding: "7px 10px", cursor: "pointer" }}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {quickView && (
        <Modal title={quickView.name} onClose={() => setQuickView(null)} width={560}>
          <ProductArt product={quickView} height={200} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "14px 0 6px" }}>
            <Stars rating={quickView.rating} size={14} /><span style={{ fontSize: 12.5, color: T.sub }}>{quickView.rating} · {quickView.reviews} reviews</span>
          </div>
          <p style={{ fontSize: 13.5, color: T.sub, lineHeight: 1.6, marginBottom: 12 }}>{quickView.desc}</p>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: T.sub, marginBottom: 16 }}>
            <span>SKU: {quickView.sku}</span>
            <span style={{ color: quickView.stock > 10 ? T.success : quickView.stock > 0 ? "#8A6D00" : T.danger, fontWeight: 700 }}>
              {quickView.stock > 0 ? `${quickView.stock} in stock` : "Out of stock"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className="ss-mono" style={{ fontSize: 20, fontWeight: 800, color: T.primary }}>{money(quickView.price)}</span>
            <Btn variant="primary" icon={ShoppingBag} disabled={quickView.stock === 0} onClick={() => { addToCart(quickView, 1); setQuickView(null); }}>Add to cart</Btn>
          </div>
        </Modal>
      )}

      {cartOpen && (
        <CartDrawer {...{ cartItems, subtotal, discount, tax, shippingFee, total, setQty, removeFromCart, onClose: () => setCartOpen(false), couponInput, setCouponInput, appliedCoupon, applyCoupon, couponError, setAppliedCoupon, onCheckout: () => { setCartOpen(false); setStoreView("checkout"); } }} />
      )}

      <SupportChatWidget chats={chats} setChats={setChats} notify={notify} />

      <footer style={{ borderTop: `1px solid ${T.hair}`, padding: "26px 20px", textAlign: "center", fontSize: 12, color: T.sub }}>
        © 2026 ShopSphere E-Commerce Management System · BIT3211 Coursework 2 · Built by Abubakar Tijjani
        <div style={{ marginTop: 6, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: T.sub }}>
          <Globe size={12} /> Deployed on infinityfree.com (free hosting tier)
        </div>
      </footer>
    </div>
  );
}

const GUEST_CHAT_ID = 999;
function SupportChatWidget({ chats, setChats, notify }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const guestChat = chats.find((c) => c.id === GUEST_CHAT_ID) || { id: GUEST_CHAT_ID, customer: "You (Guest)", messages: [
    { from: "staff", text: "Hi! Welcome to ShopSphere — how can we help today?", time: "Now" },
  ] };

  function send() {
    if (!text.trim()) return;
    setChats((prev) => {
      const exists = prev.find((c) => c.id === GUEST_CHAT_ID);
      const msg = { from: "customer", text, time: "Now" };
      if (exists) return prev.map((c) => c.id === GUEST_CHAT_ID ? { ...c, messages: [...c.messages, msg], unread: 0 } : c);
      return [{ ...guestChat, messages: [...guestChat.messages, msg] }, ...prev];
    });
    setText("");
    notify("Message sent to support.");
  }

  return (
    <div style={{ position: "fixed", bottom: 22, right: 22, zIndex: 90 }}>
      {open && (
        <div className="ss-fade-in" style={{ width: 300, height: 380, background: "#fff", borderRadius: 14, boxShadow: "0 20px 50px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column", marginBottom: 12, border: `1px solid ${T.hair}`, overflow: "hidden" }}>
          <div style={{ background: T.primary, color: "#fff", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 7 }}><MessageSquare size={15} /> Support Chat</span>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}><X size={15} /></button>
          </div>
          <div className="ss-scroll" style={{ flex: 1, overflowY: "auto", padding: 14, background: T.cream }}>
            {guestChat.messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.from === "customer" ? "flex-end" : "flex-start", marginBottom: 8 }}>
                <div style={{ maxWidth: "78%", background: m.from === "customer" ? T.primary : "#fff", color: m.from === "customer" ? "#fff" : T.ink, padding: "8px 11px", borderRadius: 10, fontSize: 12.5, border: m.from === "customer" ? "none" : `1px solid ${T.hair}` }}>{m.text}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: 10, borderTop: `1px solid ${T.hair}`, display: "flex", gap: 8 }}>
            <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type a message..." style={{ ...inputStyle, padding: "8px 10px", fontSize: 12.5 }} />
            <button onClick={send} style={{ background: T.primary, border: "none", borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}><Send size={14} color="#fff" /></button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen((o) => !o)} className="ss-btn" style={{ width: 54, height: 54, borderRadius: "50%", background: T.primary, border: "none", boxShadow: "0 12px 28px rgba(0,0,0,0.25)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <MessageSquare size={22} color="#fff" />
      </button>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: T.sub, marginBottom: 6 }}>
      <span>{label}</span><span style={{ color: T.ink, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function OrderSummary({ cartItems, subtotal, discount, tax, shippingFee, total, appliedCoupon }) {
  return (
    <div className="ss-receipt-edge" style={{ background: "#fff", border: `1px solid ${T.hair}`, borderRadius: "6px 6px 14px 14px", padding: 20 }}>
      <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 14 }}>Order summary</h3>
      <div style={{ maxHeight: 180, overflowY: "auto", marginBottom: 12 }} className="ss-scroll">
        {cartItems.map((c) => (
          <div key={c.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 8 }}>
            <span style={{ color: T.ink }}>{c.product.name} × {c.qty}</span>
            <span className="ss-mono" style={{ color: T.sub }}>{money(c.product.price * c.qty)}</span>
          </div>
        ))}
      </div>
      <div style={{ borderTop: `1px dashed ${T.hair}`, paddingTop: 10 }}>
        <Row label="Subtotal" value={money(subtotal)} />
        {appliedCoupon && <Row label={`Discount (${appliedCoupon.code})`} value={"-" + money(discount)} />}
        <Row label="Tax (18%)" value={money(tax)} />
        <Row label="Shipping" value={shippingFee === 0 ? "Free" : money(shippingFee)} />
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 16, marginTop: 8, paddingTop: 8, borderTop: `1px solid ${T.hair}` }}>
          <span>Total</span><span style={{ color: T.primary }}>{money(total)}</span>
        </div>
      </div>
    </div>
  );
}

function CartDrawer(props) {
  const { cartItems, subtotal, discount, tax, shippingFee, total, setQty, removeFromCart, onClose, couponInput, setCouponInput, appliedCoupon, applyCoupon, couponError, setAppliedCoupon, onCheckout } = props;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 120 }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(43,32,19,0.4)" }} onClick={onClose} />
      <div className="ss-slide-in ss-scroll" style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 400, maxWidth: "94vw", background: "#fff", boxShadow: "-14px 0 40px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "18px 20px", borderBottom: `1px solid ${T.hair}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Your cart</h3>
          <button onClick={onClose} style={{ background: T.cream, border: "none", borderRadius: 8, padding: 6, cursor: "pointer" }}><X size={16} /></button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }} className="ss-scroll">
          {cartItems.length === 0 ? (
            <EmptyState title="Your cart is empty" body="Add products to see them here." compact />
          ) : cartItems.map((c) => (
            <div key={c.id} style={{ display: "flex", gap: 12, marginBottom: 18 }}>
              <div style={{ width: 54, height: 54, borderRadius: 8, flexShrink: 0 }}><ProductArt product={c.product} height={54} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{c.product.name}</div>
                <div className="ss-mono" style={{ fontSize: 12, color: T.sub, marginBottom: 6 }}>{money(c.product.price)}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={() => setQty(c.id, c.qty - 1)} style={{ width: 22, height: 22, borderRadius: 6, border: `1px solid ${T.hair}`, background: "#fff", cursor: "pointer" }}><Minus size={11} style={{ margin: "auto" }} /></button>
                  <span style={{ fontSize: 12.5, fontWeight: 700, width: 18, textAlign: "center" }}>{c.qty}</span>
                  <button onClick={() => setQty(c.id, c.qty + 1)} style={{ width: 22, height: 22, borderRadius: 6, border: `1px solid ${T.hair}`, background: "#fff", cursor: "pointer" }}><Plus size={11} style={{ margin: "auto" }} /></button>
                  <button onClick={() => removeFromCart(c.id)} style={{ marginLeft: "auto", background: "none", border: "none", color: T.danger, cursor: "pointer" }}><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cartItems.length > 0 && (
          <div style={{ padding: 20, borderTop: `1px solid ${T.hair}` }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="Coupon code" style={{ ...inputStyle, flex: 1 }} />
              <Btn variant="subtle" onClick={applyCoupon}>Apply</Btn>
            </div>
            {couponError && <div style={{ fontSize: 11.5, color: T.danger, marginBottom: 8 }}>{couponError}</div>}
            {appliedCoupon && (
              <div style={{ fontSize: 11.5, color: T.success, marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
                <span>"{appliedCoupon.code}" applied</span>
                <button onClick={() => setAppliedCoupon(null)} style={{ background: "none", border: "none", color: T.sub, cursor: "pointer", textDecoration: "underline" }}>Remove</button>
              </div>
            )}
            <Row label="Subtotal" value={money(subtotal)} />
            {appliedCoupon && <Row label="Discount" value={"-" + money(discount)} />}
            <Row label="Tax + shipping" value={money(tax + shippingFee)} />
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 16, margin: "8px 0 14px" }}>
              <span>Total</span><span style={{ color: T.primary }}>{money(total)}</span>
            </div>
            <Btn variant="primary" size="lg" style={{ width: "100%" }} onClick={onCheckout}>Proceed to checkout</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ title, body, compact }) {
  return (
    <div style={{ textAlign: "center", padding: compact ? "30px 10px" : "60px 10px" }}>
      <Package size={compact ? 30 : 40} color={T.hair} style={{ marginBottom: 12 }} />
      <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 12.5, color: T.sub }}>{body}</div>
    </div>
  );
}

/* ============================================================================
   ADMIN LOGIN
============================================================================ */
function AdminLogin({ onLogin, onBack }) {
  const [email, setEmail] = useState("admin@shopsphere.test");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [captcha, setCaptcha] = useState(false);
  const [error, setError] = useState("");

  function handleLogin() {
    if (!captcha) { setError("Please confirm you're not a robot."); return; }
    setError("");
    onLogin(email.split("@")[0] || "Admin");
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${T.primaryDark}, ${T.primary})`, padding: 20 }}>
      <style>{FONT_CSS}</style>
      <div className="ss-fade-in" style={{ background: "#fff", borderRadius: 16, width: 380, maxWidth: "100%", padding: 30, boxShadow: "0 30px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <div className="ss-seal" style={{ width: 50, height: 50, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}><Shield size={22} color="#fff" /></div>
        </div>
        <h2 className="ss-display" style={{ textAlign: "center", fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Staff Sign In</h2>
        <p style={{ textAlign: "center", fontSize: 12.5, color: T.sub, marginBottom: 22 }}>ShopSphere Admin Console</p>
        <Field label="Email address">
          <input style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Password">
          <div style={{ position: "relative" }}>
            <input type={showPw ? "text" : "password"} style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Any password works in this demo" />
            <button onClick={() => setShowPw((s) => !s)} style={{ position: "absolute", right: 10, top: 10, background: "none", border: "none", cursor: "pointer", color: T.sub }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </Field>
        <div onClick={() => setCaptcha((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", border: `1px solid ${T.hair}`, borderRadius: 10, background: T.cream, cursor: "pointer", marginBottom: 6 }}>
          <div style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${captcha ? T.success : T.hair}`, background: captcha ? T.success : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {captcha && <Check size={13} color="#fff" />}
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>I'm not a robot</span>
          <ShieldCheck size={16} color={T.sub} />
        </div>
        {error && <div style={{ fontSize: 12, color: T.danger, marginBottom: 10 }}>{error}</div>}
        <Btn variant="primary" size="lg" style={{ width: "100%", marginTop: 6 }} onClick={handleLogin}>Sign In</Btn>
        <button onClick={onBack} className="ss-btn" style={{ width: "100%", background: "none", border: "none", color: T.sub, fontSize: 12.5, marginTop: 14, cursor: "pointer" }}>← Back to storefront</button>
        <p style={{ fontSize: 10.5, color: T.sub, textAlign: "center", marginTop: 14 }}>Demo console — any email/password combination signs you in as Super Admin.</p>
      </div>
    </div>
  );
}

/* ============================================================================
   ADMIN APP
============================================================================ */
function AdminApp(props) {
  const { adminTab, setAdminTab, adminUser, onLogout, onViewStore, products, chats } = props;
  const unreadChats = chats.filter((c) => c.unread).length;
  const deletedCount = products.filter((p) => p.deleted).length;
  const NAV = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ClipboardList },
    { id: "coupons", label: "Coupons", icon: Tag },
    { id: "staff", label: "Staff", icon: Users },
    { id: "roles", label: "Roles & Permissions", icon: Shield },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "chat", label: "Support Chat", icon: MessageSquare, badge: unreadChats },
    { id: "settings", label: "Settings & Hardware", icon: Settings },
    { id: "trash", label: "Recycle Bin", icon: RotateCcw, badge: deletedCount },
    { id: "ai", label: "AI Assistant", icon: Sparkles },
  ];
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ width: 232, background: T.primaryDark, color: "#fff", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "20px 18px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
          <div className="ss-seal" style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}><ShoppingBag size={14} color="#fff" /></div>
          <span className="ss-display" style={{ fontSize: 16.5, fontWeight: 700 }}>ShopSphere</span>
        </div>
        <div style={{ flex: 1, padding: "14px 10px", overflowY: "auto" }} className="ss-scroll">
          {NAV.map((n) => (
            <button key={n.id} onClick={() => setAdminTab(n.id)} className="ss-btn" style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", marginBottom: 3,
              borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, textAlign: "left",
              background: adminTab === n.id ? T.gold : "transparent", color: adminTab === n.id ? T.ink : "rgba(255,255,255,0.85)",
            }}>
              <n.icon size={16} /> <span style={{ flex: 1 }}>{n.label}</span>
              {!!n.badge && <span style={{ background: adminTab === n.id ? T.primaryDark : T.gold, color: adminTab === n.id ? "#fff" : T.ink, fontSize: 10.5, fontWeight: 800, borderRadius: 999, minWidth: 17, height: 17, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>{n.badge}</span>}
            </button>
          ))}
        </div>
        <div style={{ padding: 14, borderTop: "1px solid rgba(255,255,255,0.12)" }}>
          <button onClick={onViewStore} className="ss-btn" style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.25)", background: "transparent", color: "#fff", fontSize: 12.5, fontWeight: 600, cursor: "pointer", marginBottom: 8 }}>
            <ShoppingBag size={14} /> View storefront
          </button>
          <button onClick={onLogout} className="ss-btn" style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "9px 12px", borderRadius: 8, border: "none", background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
            <LogOut size={14} /> Log out
          </button>
        </div>
      </div>

      <div style={{ flex: 1, background: T.cream, overflowX: "hidden" }}>
        <div style={{ padding: "16px 28px", borderBottom: `1px solid ${T.hair}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff" }}>
          <span style={{ fontSize: 15, fontWeight: 800, textTransform: "capitalize" }}>{adminTab.replace("-", " ")}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, color: T.sub }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: T.gold, display: "flex", alignItems: "center", justifyContent: "center", color: T.ink, fontSize: 12 }}>
              {(adminUser || "A")[0].toUpperCase()}
            </div>
            {adminUser || "Admin"}
          </div>
        </div>
        <div style={{ padding: 28 }}>
          {adminTab === "dashboard" && <DashboardTab {...props} />}
          {adminTab === "products" && <ProductsTab {...props} />}
          {adminTab === "orders" && <OrdersTab {...props} />}
          {adminTab === "coupons" && <CouponsTab {...props} />}
          {adminTab === "staff" && <StaffTab {...props} />}
          {adminTab === "roles" && <RolesTab {...props} />}
          {adminTab === "reports" && <ReportsTab {...props} />}
          {adminTab === "chat" && <ChatTab {...props} />}
          {adminTab === "settings" && <SettingsTab {...props} />}
          {adminTab === "trash" && <TrashTab {...props} />}
          {adminTab === "ai" && <AITab {...props} />}
        </div>
      </div>
    </div>
  );
}

function DashboardTab({ products, orders }) {
  const activeProducts = products.filter((p) => !p.deleted);
  const lowStock = activeProducts.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const revenueToday = orders.filter((o) => o.date === "2026-07-16").reduce((s, o) => s + o.total, 0);
  return (
    <div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard label="Total products" value={activeProducts.length} Icon={Package} tone={T.primary} sub={`${lowStock} low stock`} />
        <StatCard label="Orders today" value={orders.filter((o) => o.date === "2026-07-16").length} Icon={ClipboardList} tone={T.info} />
        <StatCard label="Revenue today" value={money(revenueToday)} Icon={TrendingUp} tone={T.success} sub="+8.4%" />
        <StatCard label="Total orders" value={orders.length} Icon={BarChart3} tone={T.gold} />
      </div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div style={{ flex: "2 1 420px", background: "#fff", border: `1px solid ${T.hair}`, borderRadius: 14, padding: 20, height: 300 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 14 }}>Revenue trend (last 6 months, UGX millions)</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={REVENUE_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.hair} vertical={false} />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: T.sub }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: T.sub }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: T.cream }} contentStyle={{ borderRadius: 8, border: `1px solid ${T.hair}`, fontSize: 12 }} />
              <Bar dataKey="v" fill={T.gold} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: "1 1 260px", background: "#fff", border: `1px solid ${T.hair}`, borderRadius: 14, padding: 20, height: 300 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 14 }}>Orders by status</h3>
          <ResponsiveContainer width="100%" height="78%">
            <PieChart>
              <Pie data={STATUS_SPLIT} dataKey="value" innerRadius={50} outerRadius={78} paddingAngle={3}>
                {STATUS_SPLIT.map((s, i) => <Cell key={i} fill={s.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: `1px solid ${T.hair}`, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: -10 }}>
            {STATUS_SPLIT.map((s) => (
              <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />{s.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Toolbar({ children }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>{children}</div>;
}

function TableShell({ headers, children }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${T.hair}`, borderRadius: 14, overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#F2E9D2" }}>
              {headers.map((h) => <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11.5, fontWeight: 800, color: T.sub, textTransform: "uppercase", letterSpacing: 0.4, whiteSpace: "nowrap" }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}
const td = { padding: "12px 16px", borderTop: `1px solid ${T.hair}`, verticalAlign: "middle" };

function ProductsTab({ products, setProducts, productModal, setProductModal, downloadCsv, notify }) {
  const [q, setQ] = useState("");
  const list = products.filter((p) => !p.deleted && (p.name.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase())));

  function save(data) {
    if (productModal.mode === "new") {
      const id = Math.max(0, ...products.map((p) => p.id)) + 1;
      setProducts((prev) => [...prev, { ...data, id, sku: data.sku || `SKU-${1000 + id}`, rating: 0, reviews: 0, deleted: false }]);
      notify("Product added.");
    } else {
      setProducts((prev) => prev.map((p) => p.id === data.id ? data : p));
      notify("Product updated.");
    }
    setProductModal(null);
  }
  function remove(id) { setProducts((prev) => prev.map((p) => p.id === id ? { ...p, deleted: true } : p)); notify("Product moved to Recycle Bin."); }

  return (
    <div>
      <Toolbar>
        <div style={{ display: "flex", alignItems: "center", background: "#fff", border: `1px solid ${T.hair}`, borderRadius: 9, padding: "8px 12px", gap: 8, minWidth: 240 }}>
          <Search size={14} color={T.sub} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or SKU..." style={{ border: "none", outline: "none", fontSize: 13, flex: 1 }} />
        </div>
        <div style={{ flex: 1 }} />
        <Btn variant="subtle" icon={Download} onClick={() => downloadCsv("products.csv", ["SKU", "Name", "Category", "Price", "Stock"], list.map((p) => [p.sku, p.name, p.category, p.price, p.stock]))}>Export CSV</Btn>
        <Btn variant="primary" icon={Plus} onClick={() => setProductModal({ mode: "new", data: { name: "", category: "Electronics", price: 0, stock: 0, sku: "", desc: "" } })}>Add Product</Btn>
      </Toolbar>
      <TableShell headers={["Product", "SKU", "Category", "Price", "Stock", "Status", "Actions"]}>
        {list.map((p) => (
          <tr key={p.id}>
            <td style={{ ...td, fontWeight: 700 }}>{p.name}</td>
            <td style={{ ...td, ...{}, fontFamily: "monospace", color: T.sub }}>{p.sku}</td>
            <td style={td}>{p.category}</td>
            <td style={{ ...td, fontFamily: "monospace" }}>{money(p.price)}</td>
            <td style={td}>{p.stock}</td>
            <td style={td}>{p.stock === 0 ? <Badge tone="danger">Out of stock</Badge> : p.stock <= 10 ? <Badge tone="warn">Low stock</Badge> : <Badge tone="success">Active</Badge>}</td>
            <td style={td}>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setProductModal({ mode: "edit", data: { ...p } })} style={{ background: "none", border: "none", cursor: "pointer", color: T.info }}><Pencil size={15} /></button>
                <button onClick={() => remove(p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: T.danger }}><Trash2 size={15} /></button>
              </div>
            </td>
          </tr>
        ))}
      </TableShell>

      {productModal && (
        <Modal title={productModal.mode === "new" ? "Add New Product" : "Edit Product"} onClose={() => setProductModal(null)} width={480}>
          <ProductForm data={productModal.data} onSave={save} />
        </Modal>
      )}
    </div>
  );
}

function ProductForm({ data, onSave }) {
  const [f, setF] = useState(data);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  async function generateDescription() {
    if (!f.name) { setAiError("Enter a product name first."); return; }
    setAiLoading(true); setAiError("");
    try {
      const text = await askAI(
        [{ role: "user", content:
          `Write a concise, appealing e-commerce product description (2-3 sentences, no headings, no markdown) for this product on ShopSphere, an online store in Uganda:\n` +
          `Name: ${f.name}\nCategory: ${f.category}\nPrice: ${money(f.price || 0)}\n` +
          `Return only the description text, nothing else.` }],
        { maxTokens: 200 }
      );
      setF((prev) => ({ ...prev, desc: text }));
    } catch (err) {
      setAiError(err.message || "Could not generate a description right now.");
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div>
      <Field label="Product name"><input style={inputStyle} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}><Field label="Category">
          <select style={inputStyle} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>
            {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field></div>
        <div style={{ flex: 1 }}><Field label="SKU (optional)"><input style={inputStyle} value={f.sku} onChange={(e) => setF({ ...f, sku: e.target.value })} placeholder="Auto-generated if blank" /></Field></div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}><Field label="Price (UGX)"><input type="number" style={inputStyle} value={f.price} onChange={(e) => setF({ ...f, price: Number(e.target.value) })} /></Field></div>
        <div style={{ flex: 1 }}><Field label="Stock quantity"><input type="number" style={inputStyle} value={f.stock} onChange={(e) => setF({ ...f, stock: Number(e.target.value) })} /></Field></div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: T.sub }}>Description</span>
        <button onClick={generateDescription} disabled={aiLoading} className="ss-btn" style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: T.primary, fontSize: 11.5, fontWeight: 700, cursor: aiLoading ? "wait" : "pointer" }}>
          {aiLoading ? <Loader2 size={13} className="ss-spin" /> : <Sparkles size={13} />} {aiLoading ? "Generating..." : "Generate with AI"}
        </button>
      </div>
      <textarea rows={3} style={{ ...inputStyle, resize: "vertical" }} value={f.desc} onChange={(e) => setF({ ...f, desc: e.target.value })} />
      {aiError && <div style={{ fontSize: 11.5, color: T.danger, marginTop: 6 }}>{aiError}</div>}
      <div style={{ height: 14 }} />
      <Btn variant="primary" style={{ width: "100%" }} onClick={() => onSave(f)}>Save Product</Btn>
    </div>
  );
}

function OrdersTab({ orders, setOrders, downloadCsv }) {
  const [view, setView] = useState(null);
  const nextStatus = { pending: "processing", processing: "shipped", shipped: "delivered", delivered: "delivered" };
  function advance(id) {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: (o.status === "cancelled" || o.status === "voided") ? o.status : nextStatus[o.status] } : o));
  }
  function voidOrder(id) { setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: "voided" } : o)); }
  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "#FCF3D9", border: "1px solid #E9D98B", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
        <AlertTriangle size={16} color="#8A6D00" style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontSize: 12.5, color: "#5C4A00" }}>Orders and receipts cannot be permanently deleted from ShopSphere. A record can only be <b>voided</b> — it remains visible in the system and reports for audit, clearly marked as cancelled.</span>
      </div>
      <Toolbar>
        <div style={{ flex: 1 }} />
        <Btn variant="subtle" icon={Download} onClick={() => downloadCsv("orders.csv", ["Order No", "Customer", "Total", "Payment", "Status", "Date"], orders.map((o) => [o.id, o.customer, o.total, o.payment, o.status, o.date]))}>Export CSV</Btn>
      </Toolbar>
      <TableShell headers={["Order No.", "Customer", "Total", "Payment", "Status", "Date", "Actions"]}>
        {orders.map((o) => (
          <tr key={o.id}>
            <td style={{ ...td, fontFamily: "monospace", fontSize: 12 }}>{o.id}</td>
            <td style={{ ...td, fontWeight: 700 }}>{o.customer}</td>
            <td style={{ ...td, fontFamily: "monospace" }}>{money(o.total)}</td>
            <td style={td}>{o.payment}</td>
            <td style={td}><Badge tone={orderStatusTone[o.status]}>{o.status}</Badge></td>
            <td style={{ ...td, color: T.sub }}>{o.date}</td>
            <td style={td}>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setView(o)} title="View" style={{ background: "none", border: "none", cursor: "pointer", color: T.info }}><Eye size={15} /></button>
                {o.status !== "delivered" && o.status !== "cancelled" && o.status !== "voided" && (
                  <button onClick={() => advance(o.id)} title="Advance status" style={{ background: "none", border: "none", cursor: "pointer", color: T.success }}><Truck size={15} /></button>
                )}
                {o.status !== "voided" && (
                  <button onClick={() => voidOrder(o.id)} title="Void order (cannot be deleted)" style={{ background: "none", border: "none", cursor: "pointer", color: T.danger }}><Ban size={15} /></button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </TableShell>
      {view && (
        <Modal title={`Order ${view.id}`} onClose={() => setView(null)}>
          <Row label="Customer" value={view.customer} />
          <Row label="Payment method" value={view.payment} />
          <Row label="Status" value={view.status} />
          <Row label="Date" value={view.date} />
          <div style={{ borderTop: `1px dashed ${T.hair}`, margin: "12px 0" }} />
          {view.items.map((it, i) => <Row key={i} label={`${it.name} × ${it.qty}`} value={money(it.price * it.qty)} />)}
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 15, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.hair}` }}>
            <span>Total</span><span style={{ color: T.primary }}>{money(view.total)}</span>
          </div>
        </Modal>
      )}
    </div>
  );
}

function CouponsTab({ coupons }) {
  return (
    <TableShell headers={["Code", "Type", "Value", "Used", "Expiry", "Status"]}>
      {coupons.map((c) => (
        <tr key={c.code}>
          <td style={{ ...td, fontFamily: "monospace", fontWeight: 700 }}>{c.code}</td>
          <td style={{ ...td, textTransform: "capitalize" }}>{c.type}</td>
          <td style={td}>{c.type === "percent" ? `${c.value}%` : money(c.value)}</td>
          <td style={td}>{c.used}</td>
          <td style={td}>{c.expiry}</td>
          <td style={td}><Badge tone={c.status === "active" ? "success" : "danger"}>{c.status}</Badge></td>
        </tr>
      ))}
    </TableShell>
  );
}

function StaffTab({ staff, setStaff, staffModal, setStaffModal, notify }) {
  function toggle(id) {
    setStaff((prev) => prev.map((s) => s.id === id ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" } : s));
    notify("Staff status updated.");
  }
  function addStaff(data) {
    const id = Math.max(0, ...staff.map((s) => s.id)) + 1;
    setStaff((prev) => [...prev, { ...data, id, status: "Active", joined: "16 Jul 2026" }]);
    notify(`${data.name} added as ${data.role}.`);
    setStaffModal(null);
  }
  return (
    <div>
      <Toolbar>
        <div style={{ flex: 1 }} />
        <Btn variant="primary" icon={Plus} onClick={() => setStaffModal({ name: "", email: "", role: ROLE_NAMES[2] })}>Add Staff</Btn>
      </Toolbar>
      <TableShell headers={["Staff member", "Role", "Email", "Status", "Joined", "Actions"]}>
        {staff.map((s) => (
          <tr key={s.id}>
            <td style={{ ...td, fontWeight: 700 }}>{s.name}</td>
            <td style={td}>{s.role}</td>
            <td style={{ ...td, color: T.sub }}>{s.email}</td>
            <td style={td}><Badge tone={s.status === "Active" ? "success" : "danger"}>{s.status}</Badge></td>
            <td style={{ ...td, color: T.sub }}>{s.joined}</td>
            <td style={td}><Btn variant="subtle" size="sm" onClick={() => toggle(s.id)}>{s.status === "Active" ? "Deactivate" : "Activate"}</Btn></td>
          </tr>
        ))}
      </TableShell>
      {staffModal && (
        <Modal title="Add New Staff Member" onClose={() => setStaffModal(null)} width={440}>
          <StaffForm data={staffModal} onSave={addStaff} />
        </Modal>
      )}
    </div>
  );
}

function StaffForm({ data, onSave }) {
  const [f, setF] = useState(data);
  return (
    <div>
      <Field label="Full name"><input style={inputStyle} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="e.g. Dr. Aminu Musa" /></Field>
      <Field label="Email address"><input style={inputStyle} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="staff@shopsphere.test" /></Field>
      <Field label="Assign role">
        <select style={inputStyle} value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}>
          {ROLE_NAMES.map((r) => <option key={r}>{r}</option>)}
        </select>
      </Field>
      <p style={{ fontSize: 11.5, color: T.sub, marginBottom: 14 }}>The selected role determines which admin modules this staff member can access (see Roles & Permissions).</p>
      <Btn variant="primary" style={{ width: "100%" }} disabled={!f.name || !f.email} onClick={() => onSave(f)}>Create Staff Member</Btn>
    </div>
  );
}

function RolesTab() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
      {ROLES.map((r) => (
        <div key={r.name} className="ss-card" style={{ background: "#fff", border: `1px solid ${T.hair}`, borderRadius: 14, padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "#F3E6C8", display: "flex", alignItems: "center", justifyContent: "center" }}><Shield size={16} color={T.primary} /></div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14 }}>{r.name}</div>
              <div style={{ fontSize: 11.5, color: T.sub }}>{r.members} staff member{r.members !== 1 ? "s" : ""}</div>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {r.perms.map((p) => <Badge key={p} tone="neutral">{p}</Badge>)}
          </div>
        </div>
      ))}
    </div>
  );
}

function ReportsTab({ orders, reportPeriod, setReportPeriod, downloadCsv }) {
  const totalRevenue = orders.filter((o) => o.status !== "cancelled" && o.status !== "voided").reduce((s, o) => s + o.total, 0);
  const avgOrder = orders.length ? Math.round(totalRevenue / orders.length) : 0;
  const refunds = orders.filter((o) => o.status === "cancelled" || o.status === "voided").reduce((s, o) => s + o.total, 0);
  return (
    <div>
      <Toolbar>
        {["Daily", "Weekly", "Monthly", "Annual"].map((p) => (
          <button key={p} onClick={() => setReportPeriod(p)} className="ss-btn" style={{
            padding: "8px 16px", borderRadius: 999, fontSize: 12.5, fontWeight: 700, cursor: "pointer",
            border: `1px solid ${reportPeriod === p ? T.primary : T.hair}`,
            background: reportPeriod === p ? T.primary : "#fff", color: reportPeriod === p ? "#fff" : T.ink,
          }}>{p}</button>
        ))}
        <div style={{ flex: 1 }} />
        <Btn variant="subtle" icon={Download} onClick={() => downloadCsv(`revenue-${reportPeriod.toLowerCase()}.csv`, ["Order No", "Customer", "Total", "Status", "Date"], orders.map((o) => [o.id, o.customer, o.total, o.status, o.date]))}>Export CSV</Btn>
        <Btn variant="outline" icon={Printer} onClick={() => window.print()}>Print report</Btn>
      </Toolbar>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 22 }}>
        <StatCard label="Total orders" value={orders.length} Icon={ClipboardList} tone={T.gold} />
        <StatCard label="Total revenue" value={money(totalRevenue)} Icon={TrendingUp} tone={T.success} />
        <StatCard label="Avg. order value" value={money(avgOrder)} Icon={BarChart3} tone={T.info} />
        <StatCard label="Cancelled / refunds" value={money(refunds)} Icon={AlertTriangle} tone={T.danger} />
      </div>
      <div style={{ background: "#fff", border: `1px solid ${T.hair}`, borderRadius: 14, padding: 20, height: 300 }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 14 }}>{reportPeriod} revenue trend (UGX millions)</h3>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={REVENUE_TREND}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.hair} vertical={false} />
            <XAxis dataKey="m" tick={{ fontSize: 11, fill: T.sub }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: T.sub }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: T.cream }} contentStyle={{ borderRadius: 8, border: `1px solid ${T.hair}`, fontSize: 12 }} />
            <Bar dataKey="v" fill={T.primary} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ============================================================================
   SUPPORT CHAT (ADMIN SIDE)
============================================================================ */
function ChatTab({ chats, setChats }) {
  const [activeId, setActiveId] = useState(chats[0]?.id);
  const [text, setText] = useState("");
  const active = chats.find((c) => c.id === activeId) || chats[0];

  function send() {
    if (!text.trim() || !active) return;
    setChats((prev) => prev.map((c) => c.id === active.id ? { ...c, messages: [...c.messages, { from: "staff", text, time: "Now" }] } : c));
    setText("");
  }
  function openChat(id) {
    setActiveId(id);
    setChats((prev) => prev.map((c) => c.id === id ? { ...c, unread: 0 } : c));
  }

  return (
    <div style={{ display: "flex", gap: 20, height: 520 }}>
      <div style={{ width: 260, background: "#fff", border: `1px solid ${T.hair}`, borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T.hair}`, fontWeight: 800, fontSize: 13 }}>Conversations</div>
        <div style={{ overflowY: "auto", flex: 1 }} className="ss-scroll">
          {chats.map((c) => (
            <button key={c.id} onClick={() => openChat(c.id)} style={{
              width: "100%", textAlign: "left", padding: "12px 16px", border: "none", cursor: "pointer",
              background: active?.id === c.id ? T.cream : "transparent", borderBottom: `1px solid ${T.hair}`,
              display: "flex", flexDirection: "column", gap: 3,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{c.customer}</span>
                {!!c.unread && <span style={{ background: T.danger, color: "#fff", fontSize: 10, fontWeight: 800, borderRadius: 999, minWidth: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{c.unread}</span>}
              </div>
              <span style={{ fontSize: 11, color: T.sub }}>{c.messages[c.messages.length - 1]?.text?.slice(0, 34)}...</span>
              <span style={{ fontSize: 10, color: T.sub }}>{c.lastSeen}</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, background: "#fff", border: `1px solid ${T.hair}`, borderRadius: 14, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {active ? (
          <>
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.hair}`, fontWeight: 800, fontSize: 13.5, display: "flex", alignItems: "center", gap: 8 }}>
              <MessageSquare size={16} color={T.primary} /> {active.customer}
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 18, background: T.cream }} className="ss-scroll">
              {active.messages.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.from === "staff" ? "flex-end" : "flex-start", marginBottom: 10 }}>
                  <div style={{ maxWidth: "65%", background: m.from === "staff" ? T.primary : "#fff", color: m.from === "staff" ? "#fff" : T.ink, padding: "9px 13px", borderRadius: 10, fontSize: 13, border: m.from === "staff" ? "none" : `1px solid ${T.hair}` }}>
                    {m.text}
                    <div style={{ fontSize: 9.5, opacity: 0.7, marginTop: 3 }}>{m.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: 14, borderTop: `1px solid ${T.hair}`, display: "flex", gap: 10 }}>
              <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Reply to customer..." style={{ ...inputStyle, flex: 1 }} />
              <Btn variant="primary" icon={Send} onClick={send}>Send</Btn>
            </div>
          </>
        ) : <EmptyState title="No conversations" body="Customer messages will appear here." />}
      </div>
    </div>
  );
}

/* ============================================================================
   SETTINGS & HARDWARE
============================================================================ */
const HARDWARE_ICONS = { Camera, ScanLine, QrCode, Fingerprint };
function SettingsTab({ hardware, setHardware, notify }) {
  function toggleDevice(id) {
    setHardware((prev) => prev.map((h) => h.id === id ? { ...h, connected: !h.connected } : h));
    const dev = hardware.find((h) => h.id === id);
    notify(dev && !dev.connected ? `${dev.name} connected.` : `${dev?.name} disconnected.`);
  }
  return (
    <div>
      <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 14 }}>Hardware Devices</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, marginBottom: 30 }}>
        {hardware.map((h) => {
          const Icon = HARDWARE_ICONS[h.icon] || Package;
          return (
            <div key={h.id} className="ss-card" style={{ background: "#fff", border: `1px solid ${T.hair}`, borderRadius: 14, padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: h.connected ? "#E7F3EC" : "#F1EBD9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={17} color={h.connected ? T.success : T.sub} />
                </div>
                <Badge tone={h.connected ? "success" : "neutral"}>{h.connected ? "Connected" : "Not connected"}</Badge>
              </div>
              <div style={{ fontWeight: 800, fontSize: 13.5, marginBottom: 4 }}>{h.name}</div>
              <div style={{ fontSize: 11.5, color: T.sub, marginBottom: 14, lineHeight: 1.5 }}>{h.desc}</div>
              <Btn variant={h.connected ? "outline" : "primary"} size="sm" style={{ width: "100%" }} onClick={() => toggleDevice(h.id)}>
                {h.connected ? "Disconnect" : "Connect device"}
              </Btn>
            </div>
          );
        })}
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 14 }}>Deployment</h3>
      <div style={{ background: "#fff", border: `1px solid ${T.hair}`, borderRadius: 14, padding: 20, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: "#F3E6C8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Server size={20} color={T.primary} />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontWeight: 800, fontSize: 13.5 }}>Hosting: InfinityFree (free tier)</div>
          <div style={{ fontSize: 12, color: T.sub, marginTop: 2 }}>Domain: shopsphere.infinityfreeapp.com · PHP 8.3 · MySQL via InfinityFree control panel</div>
        </div>
        <Badge tone="success">Live</Badge>
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 800, margin: "26px 0 14px" }}>Security</h3>
      <div style={{ background: "#fff", border: `1px solid ${T.hair}`, borderRadius: 14, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <ShieldCheck size={16} color={T.success} />
          <span style={{ fontSize: 13, fontWeight: 700 }}>"I'm not a robot" verification enabled on Login and Checkout</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ShieldCheck size={16} color={T.success} />
          <span style={{ fontSize: 13, fontWeight: 700 }}>Passwords stored with bcrypt hashing (see documentation, Ch. 7)</span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   RECYCLE BIN
============================================================================ */
function TrashTab({ products, setProducts, notify }) {
  const deleted = products.filter((p) => p.deleted);
  function restore(id) { setProducts((prev) => prev.map((p) => p.id === id ? { ...p, deleted: false } : p)); notify("Product restored."); }
  function purge(id) { setProducts((prev) => prev.filter((p) => p.id !== id)); notify("Product permanently deleted."); }
  function emptyTrash() { setProducts((prev) => prev.filter((p) => !p.deleted)); notify("Recycle Bin emptied."); }

  if (deleted.length === 0) {
    return <EmptyState title="Recycle Bin is empty" body="Deleted products will appear here and can be restored or permanently removed." />;
  }
  return (
    <div>
      <Toolbar>
        <span style={{ fontSize: 12.5, color: T.sub }}>{deleted.length} item(s) in Recycle Bin</span>
        <div style={{ flex: 1 }} />
        <Btn variant="danger" icon={Trash2} onClick={emptyTrash}>Empty Trash</Btn>
      </Toolbar>
      <TableShell headers={["Product", "SKU", "Category", "Price", "Actions"]}>
        {deleted.map((p) => (
          <tr key={p.id}>
            <td style={{ ...td, fontWeight: 700 }}>{p.name}</td>
            <td style={{ ...td, fontFamily: "monospace", color: T.sub }}>{p.sku}</td>
            <td style={td}>{p.category}</td>
            <td style={{ ...td, fontFamily: "monospace" }}>{money(p.price)}</td>
            <td style={td}>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="subtle" size="sm" icon={ArchiveRestore} onClick={() => restore(p.id)}>Restore</Btn>
                <Btn variant="danger" size="sm" icon={Trash2} onClick={() => purge(p.id)}>Delete Forever</Btn>
              </div>
            </td>
          </tr>
        ))}
      </TableShell>
    </div>
  );
}

/* ============================================================================
   AI BUSINESS ASSISTANT — real, working Claude-powered assistant.
   Grounded in the store's live products/orders/coupons data so answers are
   specific to this business, not generic.
============================================================================ */
const AI_SUGGESTIONS = [
  "Which products need restocking soon?",
  "Summarize today's sales performance",
  "Suggest a promotion for slow-moving stock",
  "Draft a short customer email about a new coupon",
  "Which orders need my attention right now?",
];

function AITab({ products, orders, coupons, aiHistory, setAiHistory, notify }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [aiHistory, loading]);

  async function sendMessage(text) {
    const question = (text ?? input).trim();
    if (!question || loading) return;
    setError("");
    const userMsg = { role: "user", content: question };
    const nextHistory = [...aiHistory, userMsg];
    setAiHistory(nextHistory);
    setInput("");
    setLoading(true);
    try {
      const system =
        "You are the AI Business Assistant embedded in the ShopSphere e-commerce admin dashboard " +
        "(a Laravel-based store management system in Uganda, currency UGX). Answer the staff member's " +
        "question using the live data snapshot below. Be concise and practical — use short paragraphs " +
        "or bullet points, and concrete numbers/names from the snapshot rather than generic advice. " +
        "If asked to draft text (emails, promos), write it directly and completely.\n\n" +
        "LIVE DATA SNAPSHOT:\n" + businessSnapshot(products, orders, coupons);

      const reply = await askAI(nextHistory, { system, maxTokens: 700 });
      setAiHistory((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(err.message || "The AI assistant is unavailable right now. Please try again.");
      notify("AI request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F3E6C8", border: `1px solid ${T.hair}`, borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
        <Sparkles size={16} color={T.primary} />
        <span style={{ fontSize: 12.5, color: T.primaryDark }}>
          Live AI assistant (Claude) grounded in your current products, orders, and coupons — not a scripted demo. Ask it anything about the business.
        </span>
      </div>

      <div style={{ background: "#fff", border: `1px solid ${T.hair}`, borderRadius: 14, display: "flex", flexDirection: "column", height: 500, overflow: "hidden" }}>
        <div ref={scrollRef} className="ss-scroll" style={{ flex: 1, overflowY: "auto", padding: 20, background: T.cream }}>
          {aiHistory.length === 0 && (
            <div style={{ textAlign: "center", padding: "30px 10px 10px" }}>
              <div className="ss-seal" style={{ width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <Bot size={20} color="#fff" />
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Ask your AI business assistant</div>
              <div style={{ fontSize: 12, color: T.sub, marginBottom: 18 }}>It can see your live stock, orders, and coupon data.</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 460, margin: "0 auto" }}>
                {AI_SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => sendMessage(s)} className="ss-btn" style={{ border: `1px solid ${T.hair}`, background: "#fff", borderRadius: 999, padding: "7px 14px", fontSize: 12, fontWeight: 600, color: T.ink, cursor: "pointer" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {aiHistory.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
              <div style={{
                maxWidth: "72%", background: m.role === "user" ? T.primary : "#fff", color: m.role === "user" ? "#fff" : T.ink,
                padding: "10px 14px", borderRadius: 12, fontSize: 13, lineHeight: 1.55, whiteSpace: "pre-wrap",
                border: m.role === "user" ? "none" : `1px solid ${T.hair}`,
              }}>
                {m.role === "assistant" && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5, fontSize: 11, fontWeight: 800, color: T.primary }}>
                    <Sparkles size={12} /> AI ASSISTANT
                  </div>
                )}
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12 }}>
              <div style={{ background: "#fff", border: `1px solid ${T.hair}`, borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: T.sub }}>
                <Loader2 size={14} className="ss-spin" /> Thinking...
              </div>
            </div>
          )}
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FBEAEA", border: "1px solid #EBC9C9", borderRadius: 10, padding: "10px 14px", fontSize: 12.5, color: T.danger }}>
              <AlertTriangle size={14} /> {error}
            </div>
          )}
        </div>
        <div style={{ padding: 14, borderTop: `1px solid ${T.hair}`, display: "flex", gap: 10 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about stock, sales, orders, or ask it to draft something..."
            style={{ ...inputStyle, flex: 1 }}
          />
          <Btn variant="primary" icon={loading ? Loader2 : Send} disabled={loading || !input.trim()} onClick={() => sendMessage()}>
            {loading ? "Sending" : "Send"}
          </Btn>
        </div>
      </div>
    </div>
  );
}
