/* ========= CONFIG ========= */
const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";
const SHEET_NAME = "orders";

/* ========= AUTH ========= */
const role = localStorage.getItem("role");
const user = localStorage.getItem("user");
const company = (localStorage.getItem("company") || "").toLowerCase();
const modulesRaw = localStorage.getItem("modules") || "";

if (!role || !user) {
  location.replace("index.html");
}

/* ========= CREATE BUTTON (STAFF + ADMIN + SUPER) ========= */
if (modulesRaw === "all" || modulesRaw.toLowerCase().includes("orders")) {
  document.getElementById("orderActions").innerHTML = `
    <button onclick="location.href='orders-create.html'"
      style="width:100%;padding:12px;margin-bottom:12px;
      background:#25d366;color:#fff;border:none;border-radius:6px">
      ➕ Create Order
    </button>
  `;
}

/* ========= HELPERS ========= */
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

/* ========= LOAD ORDERS ========= */
fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}&t=${Date.now()}`)
.then(res => res.text())
.then(text => {

  const json = JSON.parse(
    text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1)
  );

  let html = "";

  json.table.rows.forEach(r => {
    if (!r.c) return;

    const orderId  = r.c[0]?.v || "";
    const date     = formatDate(r.c[1]?.v);
    const customer = r.c[2]?.v || "";
    const rowCompany = (r.c[3]?.v || "").toLowerCase();
    const product  = r.c[4]?.v || "";
    const qty      = Number(r.c[6]?.v || 0);
    const total    = Number(r.c[7]?.v || 0);
    const paid     = Number(r.c[8]?.v || 0);
    const balance  = Number(r.c[9]?.v || 0);

    /* STATUS SAFE */
    const statusRaw = r.c[12]?.v;
    const status = statusRaw ? String(statusRaw).toLowerCase() : "pending";

    /* COMPANY FILTER (SUPER sees all) */
    if (role !== "super" && rowCompany !== company) return;

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
