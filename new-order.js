const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";
const PRODUCTS_SHEET = "products";

const company = localStorage.getItem("company");
const user = localStorage.getItem("user");

let products = [];

/* ===== LOAD PRODUCTS ===== */
fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${PRODUCTS_SHEET}`)
.then(res => res.text())
.then(text => {

  const json = JSON.parse(
    text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1)
  );

  const select = document.getElementById("product");

  json.table.rows.forEach(r=>{
    if(!r.c) return;
    if((r.c[5]?.v || "").toLowerCase() !== "yes") return;

    const p = {
      id: r.c[0].v,
      name: r.c[1].v,
      price: Number(r.c[2].v)
    };

    products.push(p);

    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = `${p.name} – ₹${p.price}`;
    select.appendChild(opt);
  });

  calculate();

});

document.getElementById("qty").addEventListener("input", calculate);
document.getElementById("paid").addEventListener("input", calculate);
document.getElementById("product").addEventListener("change", calculate);

function calculate(){
  const pid = document.getElementById("product").value;
  const qty = Number(document.getElementById("qty").value || 0);
  const paid = Number(document.getElementById("paid").value || 0);

  const p = products.find(x=>x.id==pid);
  if(!p) return;

  const total = p.price * qty;
  const balance = total - paid;

  document.getElementById("total").innerText = total;
  document.getElementById("balance").innerText = balance;
}

function previewOrder(){
  const order = {
    date: new Date().toISOString().slice(0,10),
    customer: document.getElementById("customer").value,
    company,
    product: document.getElementById("product").selectedOptions[0].text,
    qty: document.getElementById("qty").value,
    total: document.getElementById("total").innerText,
    paid: document.getElementById("paid").value,
    balance: document.getElementById("balance").innerText,
    payment_mode: document.getElementById("payment").value,
    order_type: document.getElementById("orderType").value,
    status: "pending",
    created_by: user
  };

  alert("ORDER PREVIEW\n\n" + JSON.stringify(order, null, 2));
}
