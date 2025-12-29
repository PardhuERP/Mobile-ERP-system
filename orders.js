/* =========================
   UTIL: SAFE DATE FORMAT
========================= */
function formatDate(v){
  if(!v) return "";
  if(typeof v === "string") return v;

  if(v.getFullYear){
    const y = v.getFullYear();
    const m = String(v.getMonth() + 1).padStart(2, "0");
    const d = String(v.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return "";
}

/* =========================
   GOOGLE SHEET CONFIG
========================= */
const SHEET_ID   = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";
const SHEET_NAME = "orders";

/* =========================
   FETCH ORDERS
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

      const orderId  = r.c[0]?.v ?? "";
      const date     = formatDate(r.c[1]?.v);
      const customer = r.c[2]?.v ?? "";
      const product  = r.c[3]?.v ?? "";

      const qty      = Number(r.c[4]?.v ?? 0);
      const total    = Number(r.c[5]?.v ?? 0);
      const paid     = Number(r.c[6]?.v ?? 0);
      const balance  = Number(r.c[7]?.v ?? 0);

      /* SAFE STATUS HANDLING */
      const statusRaw = r.c[8]?.v;
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
          Balance: ₹${balance}<br><br>

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
