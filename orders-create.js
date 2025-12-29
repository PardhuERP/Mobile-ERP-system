const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";

const company = localStorage.getItem("company");
const user = localStorage.getItem("user");

let products = [];

/* ===== LOAD PRODUCTS ===== */
fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=products`)
.then(r=>r.text())
.then(t=>{
  const j = JSON.parse(t.substring(t.indexOf('{'),t.lastIndexOf('}')+1));
  const sel = document.getElementById("product");

  j.table.rows.forEach(r=>{
    if(!r.c) return;
    if((r.c[5]?.v||"").toLowerCase()!=="yes") return;

    products.push({
      id:r.c[0].v,
      name:r.c[1].v,
      price:r.c[2].v
    });

    const o=document.createElement("option");
    o.value=r.c[0].v;
    o.textContent=`${r.c[1].v} (₹${r.c[2].v})`;
    sel.appendChild(o);
  });
});

/* ===== SAVE ORDER ===== */
function saveOrder(){
  const customer = document.getElementById("customer").value;
  const qty = Number(document.getElementById("qty").value);
  const paid = Number(document.getElementById("paid").value);
  const productId = document.getElementById("product").value;
  const payment = document.getElementById("payment_mode").value;

  const p = products.find(x=>x.id==productId);
  if(!p || !qty){ alert("Invalid data"); return; }

  const total = qty * p.price;
  const balance = total - paid;
  const date = new Date().toISOString().slice(0,10);

  const row = [
    "", date, company, customer,
    p.name, p.id, qty, total, paid, balance,
    payment, "manual", "pending", user, date
  ];

  /* ===== COPY ROW (Manual Paste Method) ===== */
  alert(
`COPY THIS ROW & PASTE IN ORDERS SHEET 👇

${row.join("\t")}`
  );
}
