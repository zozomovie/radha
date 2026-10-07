const money=n=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2}).format(Number(n)||0);

let selectedProducts=[];
let billItems=[];
let paymentMethod="Cash";
let lastInvoice=null;

function loadSelectedProducts(){
    try{
        selectedProducts=JSON.parse(localStorage.getItem("rs_checkout_products_v8"))||[];
    }catch(e){selectedProducts=[]}
    // Support the older bridge too.
    if(!selectedProducts.length){
        try{
            const ids=JSON.parse(localStorage.getItem("rs_checkout_products_v7"))||[];
            const stored=JSON.parse(localStorage.getItem("rs_products"))||[];
            selectedProducts=ids.map(id=>stored.find(p=>Number(p.id)===Number(id))).filter(Boolean);
        }catch(e){}
    }

    billItems=selectedProducts.map(p=>({
        id:p.id,
        name:p.name||"Item",
        brand:p.brand||"",
        size:p.size||"",
        price:Number(p.price)||0,
        gst:Number(p.gst)||0,
        stock:Number(p.stock)||999,
        qty:1,
        image:p.image||""
    }));

    localStorage.removeItem("rs_checkout_products_v8");
    localStorage.removeItem("rs_checkout_products_v7");
}

function nextInvoice(){
    let invoices=[];
    try{invoices=JSON.parse(localStorage.getItem("rs_invoices"))||[]}catch(e){}
    return `RS-${String(invoices.length+1).padStart(4,"0")}`;
}

function init(){
    loadSelectedProducts();
    document.getElementById("invoiceNo").textContent=nextInvoice();
    document.getElementById("invoiceDate").textContent=new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});

    document.querySelectorAll(".pay-btn").forEach(btn=>{
        btn.addEventListener("click",()=>{
            document.querySelectorAll(".pay-btn").forEach(x=>x.classList.remove("active"));
            btn.classList.add("active");
            paymentMethod=btn.dataset.method;
            updatePayment();
        });
    });

    document.getElementById("productSelect").addEventListener("change",updateSelectedMRP);
    document.getElementById("discount").addEventListener("input",calculate);
    document.getElementById("amountReceived").addEventListener("input",updatePayment);

    renderSelect();
    renderItems();
    calculate();
}

function renderSelect(){
    const select=document.getElementById("productSelect");
    const list=[...billItems];
    select.innerHTML='<option value="">Choose saaman</option>'+list.map(p=>
        `<option value="${p.id}">✓ ${escapeHtml(p.name)} • ${escapeHtml(p.size)} • MRP ${money(p.price)}</option>`
    ).join("");
    if(list.length)select.value=String(list[0].id);
    updateSelectedMRP();
}

function updateSelectedMRP(){
    const id=document.getElementById("productSelect").value;
    const p=billItems.find(x=>String(x.id)===String(id));
    document.getElementById("selectedMRP").textContent=p?money(p.price):"₹0.00";
}

function addSelectedItem(){
    const id=document.getElementById("productSelect").value;
    const p=billItems.find(x=>String(x.id)===String(id));
    if(!p){alert("Saaman select kijiye.");return}
    const q=Math.max(1,Number(document.getElementById("productQty").value)||1);
    p.qty+=q-1;
    renderItems();calculate();
}

function changeQty(d){
    const input=document.getElementById("productQty");
    input.value=Math.max(1,(Number(input.value)||1)+d);
}

function removeItem(id){
    billItems=billItems.filter(x=>String(x.id)!==String(id));
    renderSelect();renderItems();calculate();
}

function renderItems(){
    const body=document.getElementById("itemsBody");
    const empty=document.getElementById("emptyState");
    if(!billItems.length){
        body.innerHTML="";
        empty.style.display="flex";
        return;
    }
    empty.style.display="none";
    body.innerHTML=billItems.map((p,i)=>{
        const taxable=p.price*p.qty;
        const total=taxable+(taxable*p.gst/100);
        return `<tr>
            <td><strong>${escapeHtml(p.name)}</strong><small>${escapeHtml(p.brand)} ${p.size?"• "+escapeHtml(p.size):""}</small></td>
            <td>${money(p.price)}</td>
            <td>${p.qty}</td>
            <td>${p.gst}%</td>
            <td>${money(taxable)}</td>
            <td><strong>${money(total)}</strong></td>
            <td><button class="remove" onclick="removeItem(${JSON.stringify(p.id)})">×</button></td>
        </tr>`;
    }).join("");
}

function calculate(){
    const subtotal=billItems.reduce((s,p)=>s+p.price*p.qty,0);
    const discount=Math.min(Math.max(0,Number(document.getElementById("discount").value)||0),subtotal);
    const discountRatio = subtotal > 0 ? (subtotal - discount) / subtotal : 1;
    const taxable = subtotal - discount;
    const tax = billItems.reduce((s,p) => s + (p.price * p.qty * discountRatio * p.gst / 100), 0);
    const cgst=tax/2, sgst=tax/2, total=taxable+tax;

    document.getElementById("subtotal").textContent=money(subtotal);
    document.getElementById("taxable").textContent=money(taxable);
    document.getElementById("cgst").textContent=money(cgst);
    document.getElementById("sgst").textContent=money(sgst);
    document.getElementById("grandTotal").textContent=money(total);
    updatePayment(total);

    return {subtotal,discount,taxable,cgst,sgst,total};
}

function updatePayment(totalArg){
    const total=totalArg!==undefined?totalArg:calculate().total;
    const input=document.getElementById("amountReceived");
    if(document.activeElement!==input && input.value===""){
        input.value=paymentMethod==="Due"?"0":total.toFixed(2);
    }
    let received=Math.max(0,Number(input.value)||0);
    if(paymentMethod==="Due" && document.activeElement!==input)received=0;
    const due=Math.max(0,total-received);
    const change=Math.max(0,received-total);
    document.getElementById("received").textContent=money(received);
    document.getElementById("due").textContent=money(due);
    document.getElementById("change").textContent=money(change);
}

function generateInvoice(){
    if(!billItems.length){alert("Bill mein kam se kam ek saaman hona chahiye.");return}
    const customer=document.getElementById("customerName").value.trim();
    if(!customer){alert("Customer Name bharna zaroori hai.");document.getElementById("customerName").focus();return}

    const calc=calculate();
    const received=Math.max(0,Number(document.getElementById("amountReceived").value)||0);
    const paid=Math.min(received,calc.total);
    
    lastInvoice={
        number:nextInvoice(),
        date:new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}),
        customer,
        mobile:document.getElementById("customerMobile").value.trim(),
        payment:paymentMethod,
        items:JSON.parse(JSON.stringify(billItems)),
        ...calc,
        paid,
        due:Math.max(0,calc.total-paid)
    };

    let savedInvoices=[];
    try {
        savedInvoices=JSON.parse(localStorage.getItem("rs_invoices"))||[];
    } catch(e) {}
    savedInvoices.push(lastInvoice);
    localStorage.setItem("rs_invoices", JSON.stringify(savedInvoices));

    // Deduct stock
    try {
        let allProducts = JSON.parse(localStorage.getItem("rs_products"))||[];
        if (allProducts.length) {
            billItems.forEach(item => {
                const prod = allProducts.find(p => String(p.id) === String(item.id));
                if (prod) prod.stock = Math.max(0, prod.stock - item.qty);
            });
            localStorage.setItem("rs_products", JSON.stringify(allProducts));
        }
    } catch(e) {}

    // Disable generating again for same items
    billItems = [];
    renderItems();
    renderSelect();

    document.getElementById("viewInvoiceNo").textContent=lastInvoice.number;
    document.getElementById("viewDate").textContent=lastInvoice.date;
    document.getElementById("viewPayment").textContent=paymentMethod;
    document.getElementById("viewCustomer").textContent=lastInvoice.customer;
    document.getElementById("viewMobile").textContent=lastInvoice.mobile||"-";
    document.getElementById("viewSubtotal").textContent=money(calc.subtotal);
    document.getElementById("viewDiscount").textContent=money(calc.discount);
    document.getElementById("viewCGST").textContent=money(calc.cgst);
    document.getElementById("viewSGST").textContent=money(calc.sgst);
    document.getElementById("viewPaid").textContent=money(paid);
    document.getElementById("viewDue").textContent=money(lastInvoice.due);
    document.getElementById("viewGrand").textContent=money(calc.total);

    document.getElementById("invoiceItems").innerHTML=billItems.map((p,i)=>{
        const taxable=p.price*p.qty;
        const total=taxable+(taxable*p.gst/100);
        return `<tr><td>${i+1}</td><td><strong>${escapeHtml(p.name)}</strong><small>${escapeHtml(p.brand)} ${p.size?"• "+escapeHtml(p.size):""}</small></td><td>${money(p.price)}</td><td>${p.qty}</td><td>${p.gst}%</td><td>${money(taxable)}</td><td><strong>${money(total)}</strong></td></tr>`;
    }).join("");

    document.getElementById("invoiceOverlay").classList.add("show");
}

function closeInvoice(){document.getElementById("invoiceOverlay").classList.remove("show")}

function printInvoice(){
    if(!lastInvoice)generateInvoice();
    setTimeout(()=>window.print(),100);
}

function goBack(){window.location.href="products.html"}

function escapeHtml(s){
    return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}

document.addEventListener("keydown",e=>{
    if(e.key==="Escape")closeInvoice();
});

window.addEventListener("DOMContentLoaded",init);
