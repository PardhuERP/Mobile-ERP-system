const SHEET_ID = "1ZG49Svf_a7sjtxv87Zx_tnk8_ymVurhcCm0YzrgKByo";
const SHEET_NAME = "Users";

const API_URL =
`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;

async function login(){
  const u = document.getElementById("user").value.trim();
  const p = document.getElementById("pin").value.trim();
  const err = document.getElementById("err");

  try{
    const res = await fetch(API_URL);
    const text = await res.text();
    const json = JSON.parse(
      text.substring(text.indexOf('{'), text.lastIndexOf('}')+1)
    );

    const rows = json.table.rows;

    for(const r of rows){
      if(!r.c) continue;

      const username = r.c[0]?.v;
      const pin = r.c[1]?.v;
      const role = r.c[2]?.v;
      const company = r.c[3]?.v;
      const modules = r.c[4]?.v;

      if(username === u && pin === p){
        localStorage.setItem("user", username);
        localStorage.setItem("role", role);
        localStorage.setItem("company", company);
        localStorage.setItem("modules", modules);
        window.location.href = "dashboard.html";
        return;
      }
    }

    err.style.display="block";
  }catch(e){
    err.style.display="block";
  }
}
