const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";
const SHEET_NAME = "orders";

const company = (localStorage.getItem("company") || "").toLowerCase();

fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}&t=${Date.now()}`)
  .then(res => res.text())
  .then(text => {

    const json = JSON.parse(
      text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1)
    );

    let html = "";

    json.table.rows.forEach(r => {
      if(!r.c) return;

      // Column mapping (IMPORTANT)
      const order_id   = r.c[0]?.v;
      const date       = r.c[1]?.v;
      const customer   = r.c[2]?.v;
      const rowCompany = (r.c[3]?.v || "").toLowerCase();
      const product    = r.c[4]?.v;
      const qty        = r.c[6]?.v;
      const total      = r.c[7]?.v;
      const paid       = r.c[8]?.v;
      const balance    = r.c[9]?.v;
      const status     = (r.c[12]?.v || "").toLowerCase();

      if(rowCompany !== company) return;

      html += `
        <div class="order">
          <b>Order #${order_id}</b><br>
          ${customer} – ${product}<br>
          Qty: ${qty}<br>
          Total: ₹${total}<br>
          Paid: ₹${paid}<br>
          Balance: ₹${balance}<br>
          <span class="badge ${status}">${status}</span>
        </div>
      `;
    });

    document.getElementById("orderList").innerHTML =
      html || "No orders found";

  })
  .catch(err => {
    console.error(err);
    document.getElementById("orderList").innerText =
      "Error loading orders";
  });
