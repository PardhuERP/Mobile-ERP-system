const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";
const SHEET_NAME = "orders";

fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}&t=${Date.now()}`)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(
      text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1)
    );

    let html = "";

    json.table.rows.forEach(r => {
      if(!r.c) return;

      const orderId = r.c[0]?.v;
      const date = r.c[1]?.v;
      const customer = r.c[2]?.v;
      const product = r.c[3]?.v;
      const qty = r.c[4]?.v;
      const total = r.c[5]?.v;
      const paid = r.c[6]?.v;
      const balance = r.c[7]?.v;
      const status = (r.c[8]?.v || "").toLowerCase();

      html += `
        <div class="order">
          <b>Order #${orderId}</b>
          <span class="badge ${status}">${status}</span><br><br>

          Customer: ${customer}<br>
          Product: ${product}<br>
          Qty: ${qty}<br>
          <span class="small">Date: ${date}</span><br><br>

          Total: ₹${total}<br>
          Paid: ₹${paid}<br>
          Balance: ₹${balance}
        </div>
      `;
    });

    document.getElementById("orderList").innerHTML =
      html || "No orders found";

  })
  .catch(() => {
    document.getElementById("orderList").innerText =
      "Error loading orders";
  });
