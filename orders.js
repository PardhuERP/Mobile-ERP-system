/* =========================
   ORDERS LIST – FINAL
========================= */

const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";
const SHEET_NAME = "orders";

const role    = localStorage.getItem("role");
const company = (localStorage.getItem("company") || "").toLowerCase();

/* =========================
   RBAC – CREATE BUTTON
========================= */
if (role === "admin" || role === "super") {
  document.getElementById("orderActions").innerHTML = `
    <button onclick="location.href='orders-create.html'"
      style="margin-bottom:10px;background:#25d366;color:#fff;
             border:none;padding:10px;border-radius:6px;width:100%">
      + Create Order
    </button>
  `;
}

/* =========================
   DATE FORMAT FIX
========================= */
function formatDate(v){
  if(!v) return "";
  if(typeof v === "string") return v;
  if(v.getFullYear){
    const y = v.getFullYear();
    const m = String(v.getMonth()+1).padStart(2,"0");
    const d = String(v.getDate()).padStart(2,"0");
    return `${y}-${m}-${d}`;
  }
  return "";
}

/* =========================
   LOAD ORDERS
========================= */
fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}&t=${Date.now()}`)
.then(res => res.text())
.then(text => {

  const json = JSON.parse(
    text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1)
  );

  let html = "";

  json.table.rows.forEach(r => {
    if(!r.c) return;

    /*
      orders sheet columns:
      0 order_id
      1 date
      2 customer
      3 company
      4 product
      5 product_id
      6 qty
      7 total
      8 paid
      9 balance
      10 payment_mode
      11 order_type
      12 status
      13 created_by
      14 last_updated
    */

    const rowCompany = (r.c[3]?.v || "").toLowerCase();
    if(role !== "super" && rowCompany !== company) return;

    const orderId  = r.c[0]?.v || "";
    const date     = formatDate(r.c[1]?.v);
    const customer = r.c[2]?.v || "";
    const product  = r.c[4]?.v || "";
    const qty      = Number(r.c[6]?.v || 0);
    const total    = Number(r.c[7]?.v || 0);
    const paid     = Number(r.c[8]?.v || 0);
    const balance  = Number(r.c[9]?.v || 0);

    const statusRaw = r.c[12]?.v;
    const status =
      statusRaw === undefined || statusRaw === null
        ? "pending"
        : String(statusRaw).toLowerCase();

    html += `
      <div class="order">
        <b>Order #${orderId}</b><br>
        <small>${date}</small><br><br>

        Customer: ${customer}<br>
        Product: ${product}<br>
        Qty: ${qty}<br>
        Total: ₹${total}<br>
        Paid: ₹${paid}<br>
        Balance: ₹${balance}<br>

        <span class="badge ${status}">
          ${status.toUpperCase()}
        </span>
      </div>
    `;
  });

  document.getElementById("orderList").innerHTML =
    html || "No orders found";

})
.catch(err => {
  console.error("ORDERS LOAD ERROR:", err);
  document.getElementById("orderList").innerText =
    "Error loading orders";
});
