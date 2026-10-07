/* =====================================================
   RADHA SWAMI TYRE AGENCY
   BILLING + INVENTORY SOFTWARE
===================================================== */


/* ================= DEFAULT PRODUCTS ================= */

const defaultProducts = [

    {
        id: 1,
        name: "MRF ZVTV 195/65 R15",
        brand: "MRF",
        size: "195/65 R15",
        price: 5250,
        stock: 12,
        gst: 12,
        image:
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800"
    },

    {
        id: 2,
        name: "Apollo Alnac 4G 185/65 R15",
        brand: "Apollo",
        size: "185/65 R15",
        price: 5100,
        stock: 8,
        gst: 12,
        image:
        "https://images.unsplash.com/photo-1515920799746-2a0c2c1a8c8d?w=800"
    },

    {
        id: 3,
        name: "CEAT SecuraDrive 195/55 R16",
        brand: "CEAT",
        size: "195/55 R16",
        price: 5900,
        stock: 5,
        gst: 12,
        image:
        "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800"
    },

    {
        id: 4,
        name: "Bridgestone Turanza 205/55 R16",
        brand: "Bridgestone",
        size: "205/55 R16",
        price: 7800,
        stock: 3,
        gst: 12,
        image:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800"
    },

    {
        id: 5,
        name: "JK Tyre UX Royale 175/65 R14",
        brand: "JK Tyre",
        size: "175/65 R14",
        price: 4200,
        stock: 15,
        gst: 12,
        image:
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800"
    },

    {
        id: 6,
        name: "Yokohama Earth-1 195/60 R15",
        brand: "Yokohama",
        size: "195/60 R15",
        price: 6900,
        stock: 2,
        gst: 12,
        image:
        "https://images.unsplash.com/photo-1504215680853-026ed2a45def?w=800"
    },

    {
        id: 7,
        name: "MRF Zapper 100/90-17",
        brand: "MRF",
        size: "100/90-17",
        price: 2500,
        stock: 7,
        gst: 12,
        image:
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800"
    },

    {
        id: 8,
        name: "Apollo ActiZip 90/90-18",
        brand: "Apollo",
        size: "90/90-18",
        price: 2200,
        stock: 1,
        gst: 12,
        image:
        "https://images.unsplash.com/photo-1558980664-10ea7b2a3c5e?w=800"
    }

];


/* ================= LOCAL STORAGE ================= */

let products =
    JSON.parse(
        localStorage.getItem("rs_products")
    ) || defaultProducts;

let invoices =
    JSON.parse(
        localStorage.getItem("rs_invoices")
    ) || [];

let cart = [];



let shopSettings = {
    shopName: "Radha Swami Tyre Agency",
    mobile: "",
    gstin: "",
    address: "",
    invoicePrefix: "RS",
    invoiceFooter: "Thank you for choosing Radha Swami Tyre Agency."
};

try {
    shopSettings = {
        ...shopSettings,
        ...(JSON.parse(localStorage.getItem("rs_shop_settings")) || {})
    };
} catch (e) {}

function saveShopSettingsData() {
    localStorage.setItem("rs_shop_settings", JSON.stringify(shopSettings));
}



/* ================= SAVE ================= */

function saveProducts() {

    localStorage.setItem(
        "rs_products",
        JSON.stringify(products)
    );

}

function saveInvoices() {

    localStorage.setItem(
        "rs_invoices",
        JSON.stringify(invoices)
    );

}


/* ================= CURRENCY ================= */

function money(value) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2
        }
    ).format(value || 0);

}


/* ================= DATE ================= */

function formatDate(date = new Date()) {

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}

document.getElementById("currentDate").textContent =
    formatDate();


/* ================= PAGE NAVIGATION ================= */

const menuItems =
    document.querySelectorAll(".menu-item");

menuItems.forEach(item => {

    item.addEventListener("click", () => {

        openPage(
            item.dataset.page
        );

    });

});


function openPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove(
                "active-page"
            );

        });


    const page =
        document.getElementById(pageId);

    if (!page) return;

    page.classList.add(
        "active-page"
    );


    menuItems.forEach(item => {

        item.classList.toggle(
            "active",
            item.dataset.page === pageId
        );

    });


    const title =
        page.querySelector("h1");

    document.getElementById(
        "pageTitle"
    ).textContent =
        title ? title.textContent : "Dashboard";


    renderPageData();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* ================= RENDER ALL ================= */

function renderPageData() {

    renderDashboard();

    renderBillingProducts();

    renderCart();

    renderInventory();

    renderCustomers();

    renderInvoices();

    renderReports();

}


/* ================= DASHBOARD ================= */

function renderDashboard() {

    const totalSales =
        invoices.reduce(
            (sum, invoice) =>
                sum + invoice.total,
            0
        );

    document.getElementById(
        "todaySales"
    ).textContent = money(totalSales);


    document.getElementById(
        "todayBills"
    ).textContent =
        invoices.length;


    document.getElementById(
        "totalProducts"
    ).textContent =
        products.length;


    const low =
        products.filter(
            p => p.stock <= 3
        );

    document.getElementById(
        "lowStock"
    ).textContent =
        low.length;


    renderLowStock();

    renderDashboardInvoices();

}


/* ================= LOW STOCK ================= */

function renderLowStock() {

    const container =
        document.getElementById(
            "lowStockList"
        );

    const low =
        products
        .filter(
            p => p.stock <= 3
        )
        .slice(0, 5);


    if (!low.length) {

        container.innerHTML = `
            <div style="
                padding:25px;
                text-align:center;
                color:#94a3b8;
                font-size:12px;
            ">
                No low stock items
            </div>
        `;

        return;

    }


    container.innerHTML =
        low.map(product => `

            <div class="stock-item">

                <img
                    class="stock-image"
                    src="${product.image}"
                    onerror="this.src='https://via.placeholder.com/100?text=Tyre'"
                >

                <div class="stock-info">

                    <strong>
                        ${product.name}
                    </strong>

                    <span>
                        ${product.brand}
                        •
                        ${product.size}
                    </span>

                </div>

                <div class="stock-qty">
                    ${product.stock} left
                </div>

            </div>

        `).join("");

}


/* ================= DASHBOARD INVOICES ================= */

function renderDashboardInvoices() {

    const tbody =
        document.getElementById(
            "dashboardInvoices"
        );


    const latest =
        [...invoices]
        .reverse()
        .slice(0, 5);


    if (!latest.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="6"
                    style="
                        text-align:center;
                        color:#94a3b8;
                        padding:30px;
                    ">
                    No invoices yet
                </td>
            </tr>
        `;

        return;

    }


    tbody.innerHTML =
        latest.map(invoice => `

            <tr>

                <td>
                    <strong>
                        ${invoice.number}
                    </strong>
                </td>

                <td>
                    ${invoice.customer}
                </td>

                <td>
                    ${invoice.vehicle || "-"}
                </td>

                <td>
                    ${invoice.date}
                </td>

                <td>
                    ${money(invoice.total)}
                </td>

                <td>

                    <span class="
                        status
                        ${invoice.payment === "Due"
                            ? "due"
                            : "paid"}
                    ">
                        ${invoice.payment}
                    </span>

                </td>

            </tr>

        `).join("");

}


/* ================= BILLING PRODUCTS ================= */

function renderBillingProducts() {

    const container =
        document.getElementById(
            "billingProducts"
        );


    if (!container) return;


    const query =
        document.getElementById(
            "productSearch"
        )?.value
        .toLowerCase()
        .trim() || "";


    const filtered =
        products.filter(product => {

            const text =
                `
                ${product.name}
                ${product.brand}
                ${product.size}
                `
                .toLowerCase();

            return text.includes(query);

        });


    container.innerHTML =
        filtered.map(product => `

            <div
                class="product-card"
                onclick="addToCart(${product.id})"
            >

                <div class="product-card-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        onerror="
                            this.src='https://via.placeholder.com/400x300?text=TYRE'
                        "
                    >

                    <span class="
                        stock-badge
                        ${product.stock <= 3 ? "low" : ""}
                    ">
                        ${product.stock} in stock
                    </span>

                </div>

                <div class="product-card-body">

                    <h4>
                        ${product.name}
                    </h4>

                    <p>
                        ${product.brand}
                        •
                        ${product.size}
                    </p>

                    <div class="product-price">
                        ${money(product.price)}
                    </div>

                </div>

            </div>

        `).join("");

}


/* ================= ADD TO CART ================= */

function addToCart(id) {

    const product =
        products.find(
            p => p.id === id
        );


    if (!product) return;


    if (product.stock <= 0) {

        alert("Product is out of stock.");

        return;

    }


    const existing =
        cart.find(
            item => item.id === id
        );


    if (existing) {

        if (
            existing.qty >=
            product.stock
        ) {

            alert(
                "Available stock limit reached."
            );

            return;

        }

        existing.qty++;

    } else {

        cart.push({
            id: product.id,
            qty: 1
        });

    }


    renderCart();

}


/* ================= CART ================= */

function renderCart() {

    const tbody =
        document.getElementById(
            "cartTable"
        );

    if (!tbody) return;


    if (!cart.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="6"
                    style="
                        text-align:center;
                        padding:35px;
                        color:#94a3b8;
                    ">
                    No items added.
                    Select a product above.
                </td>
            </tr>
        `;

        calculateBill();

        return;

    }


    tbody.innerHTML =
        cart.map(item => {

            const product =
                products.find(
                    p => p.id === item.id
                );

            const lineSubtotal =
                product.price *
                item.qty;

            const tax =
                lineSubtotal *
                product.gst /
                100;

            const lineTotal =
                lineSubtotal + tax;


            return `

                <tr>

                    <td>

                        <div class="cart-product">

                            <img
                                src="${product.image}"
                                onerror="
                                this.src='https://via.placeholder.com/100?text=Tyre'
                                "
                            >

                            <div>

                                <strong>
                                    ${product.name}
                                </strong>

                                <small>
                                    ${product.size}
                                </small>

                            </div>

                        </div>

                    </td>


                    <td>
                        ${money(product.price)}
                    </td>


                    <td>

                        <div class="qty-control">

                            <button
                                onclick="
                                changeQty(
                                    ${product.id},
                                    -1
                                )
                                "
                            >
                                −
                            </button>

                            <span>
                                ${item.qty}
                            </span>

                            <button
                                onclick="
                                changeQty(
                                    ${product.id},
                                    1
                                )
                                "
                            >
                                +
                            </button>

                        </div>

                    </td>


                    <td>
                        ${product.gst}%
                    </td>


                    <td>
                        <strong>
                            ${money(lineTotal)}
                        </strong>
                    </td>


                    <td>

                        <button
                            class="delete-btn"
                            onclick="
                            removeFromCart(
                                ${product.id}
                            )
                            "
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </td>

                </tr>

            `;

        }).join("");


    calculateBill();

}


/* ================= CHANGE QTY ================= */

function changeQty(id, change) {

    const item =
        cart.find(
            x => x.id === id
        );

    const product =
        products.find(
            x => x.id === id
        );


    if (!item || !product) return;


    item.qty += change;


    if (item.qty <= 0) {

        removeFromCart(id);

        return;

    }


    if (item.qty > product.stock) {

        item.qty =
            product.stock;

    }


    renderCart();

}


/* ================= REMOVE ================= */

function removeFromCart(id) {

    cart =
        cart.filter(
            item => item.id !== id
        );

    renderCart();

}


/* ================= CALCULATE BILL ================= */

function calculateBill() {

    let subtotal = 0;

    let tax = 0;


    cart.forEach(item => {

        const product =
            products.find(
                p => p.id === item.id
            );

        if (!product) return;


        subtotal +=
            product.price *
            item.qty;


        tax +=
            (
                product.price *
                item.qty *
                product.gst
            ) / 100;

    });


    const discount =
        Number(
            document.getElementById(
                "discount"
            )?.value
        ) || 0;


    const taxable =
        Math.max(
            0,
            subtotal - discount
        );


    const averageTax =
        subtotal > 0
        ? tax / subtotal
        : 0;


    const finalTax =
        taxable *
        averageTax;


    const cgst =
        finalTax / 2;


    const sgst =
        finalTax / 2;


    const total =
        taxable +
        finalTax;


    setText(
        "subtotal",
        money(subtotal)
    );

    setText(
        "taxable",
        money(taxable)
    );

    setText(
        "cgst",
        money(cgst)
    );

    setText(
        "sgst",
        money(sgst)
    );

    setText(
        "grandTotal",
        money(total)
    );


    return {
        subtotal,
        discount,
        taxable,
        cgst,
        sgst,
        total
    };

}


/* ================= HELPER ================= */

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent = value;

    }

}


/* ================= PAYMENT ================= */

document
    .querySelectorAll(".payment")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".payment")
                    .forEach(
                        p =>
                            p.classList.remove(
                                "active"
                            )
                    );


                button.classList.add(
                    "active"
                );


                document.getElementById(
                    "paymentMethod"
                ).value =
                    button.dataset.payment;

            }
        );

    });


/* ================= SEARCH ================= */

document
    .getElementById("productSearch")
    ?.addEventListener(
        "input",
        renderBillingProducts
    );


document
    .getElementById("discount")
    ?.addEventListener(
        "input",
        calculateBill
    );


document
    .getElementById("inventorySearch")
    ?.addEventListener(
        "input",
        renderInventory
    );


document
    .getElementById("inventoryFilter")
    ?.addEventListener(
        "change",
        renderInventory
    );


/* ================= INVENTORY ================= */

function renderInventory() {

    const container =
        document.getElementById(
            "inventoryGrid"
        );

    if (!container) return;


    const query =
        document.getElementById(
            "inventorySearch"
        )?.value
        .toLowerCase()
        .trim() || "";


    const filter =
        document.getElementById(
            "inventoryFilter"
        )?.value || "all";


    const filtered =
        products.filter(product => {

            const search =
                `
                ${product.name}
                ${product.brand}
                ${product.size}
                `
                .toLowerCase();


            const matchesSearch =
                search.includes(query);


            let matchesFilter = true;


            if (filter === "low") {

                matchesFilter =
                    product.stock <= 3;

            }


            if (filter === "out") {

                matchesFilter =
                    product.stock <= 0;

            }


            return (
                matchesSearch &&
                matchesFilter
            );

        });


    container.innerHTML =
        filtered.map(product => {

            const percentage =
                Math.min(
                    100,
                    product.stock * 8
                );


            return `

                <div class="inventory-card">

                    <div class="inventory-image">

                        <img
                            src="${product.image}"
                            onerror="
                            this.src='https://via.placeholder.com/500x400?text=TYRE'
                            "
                        >

                    </div>


                    <div class="inventory-body">

                        <h3>
                            ${product.name}
                        </h3>

                        <div class="inventory-brand">
                            ${product.brand}
                            •
                            ${product.size}
                        </div>


                        <div class="inventory-info">

                            <span>
                                Price
                            </span>

                            <strong>
                                ${money(product.price)}
                            </strong>

                        </div>


                        <div class="inventory-info">

                            <span>
                                Stock
                            </span>

                            <strong
                                style="
                                color:
                                ${
                                    product.stock <= 3
                                    ? "#dc2626"
                                    : "#16a34a"
                                };
                                "
                            >
                                ${product.stock} units
                            </strong>

                        </div>


                        <div class="stock-bar">

                            <span
                                class="
                                ${product.stock <= 3
                                    ? "low"
                                    : ""}
                                "
                                style="
                                width:${percentage}%;
                                "
                            ></span>

                        </div>

                    </div>

                </div>

            `;

        }).join("");

}


/* ================= PRODUCT MODAL ================= */

function openProductModal() {

    document
        .getElementById(
            "productModal"
        )
        .classList.add("show");

}


function closeProductModal() {

    document
        .getElementById(
            "productModal"
        )
        .classList.remove("show");

}


/* ================= ADD PRODUCT ================= */

function addProduct() {

    const name =
        document.getElementById(
            "newProductName"
        ).value.trim();


    const brand =
        document.getElementById(
            "newProductBrand"
        ).value.trim();


    const size =
        document.getElementById(
            "newProductSize"
        ).value.trim();


    const price =
        Number(
            document.getElementById(
                "newProductPrice"
            ).value
        );


    const stock =
        Number(
            document.getElementById(
                "newProductStock"
            ).value
        );


    const gst =
        Number(
            document.getElementById(
                "newProductGST"
            ).value
        );


    const image =
        document.getElementById(
            "newProductImage"
        ).value.trim()
        ||
        "https://via.placeholder.com/500x400?text=TYRE";


    if (
        !name ||
        !brand ||
        !size ||
        !price
    ) {

        alert(
            "Please fill all required fields."
        );

        return;

    }


    products.push({

        id: Date.now(),

        name,

        brand,

        size,

        price,

        stock,

        gst,

        image

    });


    saveProducts();

    closeProductModal();

    renderPageData();


    document
        .getElementById(
            "newProductName"
        ).value = "";

    document
        .getElementById(
            "newProductBrand"
        ).value = "";

    document
        .getElementById(
            "newProductSize"
        ).value = "";

    document
        .getElementById(
            "newProductPrice"
        ).value = "";

    document
        .getElementById(
            "newProductStock"
        ).value = "";

    document
        .getElementById(
            "newProductImage"
        ).value = "";


    alert(
        "Product successfully added!"
    );

}


/* ================= GENERATE BILL ================= */

function generateBill() {

    if (!cart.length) {

        alert(
            "Please add at least one product."
        );

        return;

    }


    const customer =
        document.getElementById(
            "customerName"
        ).value.trim();


    if (!customer) {

        alert(
            "Please enter customer name."
        );

        return;

    }


    const calculation =
        calculateBill();


    const payment =
        document.getElementById(
            "paymentMethod"
        ).value;


    const invoice =
        `RS-${String(
            invoices.length + 1
        ).padStart(4, "0")}`;


    const invoiceData = {

        id: Date.now(),

        number: invoice,

        customer,

        mobile:
            document.getElementById(
                "customerMobile"
            ).value.trim(),

        vehicle:
            document.getElementById(
                "vehicleNumber"
            ).value.trim(),

        model:
            document.getElementById(
                "vehicleModel"
            ).value.trim(),

        date:
            formatDate(),

        payment,

        subtotal:
            calculation.subtotal,

        discount:
            calculation.discount,

        cgst:
            calculation.cgst,

        sgst:
            calculation.sgst,

        total:
            calculation.total,

        items:
            cart.map(item => {

                const product =
                    products.find(
                        p =>
                            p.id === item.id
                    );

                return {

                    name:
                        product.name,

                    size:
                        product.size,

                    qty:
                        item.qty,

                    price:
                        product.price,

                    gst:
                        product.gst

                };

            })

    };


    /* REDUCE STOCK */

    cart.forEach(item => {

        const product =
            products.find(
                p =>
                    p.id === item.id
            );

        if (product) {

            product.stock -=
                item.qty;

        }

    });


    invoices.push(
        invoiceData
    );


    saveProducts();

    saveInvoices();


    showInvoice(
        invoiceData
    );


    cart = [];

    renderPageData();

}


/* ================= SHOW INVOICE ================= */

function showInvoice(invoice) {

    document.getElementById(
        "previewInvoice"
    ).textContent =
        invoice.number;


    document.getElementById(
        "previewDate"
    ).textContent =
        invoice.date;


    document.getElementById(
        "previewCustomer"
    ).textContent =
        invoice.customer;


    document.getElementById(
        "previewMobile"
    ).textContent =
        invoice.mobile || "-";



    document.getElementById(
        "previewSubtotal"
    ).textContent =
        money(invoice.subtotal);


    document.getElementById(
        "previewDiscount"
    ).textContent =
        money(invoice.discount);


    document.getElementById(
        "previewCGST"
    ).textContent =
        money(invoice.cgst);


    document.getElementById(
        "previewSGST"
    ).textContent =
        money(invoice.sgst);


    document.getElementById(
        "previewTotal"
    ).textContent =
        money(invoice.total);

    const paymentPreview = document.getElementById("previewPayment");
    if (paymentPreview) paymentPreview.textContent = invoice.payment || "Cash";


    const tbody =
        document.getElementById(
            "previewItems"
        );


    tbody.innerHTML =
        invoice.items.map(
            (item, index) => {

                const subtotal =
                    item.price *
                    item.qty;

                const gst =
                    subtotal *
                    item.gst /
                    100;

                const total =
                    subtotal + gst;


                return `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            ${item.name}
                            <br>
                            <small>
                                ${item.size}
                            </small>
                        </td>

                        <td>
                            ${item.qty}
                        </td>

                        <td>
                            ${money(item.price)}
                        </td>

                        <td>
                            ${item.gst}%
                        </td>

                        <td>
                            ${money(total)}
                        </td>

                    </tr>

                `;

            }
        ).join("");


    const paidEl = document.getElementById("previewPaid");
    const dueEl = document.getElementById("previewDue");
    if (paidEl) paidEl.textContent = money(invoice.paidAmount || 0);
    if (dueEl) dueEl.textContent = money(invoice.balanceDue || Math.max(0, Number(invoice.total || 0) - Number(invoice.paidAmount || 0)));

    document
        .getElementById(
            "invoiceModal"
        )
        .classList.add("show");

}


/* ================= CLOSE INVOICE ================= */

function closeInvoice() {

    document
        .getElementById(
            "invoiceModal"
        )
        .classList.remove("show");

}


/* ================= PRINT ================= */

function printInvoice() {

    const invoiceHTML =
        document.getElementById(
            "invoicePreview"
        ).innerHTML;


    const printWindow =
        window.open(
            "",
            "_blank",
            "width=900,height=700"
        );


    printWindow.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>
                Radha Swami Tyre Agency
            </title>

            <style>

                * {
                    box-sizing:border-box;
                }

                body {
                    font-family:
                    Arial,
                    sans-serif;

                    padding:30px;

                    color:#111827;
                }

                .invoice-top {
                    display:flex;
                    justify-content:space-between;

                    border-bottom:
                    2px solid #111827;

                    padding-bottom:15px;
                }

                .invoice-top h1 {
                    margin:0;
                    font-size:23px;
                }

                .invoice-top h2 {
                    margin:5px 0;
                    color:#2563eb;
                }

                .invoice-meta {
                    display:flex;
                    justify-content:flex-end;
                    gap:50px;
                    padding:15px 0;
                    font-size:11px;
                }

                .invoice-customer {
                    background:#f8fafc;
                    padding:14px;
                    margin-bottom:20px;
                }

                .customer-preview-grid {
                    display:grid;
                    grid-template-columns:
                    repeat(4,1fr);

                    gap:20px;
                }

                .customer-preview-grid span {
                    display:block;
                    color:#64748b;
                    font-size:10px;
                }

                table {
                    width:100%;
                    border-collapse:collapse;
                }

                th {
                    background:#111827;
                    color:white;
                    padding:10px;
                    text-align:left;
                }

                td {
                    padding:10px;
                    border-bottom:
                    1px solid #ddd;
                    font-size:11px;
                }

                .invoice-bottom {
                    display:flex;
                    justify-content:space-between;
                    margin-top:25px;
                }

                .invoice-totals {
                    width:250px;
                }

                .invoice-totals div {
                    display:flex;
                    justify-content:space-between;
                    padding:6px;
                }

                .final {
                    border-top:
                    2px solid #111;
                    font-weight:bold;
                    font-size:14px;
                }

            </style>

        </head>

        <body>

            ${invoiceHTML}

        </body>

        </html>

    `);


    printWindow.document.close();

    printWindow.focus();

    setTimeout(
        () => {

            printWindow.print();

            printWindow.close();

        },
        500
    );

}


/* ================= CLEAR BILL ================= */

function clearBill() {

    if (
        !confirm(
            "Clear current bill?"
        )
    ) return;


    cart = [];

    document.getElementById(
        "customerName"
    ).value = "";

    document.getElementById(
        "customerMobile"
    ).value = "";

    document.getElementById(
        "vehicleNumber"
    ).value = "";

    document.getElementById(
        "vehicleModel"
    ).value = "";

    document.getElementById(
        "discount"
    ).value = 0;


    renderCart();

}


/* ================= CUSTOMERS ================= */

function renderCustomers() {

    const tbody =
        document.getElementById(
            "customerTable"
        );

    if (!tbody) return;


    const customerMap = {};


    invoices.forEach(invoice => {

        const key =
            invoice.mobile ||
            invoice.customer;


        if (!customerMap[key]) {

            customerMap[key] = {

                customer:
                    invoice.customer,

                mobile:
                    invoice.mobile,

                vehicle:
                    invoice.vehicle,

                bills: 0,

                total: 0

            };

        }


        customerMap[key].bills++;

        customerMap[key].total +=
            invoice.total;

    });


    const customers =
        Object.values(
            customerMap
        );


    if (!customers.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5"
                    style="
                    text-align:center;
                    padding:30px;
                    color:#94a3b8;
                    ">
                    No customers yet.
                </td>
            </tr>
        `;

        return;

    }


    tbody.innerHTML =
        customers.map(c => `

            <tr>

                <td>
                    <strong>
                        ${c.customer}
                    </strong>
                </td>

                <td>
                    ${c.mobile || "-"}
                </td>

                <td>
                    ${c.vehicle || "-"}
                </td>

                <td>
                    ${c.bills}
                </td>

                <td>
                    ${money(c.total)}
                </td>

            </tr>

        `).join("");

}


/* ================= INVOICES ================= */

function renderInvoices() {

    const tbody =
        document.getElementById(
            "invoiceTable"
        );

    if (!tbody) return;


    const query =
        document.getElementById(
            "invoiceSearch"
        )?.value
        .toLowerCase()
        .trim() || "";


    const filtered =
        invoices
        .slice()
        .reverse()
        .filter(invoice => {

            return (
                invoice.number
                    .toLowerCase()
                    .includes(query)

                ||

                invoice.customer
                    .toLowerCase()
                    .includes(query)
            );

        });


    if (!filtered.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="7"
                    style="
                    text-align:center;
                    padding:30px;
                    color:#94a3b8;
                    ">
                    No invoices found.
                </td>
            </tr>
        `;

        return;

    }


    tbody.innerHTML =
        filtered.map(invoice => `

            <tr>

                <td>
                    <strong>
                        ${invoice.number}
                    </strong>
                </td>

                <td>
                    ${invoice.customer}
                </td>

                <td>
                    ${invoice.vehicle || "-"}
                </td>

                <td>
                    ${invoice.date}
                </td>

                <td>

                    <span class="
                        status
                        ${
                            invoice.payment === "Due"
                            ? "due"
                            : "paid"
                        }
                    ">
                        ${invoice.payment}
                    </span>

                </td>

                <td>
                    <strong>
                        ${money(invoice.total)}
                    </strong>
                </td>

                <td>

                    <button
                        class="text-btn"
                        onclick="
                        viewInvoice(
                            ${invoice.id}
                        )
                        "
                    >
                        View
                    </button>

                </td>

            </tr>

        `).join("");

}


/* ================= VIEW OLD INVOICE ================= */

function viewInvoice(id) {

    const invoice =
        invoices.find(
            i => i.id === id
        );


    if (!invoice) return;


    showInvoice(invoice);

}


/* ================= INVOICE SEARCH ================= */

document
    .getElementById("invoiceSearch")
    ?.addEventListener(
        "input",
        renderInvoices
    );


/* ================= REPORTS ================= */

function renderReports() {

    const totalSales =
        invoices.reduce(
            (sum, i) =>
                sum + i.total,
            0
        );


    const stockValue =
        products.reduce(
            (sum, p) =>
                sum +
                p.price *
                p.stock,
            0
        );


    const low =
        products.filter(
            p => p.stock <= 3
        ).length;


    const customerCount =
        new Set(
            invoices.map(
                i =>
                    i.mobile ||
                    i.customer
            )
        ).size;


    setText(
        "reportSales",
        money(totalSales)
    );


    setText(
        "reportInvoices",
        invoices.length
    );


    setText(
        "reportStock",
        money(stockValue)
    );


    setText(
        "reportProducts",
        products.length
    );


    setText(
        "reportLowStock",
        low
    );


    setText(
        "reportCustomers",
        customerCount
    );

}


/* ================= MOBILE MENU ================= */

document
    .getElementById("menuToggle")
    ?.addEventListener(
        "click",
        () => {

            document
                .querySelector(
                    ".sidebar"
                )
                .classList.toggle(
                    "open"
                );

        }
    );


/* ================= INVOICE NUMBER ================= */

function updateInvoiceNumber() {

    document.getElementById(
        "invoiceNumber"
    ).textContent =
        `RS-${String(
            invoices.length + 1
        ).padStart(4, "0")}`;

}



/* ================= V3 SETTINGS / PAYMENT / BACKUP ================= */

function renderSettings() {
    const set = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.value = value ?? "";
    };

    set("shopNameSetting", shopSettings.shopName);
    set("shopMobileSetting", shopSettings.mobile);
    set("shopGstinSetting", shopSettings.gstin);
    set("shopAddressSetting", shopSettings.address);
    set("invoicePrefixSetting", shopSettings.invoicePrefix);
    set("invoiceFooterSetting", shopSettings.invoiceFooter);

    const counts = {
        backupProductsCount: products.length,
        backupInvoicesCount: invoices.length,
        backupPurchasesCount: purchases.length,
        backupSuppliersCount: suppliers.length
    };
    Object.entries(counts).forEach(([id, value]) => setText(id, value));
}

function saveShopSettings() {
    shopSettings = {
        shopName: document.getElementById("shopNameSetting")?.value.trim() || "Radha Swami Tyre Agency",
        mobile: document.getElementById("shopMobileSetting")?.value.trim() || "",
        gstin: document.getElementById("shopGstinSetting")?.value.trim() || "",
        address: document.getElementById("shopAddressSetting")?.value.trim() || "",
        invoicePrefix: document.getElementById("invoicePrefixSetting")?.value.trim() || "RS",
        invoiceFooter: document.getElementById("invoiceFooterSetting")?.value.trim() || "Thank you for choosing Radha Swami Tyre Agency."
    };
    saveShopSettingsData();
    updateInvoiceNumber();
    alert("Shop settings save ho gayi.");
    renderSettings();
}

function updateInvoiceNumber() {
    const prefix = shopSettings.invoicePrefix || "RS";
    const next = invoices.length + 1;
    setText("invoiceNumber", `${prefix}-${String(next).padStart(4, "0")}`);
}

function calculatePaymentPreview() {
    const totalText = document.getElementById("grandTotal")?.textContent || "₹0";
    const total = Number(String(totalText).replace(/[^\d.-]/g, "")) || 0;
    const method = document.getElementById("paymentMethod")?.value || "Cash";
    const input = document.getElementById("amountReceived");
    const amount = input?.value === "" ? (method === "Due" ? 0 : total) : Math.max(0, Number(input.value) || 0);
    const due = Math.max(0, total - amount);
    const change = Math.max(0, amount - total);

    setText("receivedPreview", money(amount));
    setText("balancePreview", money(due));
    setText("changePreview", money(change));

    const hint = document.getElementById("paymentHint");
    if (hint) {
        hint.textContent = method === "Due"
            ? "Due selected: amount received defaults to ₹0."
            : "Amount received edit karke balance due / change dekhein.";
    }
}

function setupPaymentPreviewV3() {
    document.querySelectorAll(".payment").forEach(btn => {
        btn.addEventListener("click", () => {
            setTimeout(() => {
                const method = document.getElementById("paymentMethod")?.value || "Cash";
                const total = calculateBill()?.total || 0;
                const input = document.getElementById("amountReceived");
                if (input) input.value = method === "Due" ? 0 : total.toFixed(2);
                calculatePaymentPreview();
            }, 0);
        });
    });

    document.getElementById("amountReceived")?.addEventListener("input", calculatePaymentPreview);
}

function backupData() {
    const data = {
        app: "Radha Swami Tyre Agency Billing",
        version: 3,
        exportedAt: new Date().toISOString(),
        products,
        invoices,
        purchases,
        suppliers,
        shopSettings
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `radha-swami-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function restoreData(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        try {
            const data = JSON.parse(e.target.result);
            if (!data || !Array.isArray(data.products) || !Array.isArray(data.invoices)) {
                throw new Error("Invalid backup");
            }

            if (!confirm("Backup restore karne par current business data replace ho jayega. Continue?")) return;

            products = data.products;
            invoices = data.invoices;
            purchases = Array.isArray(data.purchases) ? data.purchases : [];
            suppliers = Array.isArray(data.suppliers) ? data.suppliers : [];
            shopSettings = {...shopSettings, ...(data.shopSettings || {})};

            saveProducts();
            saveInvoices();
            localStorage.setItem("rs_purchases", JSON.stringify(purchases));
            localStorage.setItem("rs_suppliers", JSON.stringify(suppliers));
            saveShopSettingsData();

            alert("Backup successfully restore ho gaya.");
            location.reload();
        } catch (err) {
            alert("Backup file valid nahi hai.");
        }
    };
    reader.readAsText(file);
}

function clearAllBusinessData() {
    if (!confirm("Saara products, invoices, purchases aur suppliers data delete karna hai?")) return;
    if (!confirm("Ye action undo nahi hoga. Kya aap sure hain?")) return;

    localStorage.removeItem("rs_products");
    localStorage.removeItem("rs_invoices");
    localStorage.removeItem("rs_purchases");
    localStorage.removeItem("rs_suppliers");
    alert("Business data clear ho gaya. Page reload hoga.");
    location.reload();
}

function renderInvoiceShopHeader() {
    const name = shopSettings.shopName || "Radha Swami Tyre Agency";
    document.querySelectorAll(".invoice-shop-name").forEach(el => el.textContent = name);
}


/* ================= INITIALIZE ================= */

function initialize() {

    updateInvoiceNumber();

    renderPageData();

}


/* ================= START ================= */

initialize();

/* =====================================================
   VERSION 2
   PURCHASE / SUPPLIERS / VEHICLES / CUSTOMER LEDGER
===================================================== */

let suppliers =
    JSON.parse(localStorage.getItem("rs_suppliers")) || [
        {
            id: 1,
            name: "ABC Tyres Distributor",
            mobile: "9876543210",
            city: "Azamgarh",
            gstin: ""
        }
    ];

let purchases =
    JSON.parse(localStorage.getItem("rs_purchases")) || [];


/* ---------- DATA NORMALIZATION ---------- */

products = products.map(p => ({
    ...p,
    purchasePrice:
        Number(p.purchasePrice) ||
        Math.round(Number(p.price || 0) * 0.80)
}));

function saveSuppliers() {
    localStorage.setItem("rs_suppliers", JSON.stringify(suppliers));
}

function savePurchases() {
    localStorage.setItem("rs_purchases", JSON.stringify(purchases));
}


/* ---------- NEW MASTER RENDER ---------- */

function renderPageData() {
    renderDashboardV2();
    renderBillingProducts();
    renderCart();
    renderInventory();
    renderCustomers();
    renderInvoices();
    renderReportsV2();
    renderPurchasePage();
    renderSuppliers();
    renderVehicles();
    renderLedger();
    updateInvoiceNumber();
}


/* ---------- DASHBOARD ---------- */

function invoiceDateObject(invoice) {
    if (invoice.createdAt) return new Date(invoice.createdAt);
    return null;
}

function isToday(invoice) {
    const d = invoiceDateObject(invoice);
    if (!d) return invoice.date === formatDate();
    const n = new Date();
    return d.getFullYear() === n.getFullYear() &&
           d.getMonth() === n.getMonth() &&
           d.getDate() === n.getDate();
}

function invoiceProfit(invoice) {
    return (invoice.items || []).reduce((sum, item) => {
        const cost = Number(item.purchasePrice || 0);
        return sum + ((Number(item.price || 0) - cost) * Number(item.qty || 0));
    }, 0) - Number(invoice.discount || 0);
}

function renderDashboardV2() {
    const todayInvoices = invoices.filter(isToday);
    const sales = todayInvoices.reduce((s, i) => s + Number(i.total || 0), 0);
    const low = products.filter(p => Number(p.stock) <= 3);

    setText("todaySales", money(sales));
    setText("todayBills", todayInvoices.length);
    setText("totalProducts", products.length);
    setText("lowStock", low.length);

    const list = document.getElementById("lowStockList");
    if (list) {
        list.innerHTML = low.slice(0, 5).map(p => `
            <div class="stock-item">
                <img class="stock-image" src="${p.image}"
                     onerror="this.src='https://via.placeholder.com/100?text=Tyre'">
                <div class="stock-info">
                    <strong>${p.name}</strong>
                    <span>${p.brand} • ${p.size}</span>
                </div>
                <div class="stock-qty">${p.stock} left</div>
            </div>
        `).join("") || `
            <div style="padding:25px;text-align:center;color:#94a3b8;font-size:12px">
                No low stock items
            </div>`;
    }

    const tbody = document.getElementById("dashboardInvoices");
    if (tbody) {
        const latest = [...invoices].reverse().slice(0, 5);
        tbody.innerHTML = latest.map(i => `
            <tr>
                <td><strong>${i.number}</strong></td>
                <td>${i.customer}</td>
                <td>${i.vehicle || "-"}</td>
                <td>${i.date}</td>
                <td>${money(i.total)}</td>
                <td>
                    <span class="status ${i.payment === "Due" ? "due" : "paid"}">
                        ${i.payment}
                    </span>
                </td>
            </tr>
        `).join("") || `
            <tr><td colspan="6" style="text-align:center;padding:30px;color:#94a3b8">
                No invoices yet
            </td></tr>`;
    }
}


/* ---------- PURCHASE ---------- */

function renderPurchasePage() {
    const supplierSelect = document.getElementById("purchaseSupplier");
    const productSelect = document.getElementById("purchaseProduct");
    if (!supplierSelect || !productSelect) return;

    const currentSupplier = supplierSelect.value;
    const currentProduct = productSelect.value;

    supplierSelect.innerHTML = suppliers.map(s =>
        `<option value="${s.id}">${s.name}</option>`
    ).join("");

    productSelect.innerHTML = products.map(p =>
        `<option value="${p.id}">${p.name} — ${p.size}</option>`
    ).join("");

    if (currentSupplier) supplierSelect.value = currentSupplier;
    if (currentProduct) productSelect.value = currentProduct;

    updatePurchasePreview();

    const tbody = document.getElementById("purchaseTable");
    if (!tbody) return;

    tbody.innerHTML = [...purchases].reverse().map(p => `
        <tr>
            <td>${p.date}</td>
            <td><strong>${p.reference || "-"}</strong></td>
            <td>${p.supplierName}</td>
            <td>${p.productName}</td>
            <td>${p.qty}</td>
            <td>${money(p.rate)}</td>
            <td><strong>${money(p.total)}</strong></td>
            <td><span class="status ${p.payment === "Due" ? "due" : "paid"}">${p.payment}</span></td>
        </tr>
    `).join("") || `
        <tr><td colspan="8" style="text-align:center;padding:30px;color:#94a3b8">
            No purchases recorded yet.
        </td></tr>`;
}

function updatePurchasePreview() {
    const productId = Number(document.getElementById("purchaseProduct")?.value);
    const product = products.find(p => p.id === productId);
    const qty = Number(document.getElementById("purchaseQty")?.value) || 0;
    const rateInput = document.getElementById("purchasePrice");
    if (!product) return;

    if (document.activeElement !== rateInput && (!rateInput.value || Number(rateInput.value) === 0)) {
        rateInput.value = product.purchasePrice || Math.round(product.price * .8);
    }

    const rate = Number(rateInput.value) || 0;
    setText("purchasePreviewTotal", money(qty * rate));
    setText("purchaseCurrentStock", product.stock);
    setText("purchaseAfterStock", Number(product.stock) + qty);
}

function savePurchase() {
    const supplierId = Number(document.getElementById("purchaseSupplier").value);
    const productId = Number(document.getElementById("purchaseProduct").value);
    const qty = Number(document.getElementById("purchaseQty").value);
    const rate = Number(document.getElementById("purchasePrice").value);
    const reference = document.getElementById("purchaseRef").value.trim();
    const payment = document.getElementById("purchasePayment").value;

    const supplier = suppliers.find(s => s.id === supplierId);
    const product = products.find(p => p.id === productId);

    if (!supplier || !product || qty <= 0 || rate <= 0) {
        alert("Supplier, product, quantity aur purchase price sahi bhariye.");
        return;
    }

    product.stock += qty;
    product.purchasePrice = rate;

    purchases.push({
        id: Date.now(),
        date: formatDate(),
        createdAt: new Date().toISOString(),
        reference,
        supplierId,
        supplierName: supplier.name,
        productId,
        productName: product.name,
        qty,
        rate,
        total: qty * rate,
        payment
    });

    saveProducts();
    savePurchases();

    document.getElementById("purchaseQty").value = 1;
    document.getElementById("purchasePrice").value = product.purchasePrice;
    document.getElementById("purchaseRef").value = "";

    renderPageData();
    alert("Purchase successfully added aur stock update ho gaya.");
}


/* ---------- SUPPLIERS ---------- */

function openSupplierModal() {
    document.getElementById("supplierModal")?.classList.add("show");
}

function closeSupplierModal() {
    document.getElementById("supplierModal")?.classList.remove("show");
}

function addSupplier() {
    const name = document.getElementById("supplierName").value.trim();
    const mobile = document.getElementById("supplierMobile").value.trim();
    const city = document.getElementById("supplierCity").value.trim();
    const gstin = document.getElementById("supplierGSTIN").value.trim();

    if (!name) {
        alert("Supplier name enter kijiye.");
        return;
    }

    suppliers.push({
        id: Date.now(),
        name,
        mobile,
        city,
        gstin
    });

    saveSuppliers();
    closeSupplierModal();

    ["supplierName","supplierMobile","supplierCity","supplierGSTIN"]
        .forEach(id => document.getElementById(id).value = "");

    renderPageData();
}

function renderSuppliers() {
    const grid = document.getElementById("supplierGrid");
    if (!grid) return;

    grid.innerHTML = suppliers.map(s => `
        <div class="supplier-card">
            <div class="supplier-avatar">
                <i class="fa-solid fa-truck"></i>
            </div>
            <h3>${s.name}</h3>
            <p><i class="fa-solid fa-phone"></i> ${s.mobile || "-"}</p>
            <p><i class="fa-solid fa-location-dot"></i> ${s.city || "-"}</p>
            <div class="supplier-meta">
                <span>Purchases</span>
                <strong>${purchases.filter(p => p.supplierId === s.id).length}</strong>
            </div>
        </div>
    `).join("") || `
        <div class="panel" style="grid-column:1/-1;text-align:center;color:#94a3b8">
            No suppliers added.
        </div>`;
}


/* ---------- VEHICLES ---------- */

function renderVehicles() {
    const grid = document.getElementById("vehicleGrid");
    if (!grid) return;

    const query = (document.getElementById("vehicleSearch")?.value || "").toLowerCase().trim();
    const map = {};

    invoices.forEach(i => {
        const vehicle = (i.vehicle || "").trim();
        if (!vehicle) return;

        const key = vehicle.toUpperCase();
        if (!map[key]) {
            map[key] = {
                vehicle: key,
                customer: i.customer,
                mobile: i.mobile,
                model: i.model,
                bills: 0,
                total: 0,
                lastDate: i.date
            };
        }

        map[key].bills++;
        map[key].total += Number(i.total || 0);
        map[key].lastDate = i.date;
    });

    const vehicles = Object.values(map).filter(v =>
        v.vehicle.toLowerCase().includes(query) ||
        (v.customer || "").toLowerCase().includes(query)
    );

    grid.innerHTML = vehicles.map(v => `
        <div class="vehicle-card">
            <div class="vehicle-icon">
                <i class="fa-solid fa-car-side"></i>
            </div>
            <h3>${v.vehicle}</h3>
            <p><strong>${v.customer}</strong></p>
            <p>${v.model || "Vehicle model not entered"}</p>
            <p>${v.mobile || "Mobile not entered"}</p>
            <div class="vehicle-meta">
                <span>${v.bills} bill(s)</span>
                <strong>${money(v.total)}</strong>
            </div>
            <div class="vehicle-meta">
                <span>Last visit</span>
                <strong>${v.lastDate}</strong>
            </div>
        </div>
    `).join("") || `
        <div class="panel" style="grid-column:1/-1;text-align:center;color:#94a3b8">
            No vehicle records found.
        </div>`;
}


/* ---------- CUSTOMER LEDGER ---------- */

function getCustomerLedger() {
    const map = {};

    invoices.forEach(i => {
        const key = i.mobile || i.customer;
        if (!map[key]) {
            map[key] = {
                key,
                customer: i.customer,
                mobile: i.mobile,
                vehicle: i.vehicle,
                total: 0,
                paid: 0,
                due: 0
            };
        }

        map[key].total += Number(i.total || 0);

        if (i.payment === "Due") {
            map[key].due += Number(i.total || 0);
        } else if (i.payment === "Partial") {
            map[key].paid += Number(i.paidAmount || 0);
            map[key].due += Math.max(0, Number(i.total || 0) - Number(i.paidAmount || 0));
        } else {
            map[key].paid += Number(i.total || 0);
        }
    });

    return Object.values(map);
}

function renderLedger() {
    const tbody = document.getElementById("ledgerTable");
    if (!tbody) return;

    const rows = getCustomerLedger();
    const dueRows = rows.filter(r => r.due > 0);

    setText("ledgerDueTotal", money(dueRows.reduce((s, r) => s + r.due, 0)));
    setText("ledgerDueCustomers", dueRows.length);

    tbody.innerHTML = dueRows.map(r => `
        <tr>
            <td><strong>${r.customer}</strong></td>
            <td>${r.mobile || "-"}</td>
            <td>${r.vehicle || "-"}</td>
            <td>${money(r.total)}</td>
            <td class="paid-amount">${money(r.paid)}</td>
            <td class="due-amount">${money(r.due)}</td>
            <td>
                <button class="action-btn" onclick="recordLedgerPayment('${String(r.key).replace(/'/g, "\\'")}')">
                    Mark Paid
                </button>
            </td>
        </tr>
    `).join("") || `
        <tr><td colspan="7" style="text-align:center;padding:30px;color:#94a3b8">
            No outstanding customer dues.
        </td></tr>`;
}

function recordLedgerPayment(key) {
    const row = getCustomerLedger().find(r => String(r.key) === String(key));
    if (!row || row.due <= 0) return;

    const amount = Number(prompt(`Payment amount enter karein. Due: ${money(row.due)}`));
    if (!amount || amount <= 0) return;

    let remaining = Math.min(amount, row.due);

    for (const invoice of invoices) {
        const invoiceKey = invoice.mobile || invoice.customer;
        if (String(invoiceKey) !== String(key) || remaining <= 0) continue;
        if (invoice.payment !== "Due" && invoice.payment !== "Partial") continue;

        const alreadyPaid = Number(invoice.paidAmount || 0);
        const invoiceDue = Math.max(0, Number(invoice.total || 0) - alreadyPaid);
        const pay = Math.min(remaining, invoiceDue);

        invoice.paidAmount = alreadyPaid + pay;
        remaining -= pay;

        if (invoice.paidAmount >= Number(invoice.total || 0)) {
            invoice.payment = "Paid";
        } else {
            invoice.payment = "Partial";
        }
    }

    saveInvoices();
    renderPageData();
    alert("Payment ledger me update ho gaya.");
}


/* ---------- SEARCH LISTENERS ---------- */

document.getElementById("purchaseProduct")?.addEventListener("change", () => {
    const product = products.find(p => p.id === Number(document.getElementById("purchaseProduct").value));
    if (product) document.getElementById("purchasePrice").value = product.purchasePrice || Math.round(product.price * .8);
    updatePurchasePreview();
});

document.getElementById("purchaseQty")?.addEventListener("input", updatePurchasePreview);
document.getElementById("purchasePrice")?.addEventListener("input", updatePurchasePreview);
document.getElementById("vehicleSearch")?.addEventListener("input", renderVehicles);


/* ---------- UPGRADE BILL GENERATION ---------- */

function generateBill() {
    if (!cart.length) {
        alert("Please add at least one product.");
        return;
    }

    const customer = document.getElementById("customerName").value.trim();
    if (!customer) {
        alert("Please enter customer name.");
        return;
    }

    const calculation = calculateBill();
    const payment = document.getElementById("paymentMethod").value;
    const invoice = `${shopSettings.invoicePrefix || "RS"}-${String(invoices.length + 1).padStart(4, "0")}`;
    const receivedInput = document.getElementById("amountReceived");
    const enteredReceived = receivedInput && receivedInput.value !== "" ? Number(receivedInput.value) : (payment === "Due" ? 0 : calculation.total);
    const paidAmount = Math.min(Math.max(0, enteredReceived), calculation.total);
    const finalPayment = paidAmount >= calculation.total ? payment : (paidAmount > 0 ? "Partial" : "Due");

    const invoiceData = {
        id: Date.now(),
        number: invoice,
        customer,
        mobile: document.getElementById("customerMobile").value.trim(),
        date: formatDate(),
        createdAt: new Date().toISOString(),
        payment: finalPayment,
        subtotal: calculation.subtotal,
        discount: calculation.discount,
        cgst: calculation.cgst,
        sgst: calculation.sgst,
        total: calculation.total,
        paidAmount,
        balanceDue: Math.max(0, calculation.total - paidAmount),
        change: Math.max(0, enteredReceived - calculation.total),
        profit: 0,
        items: cart.map(item => {
            const product = products.find(p => p.id === item.id);
            const cost = Number(product.purchasePrice || product.price * .8);
            const profit = (product.price - cost) * item.qty;
            return {
                name: product.name,
                size: product.size,
                qty: item.qty,
                price: product.price,
                purchasePrice: cost,
                gst: product.gst,
                profit
            };
        })
    };

    invoiceData.profit =
        invoiceData.items.reduce((s, i) => s + i.profit, 0) -
        Number(invoiceData.discount || 0);

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) product.stock -= item.qty;
    });

    invoices.push(invoiceData);
    saveProducts();
    saveInvoices();

    showInvoice(invoiceData);
    cart = [];
    renderPageData();
}


/* ---------- REPORTS V2 ---------- */

function renderReportsV2() {
    const totalSales = invoices.reduce((s, i) => s + Number(i.total || 0), 0);
    const stockValue = products.reduce((s, p) => s + Number(p.price || 0) * Number(p.stock || 0), 0);
    const profit = invoices.reduce((s, i) => s + invoiceProfit(i), 0);
    const customers = new Set(invoices.map(i => i.mobile || i.customer)).size;
    const low = products.filter(p => Number(p.stock) <= 3).length;

    setText("reportSales", money(totalSales));
    setText("reportInvoices", invoices.length);
    setText("reportStock", money(stockValue));
    setText("reportProducts", products.length);
    setText("reportLowStock", low);
    setText("reportCustomers", customers);

    const reportsPage = document.getElementById("reports");
    if (reportsPage && !document.getElementById("reportProfit")) {
        const card = reportsPage.querySelector(".stats-grid");
        if (card) {
            const el = document.createElement("div");
            el.className = "stat-card";
            el.innerHTML = `
                <div class="stat-icon green">
                    <i class="fa-solid fa-arrow-trend-up"></i>
                </div>
                <div>
                    <span>Estimated Profit</span>
                    <h2 id="reportProfit">${money(profit)}</h2>
                    <small>Based on purchase cost</small>
                </div>`;
            card.appendChild(el);
        }
    } else {
        setText("reportProfit", money(profit));
    }
}


/* ---------- FINAL INITIALIZATION ---------- */

function initialize() {
    products = products.map(p => ({
        ...p,
        purchasePrice: Number(p.purchasePrice) || Math.round(Number(p.price || 0) * .80)
    }));

    saveProducts();
    updateInvoiceNumber();
    renderPageData();
}

initialize();


/* ---------- V3 RENDER HOOKS ---------- */
const _renderPageDataV3 = renderPageData;
renderPageData = function() {
    _renderPageDataV3();
    renderSettings();
    updateInvoiceNumber();
    calculatePaymentPreview();
    renderInvoiceShopHeader();
};

setupPaymentPreviewV3();
renderSettings();
updateInvoiceNumber();
calculatePaymentPreview();


/* ============================================================
   V4 UI CONTROLLER
   ============================================================ */

(function initV4UI(){
    const sidebar = document.getElementById('appSidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    const openBtn = document.getElementById('desktopMenuToggle');
    const mobileBtn = document.getElementById('menuToggle');
    const closeBtn = document.getElementById('sidebarClose');

    function openDrawer(){
        sidebar?.classList.add('open');
        backdrop?.classList.add('show');
        document.body.classList.add('drawer-open');
    }
    function closeDrawer(){
        sidebar?.classList.remove('open');
        backdrop?.classList.remove('show');
        document.body.classList.remove('drawer-open');
    }
    window.openSidebar = openDrawer;
    window.closeSidebar = closeDrawer;

    openBtn?.addEventListener('click', openDrawer);
    mobileBtn?.addEventListener('click', openDrawer);
    closeBtn?.addEventListener('click', closeDrawer);
    backdrop?.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', e=>{
        if(e.key === 'Escape'){
            closeDrawer();
            if(document.getElementById('printSettingsModal')?.classList.contains('show')) closePrintSettings();
            if(document.getElementById('invoiceModal')?.classList.contains('show')) closeInvoice();
            if(document.getElementById('billing')?.classList.contains('billing-popup-active')) closeBillingPopup();
        }
    });

    // Drawer navigation should close smoothly after selecting a page.
    document.querySelectorAll('.menu-item').forEach(item=>{
        item.addEventListener('click', ()=>{
            setTimeout(closeDrawer, 80);
        });
    });
})();

// Replace page navigation so New Billing opens as a professional popup.
const originalOpenPageV4 = openPage;
openPage = function(pageId){
    if(pageId === 'billing'){
        openBillingPopup();
        return;
    }
    const billing = document.getElementById('billing');
    billing?.classList.remove('billing-popup-active','billing-popup-closing');
    originalOpenPageV4(pageId);
    closeSidebar?.();
};
window.openPage = openPage;

function openBillingPopup(){
    const billing = document.getElementById('billing');
    if(!billing) return;
    closeSidebar?.();
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active-page'));
    billing.classList.remove('billing-popup-closing');
    billing.classList.add('active-page','billing-popup-active');
    document.body.classList.add('billing-open');
    const title=document.getElementById('pageTitle');
    if(title) title.textContent='New Bill';
    renderBillingProducts();
    renderCart();
    updateInvoiceNumber();
    calculatePaymentPreview();
    setTimeout(()=>document.getElementById('customerName')?.focus(),260);
}

function closeBillingPopup(){
    const billing=document.getElementById('billing');
    if(!billing || !billing.classList.contains('billing-popup-active')) return;
    billing.classList.add('billing-popup-closing');
    setTimeout(()=>{
        billing.classList.remove('active-page','billing-popup-active','billing-popup-closing');
        document.body.classList.remove('billing-open');
        document.getElementById('dashboard')?.classList.add('active-page');
        const title=document.getElementById('pageTitle');
        if(title) title.textContent='Dashboard';
    },230);
}
window.openBillingPopup=openBillingPopup;
window.closeBillingPopup=closeBillingPopup;

// New invoice generation closes the billing popup and opens the invoice preview.
const originalGenerateBillV4 = generateBill;
generateBill = function(){
    originalGenerateBillV4();
    const invoiceModal=document.getElementById('invoiceModal');
    if(invoiceModal?.classList.contains('show')){
        document.getElementById('billing')?.classList.remove('billing-popup-active');
        document.body.classList.remove('billing-open');
    }
};
window.generateBill=generateBill;

// Print button now opens a proper print settings dialog.
function openPrintSettings(){
    document.getElementById('printSettingsModal')?.classList.add('show');
}
function closePrintSettings(){
    document.getElementById('printSettingsModal')?.classList.remove('show');
}
window.openPrintSettings=openPrintSettings;
window.closePrintSettings=closePrintSettings;

function performRealPrint(){
    const source=document.getElementById('invoicePreview');
    if(!source) return;

    const paper=document.getElementById('printPaperSize')?.value || 'A4';
    const orientation=document.getElementById('printOrientation')?.value || 'portrait';
    const margins=document.getElementById('printMargins')?.value || 'normal';
    const format=document.getElementById('printFormat')?.value || 'professional';

    const size = paper==='80mm' ? '80mm auto' : paper==='A5' ? 'A5' : 'A4';
    const margin = margins==='none' ? '0' : margins==='compact' ? '6mm' : '12mm';
    const width = paper==='80mm' ? '80mm' : paper==='A5' ? '148mm' : '210mm';

    const win=window.open('','_blank','width=1000,height=800');
    if(!win){
        alert('Popup blocked hai. Browser me popups allow karke dobara Print Now dabaiye.');
        return;
    }

    const html=source.innerHTML;
    win.document.open();
    win.document.write(`<!doctype html><html><head><title>${shopSettings.shopName || 'Radha Swami Tyre Agency'} - Invoice</title>
        <style>
        @page{size:${size} ${orientation};margin:${margin};}
        *{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
        html,body{margin:0;padding:0;background:#fff;color:#0f172a;font-family:Inter,Segoe UI,Arial,sans-serif;}
        body{width:${width};margin:0 auto;padding:${paper==='80mm'?'3mm':'0'};}
        .invoice-preview{width:100%!important;max-width:none!important;padding:0!important;box-shadow:none!important;border-radius:0!important;}
        .invoice-top{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #0f172a;padding-bottom:14px;}
        .invoice-top h1{margin:0;font-size:${paper==='80mm'?'18px':'24px'};letter-spacing:.4px;}
        .invoice-top p{margin:4px 0;color:#64748b;font-size:10px;}
        .invoice-shop-meta{font-size:9px!important;color:#475569!important;}
        .invoice-title{font-weight:900;letter-spacing:1px;padding:8px 11px;background:#eff6ff;color:#1d4ed8;border-radius:7px;}
        .invoice-meta{display:flex;justify-content:flex-end;gap:40px;padding:12px 0;font-size:10px;}
        .invoice-meta span,.customer-preview-grid span,.invoice-totals span{display:block;color:#64748b;font-size:9px;}
        .invoice-customer{background:#f8fafc;padding:11px;margin-bottom:16px;}
        .invoice-customer h4{margin:0 0 8px;font-size:11px;}
        .customer-preview-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
        .customer-preview-grid strong{font-size:10px;}
        table{width:100%;border-collapse:collapse;}
        th{background:#0f172a;color:#fff;padding:8px;text-align:left;font-size:9px;}
        td{padding:8px;border-bottom:1px solid #e2e8f0;font-size:9px;vertical-align:top;}
        td small{color:#64748b;}
        .invoice-bottom{display:flex;justify-content:space-between;gap:20px;margin-top:20px;padding-top:14px;border-top:1px solid #e2e8f0;}
        .invoice-note{font-size:10px;max-width:45%;}
        .invoice-note p{margin:6px 0;color:#64748b;}
        .invoice-note small{color:#94a3b8;}
        .invoice-totals{width:250px;max-width:50%;}
        .invoice-totals div{display:flex;justify-content:space-between;padding:5px;font-size:10px;}
        .invoice-totals .final{border-top:2px solid #0f172a;font-weight:800;font-size:13px;padding-top:8px;}
        ${format==='simple'?'.invoice-title{background:#fff;color:#0f172a;border:1px solid #ddd;}.invoice-customer{background:#fff;border:1px solid #ddd;}':''}
        @media print{body{width:${width};}.invoice-buttons{display:none!important;}}
        </style></head><body>${html}</body></html>`);
    win.document.close();
    win.focus();
    closePrintSettings();
    setTimeout(()=>{win.print();},450);
}
window.performRealPrint=performRealPrint;

// Print Invoice button should open settings, not print immediately.
const printButtons=document.querySelectorAll('#invoiceModal button');
printButtons.forEach(btn=>{
    if(btn.textContent.toLowerCase().includes('print invoice')){
        btn.setAttribute('onclick','openPrintSettings()');
    }
});

// Fill invoice shop information from settings.
const oldShowInvoiceV4 = showInvoice;
showInvoice = function(invoice){
    oldShowInvoiceV4(invoice);
    const name=document.getElementById('previewShopName');
    const address=document.getElementById('previewShopAddress');
    const meta=document.getElementById('previewShopMeta');
    if(name) name.textContent=(shopSettings.shopName || 'Radha Swami Tyre Agency').toUpperCase();
    if(address) address.textContent=shopSettings.address || 'Tyre • Wheel • Auto Services';
    if(meta) meta.textContent=[shopSettings.mobile && `Mob: ${shopSettings.mobile}`, shopSettings.gstin && `GSTIN: ${shopSettings.gstin}`].filter(Boolean).join('  •  ');
    const note=document.querySelector('#invoicePreview .invoice-note p');
    if(note) note.textContent=shopSettings.invoiceFooter || 'Thank you for choosing Radha Swami Tyre Agency.';
};
window.showInvoice=showInvoice;


/* ============================================================
   V5 BILLING OVERRIDES
   ============================================================ */

function renderBillingProductSelectV5() {
    const select = document.getElementById("billingProductSelect");
    if (!select) return;

    const current = select.value;
    select.innerHTML = `<option value="">Choose tyre / item</option>` + products.map(p => `
        <option value="${p.id}">
            ${String(p.name || "Item")} • ${p.size || "—"} • MRP ${money(p.price)} • Stock ${p.stock}
        </option>
    `).join("");

    if (products.some(p => String(p.id) === String(current))) select.value = current;
    updateSelectedMRPV5();
}

function updateSelectedMRPV5() {
    const select = document.getElementById("billingProductSelect");
    const out = document.getElementById("selectedProductMRP");
    const product = products.find(p => String(p.id) === String(select?.value));
    if (out) out.textContent = product ? money(product.price) : "₹0.00";
}

function changeBillingQty(delta) {
    const input = document.getElementById("billingProductQty");
    if (!input) return;
    input.value = Math.max(1, (Number(input.value) || 1) + delta);
}

function addSelectedBillingProduct() {
    const select = document.getElementById("billingProductSelect");
    const product = products.find(p => String(p.id) === String(select?.value));
    const qtyInput = document.getElementById("billingProductQty");
    const qty = Math.max(1, Number(qtyInput?.value) || 1);

    if (!product) {
        alert("Pehle saaman select kijiye.");
        return;
    }
    if (qty > Number(product.stock || 0)) {
        alert(`Sirf ${product.stock} item stock mein hai.`);
        return;
    }

    const existing = cart.find(i => i.id === product.id);
    if (existing) {
        if (existing.qty + qty > Number(product.stock || 0)) {
            alert(`Stock limit ${product.stock} hai.`);
            return;
        }
        existing.qty += qty;
    } else {
        cart.push({id: product.id, qty});
    }

    renderCart();
    calculateBill();
    calculatePaymentPreview();
    select.value = "";
    if (qtyInput) qtyInput.value = 1;
    updateSelectedMRPV5();
}

function renderCartV5() {
    const tbody = document.getElementById("cartTable");
    const empty = document.getElementById("emptyBillItems");
    if (!tbody) return;

    if (!cart.length) {
        tbody.innerHTML = "";
        if (empty) empty.style.display = "flex";
        return;
    }

    if (empty) empty.style.display = "none";

    tbody.innerHTML = cart.map(item => {
        const p = products.find(x => x.id === item.id);
        if (!p) return "";
        const amount = Number(p.price) * Number(item.qty);
        return `
            <tr>
                <td>
                    <strong>${p.name}</strong>
                    <small>${p.size || ""}</small>
                </td>
                <td><strong>${money(p.price)}</strong></td>
                <td>${item.qty}</td>
                <td>${p.gst}%</td>
                <td><strong>${money(amount)}</strong></td>
                <td>
                    <button class="remove-item-v5" onclick="removeFromCart(${p.id})" aria-label="Remove item">×</button>
                </td>
            </tr>
        `;
    }).join("");
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCartV5();
    calculateBill();
    calculatePaymentPreview();
}

function clearBillV5() {
    cart = [];
    document.getElementById("customerName").value = "";
    document.getElementById("customerMobile").value = "";
    document.getElementById("discount").value = 0;
    document.getElementById("amountReceived").value = "";
    document.getElementById("billingProductQty").value = 1;
    document.getElementById("billingProductSelect").value = "";
    renderCartV5();
    calculateBill();
    calculatePaymentPreview();
    updateSelectedMRPV5();
}

const _openBillingPopupV5 = openBillingPopup;
openBillingPopup = function() {
    _openBillingPopupV5();
    renderBillingProductSelectV5();
    renderCartV5();
    calculateBill();
    setTimeout(() => document.getElementById("customerName")?.focus(), 280);
};

const _renderCartV5Old = renderCart;
renderCart = function() {
    renderCartV5();
};

const _clearBillV5Old = clearBill;
clearBill = function() {
    clearBillV5();
};

document.getElementById("billingProductSelect")?.addEventListener("change", updateSelectedMRPV5);
document.getElementById("billingProductQty")?.addEventListener("input", () => {
    const el = document.getElementById("billingProductQty");
    if (el && Number(el.value) < 1) el.value = 1;
});


const _showInvoiceV5Old = showInvoice;
showInvoice = function(invoice) {
    _showInvoiceV5Old(invoice);

    const name = document.getElementById("previewShopName");
    const address = document.getElementById("previewShopAddress");
    const meta = document.getElementById("previewShopMeta");
    const footer = document.getElementById("previewFooterText");
    const payment = document.getElementById("previewPayment");

    if (name) name.textContent = (shopSettings.shopName || "RADHA SWAMI TYRE AGENCY").toUpperCase();
    if (address) address.textContent = shopSettings.address || "Parmanpur Tarwa, Azamgarh 276123, UP";
    if (meta) {
        meta.textContent = [
            shopSettings.mobile ? `Mob: ${shopSettings.mobile}` : "",
            shopSettings.gstin ? `GSTIN: ${shopSettings.gstin}` : ""
        ].filter(Boolean).join("  •  ");
    }
    if (footer) footer.textContent = shopSettings.invoiceFooter || "Thank you for choosing Radha Swami Tyre Agency.";
    if (payment) payment.textContent = invoice.payment || "Cash";

    const tbody = document.getElementById("previewItems");
    if (tbody) {
        tbody.innerHTML = invoice.items.map((item, index) => {
            const taxable = Number(item.price) * Number(item.qty);
            const tax = taxable * Number(item.gst || 0) / 100;
            const total = taxable + tax;
            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <strong>${item.name}</strong>
                        <small>${item.size || "Tyre / Item"}</small>
                    </td>
                    <td>${money(item.price)}</td>
                    <td>${item.qty}</td>
                    <td>${item.gst}%</td>
                    <td>${money(taxable)}</td>
                    <td><strong>${money(total)}</strong></td>
                </tr>
            `;
        }).join("");
    }
};
window.showInvoice = showInvoice;

renderBillingProductSelectV5();
renderCartV5();

/* ============================================================
   V6 PRODUCTS CATALOG + QUICK CHECKOUT
   ============================================================ */

const productCatalogV6 = [
    // BIKE TYRES
    {id:101,name:'CEAT Zoom Rad X1 100/90-17',brand:'CEAT',size:'100/90-17',price:2450,stock:9,gst:12,category:'Bike Tyres',image:'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=900'},
    {id:102,name:'MRF Zapper-FS 90/90-18',brand:'MRF',size:'90/90-18',price:2290,stock:11,gst:12,category:'Bike Tyres',image:'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=900'},
    {id:103,name:'Apollo ActiGrip 100/80-17',brand:'Apollo',size:'100/80-17',price:2380,stock:7,gst:12,category:'Bike Tyres',image:'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=900'},
    {id:104,name:'JK Tyre Blaze BR32 90/90-18',brand:'JK Tyre',size:'90/90-18',price:2180,stock:13,gst:12,category:'Bike Tyres',image:'https://images.unsplash.com/photo-1558980664-10ea7b2a3c5e?w=900'},
    {id:105,name:'Yokohama Street 110/70-17',brand:'Yokohama',size:'110/70-17',price:3150,stock:6,gst:12,category:'Bike Tyres',image:'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=900'},
    {id:106,name:'Bridgestone Battlax 100/90-17',brand:'Bridgestone',size:'100/90-17',price:3390,stock:5,gst:12,category:'Bike Tyres',image:'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=900'},
    {id:107,name:'MRF Nylogrip Plus 90/100-10',brand:'MRF',size:'90/100-10',price:1690,stock:14,gst:12,category:'Bike Tyres',image:'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=900'},
    {id:108,name:'CEAT Milaze 80/100-18',brand:'CEAT',size:'80/100-18',price:1850,stock:8,gst:12,category:'Bike Tyres',image:'https://images.unsplash.com/photo-1558980664-10ea7b2a3c5e?w=900'},

    // CAR TYRES
    {id:109,name:'MRF ZVTV 195/65 R15',brand:'MRF',size:'195/65 R15',price:5250,stock:12,gst:12,category:'Car Tyres',image:'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900'},
    {id:110,name:'CEAT SecuraDrive 195/55 R16',brand:'CEAT',size:'195/55 R16',price:5900,stock:7,gst:12,category:'Car Tyres',image:'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=900'},
    {id:111,name:'Apollo Alnac 4G 185/65 R15',brand:'Apollo',size:'185/65 R15',price:5100,stock:8,gst:12,category:'Car Tyres',image:'https://images.unsplash.com/photo-1504215680853-026ed2a45def?w=900'},
    {id:112,name:'Bridgestone Turanza 205/55 R16',brand:'Bridgestone',size:'205/55 R16',price:7800,stock:3,gst:12,category:'Car Tyres',image:'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=900'},
    {id:113,name:'JK Tyre UX Royale 175/65 R14',brand:'JK Tyre',size:'175/65 R14',price:4200,stock:15,gst:12,category:'Car Tyres',image:'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900'},
    {id:114,name:'Yokohama Earth-1 195/60 R15',brand:'Yokohama',size:'195/60 R15',price:6900,stock:5,gst:12,category:'Car Tyres',image:'https://images.unsplash.com/photo-1504215680853-026ed2a45def?w=900'},
    {id:115,name:'Apollo Amazer 4G Life 165/70 R14',brand:'Apollo',size:'165/70 R14',price:3850,stock:10,gst:12,category:'Car Tyres',image:'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900'},
    {id:116,name:'CEAT Fuelsmarrt 185/70 R14',brand:'CEAT',size:'185/70 R14',price:4450,stock:9,gst:12,category:'Car Tyres',image:'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=900'},

    // BIKE BATTERIES
    {id:122,name:'Exide Xplore 12V 4Ah',brand:'Exide',size:'12V • 4Ah',price:1250,stock:12,gst:18,category:'Bike Battery',image:'https://images.unsplash.com/photo-1597007066704-67bf2068d5b2?w=900'},
    {id:123,name:'Amaron Pro Bike Rider 12V 5Ah',brand:'Amaron',size:'12V • 5Ah',price:1390,stock:10,gst:18,category:'Bike Battery',image:'https://images.unsplash.com/photo-1597007066704-67bf2068d5b2?w=900'},
    {id:124,name:'SF Sonic Bike Battery 12V 5Ah',brand:'SF Sonic',size:'12V • 5Ah',price:1190,stock:8,gst:18,category:'Bike Battery',image:'https://images.unsplash.com/photo-1597007066704-67bf2068d5b2?w=900'},
    {id:125,name:'Livguard Bike Battery 12V 4Ah',brand:'Livguard',size:'12V • 4Ah',price:1140,stock:9,gst:18,category:'Bike Battery',image:'https://images.unsplash.com/photo-1597007066704-67bf2068d5b2?w=900'},

    // CAR BATTERIES
    {id:126,name:'Exide Mileage 35Ah',brand:'Exide',size:'12V • 35Ah',price:4450,stock:7,gst:18,category:'Car Battery',image:'https://images.unsplash.com/photo-1597007066704-67bf2068d5b2?w=900'},
    {id:127,name:'Amaron Hi Life 35Ah',brand:'Amaron',size:'12V • 35Ah',price:4650,stock:6,gst:18,category:'Car Battery',image:'https://images.unsplash.com/photo-1597007066704-67bf2068d5b2?w=900'},
    {id:128,name:'SF Sonic Bolt 35Ah',brand:'SF Sonic',size:'12V • 35Ah',price:4250,stock:8,gst:18,category:'Car Battery',image:'https://images.unsplash.com/photo-1597007066704-67bf2068d5b2?w=900'},
    {id:129,name:'Livguard Auto 45Ah',brand:'Livguard',size:'12V • 45Ah',price:4990,stock:5,gst:18,category:'Car Battery',image:'https://images.unsplash.com/photo-1597007066704-67bf2068d5b2?w=900'}
];

// Bring the catalog to the browser without deleting the user's existing products.
(function seedProductCatalogV6(){
    const existingIds = new Set(products.map(p => Number(p.id)));
    let changed = false;
    productCatalogV6.forEach(p => {
        if (!existingIds.has(Number(p.id))) {
            products.push({...p, purchasePrice: Math.round(Number(p.price) * .8)});
            changed = true;
        }
    });
    if (changed) saveProducts();
})();

let selectedProductIdsV6 = new Set();
let activeProductCategoryV6 = 'all';

function productImageFallbackV6(img){
    img.onerror = null;
    img.src = 'https://via.placeholder.com/900x650/eef2f7/64748b?text=Product';
}

function renderProductCatalogV6(){
    const grid = document.getElementById('productCatalogGrid');
    if (!grid) return;

    const query = (document.getElementById('catalogSearch')?.value || '').toLowerCase().trim();
    const list = products.filter(p => {
        const categoryOK = activeProductCategoryV6 === 'all' || p.category === activeProductCategoryV6;
        const text = `${p.name} ${p.brand} ${p.size} ${p.category || ''}`.toLowerCase();
        return categoryOK && (!query || text.includes(query));
    });

    setText('productCatalogCount', list.length);
    setText('selectedProductCountTop', selectedProductIdsV6.size);

    if (!list.length) {
        grid.innerHTML = `<div class="product-empty-v6"><strong>No products found</strong><span>Try another brand, size or category.</span></div>`;
        return;
    }

    grid.innerHTML = list.map(p => {
        const selected = selectedProductIdsV6.has(Number(p.id));
        const stock = Number(p.stock || 0);
        return `
            <article class="product-card-v6 ${selected ? 'selected' : ''} ${stock <= 0 ? 'out-of-stock' : ''}" onclick="toggleProductSelectionV6(${Number(p.id)})">
                <div class="product-image-v6">
                    <img src="${p.image || ''}" alt="${p.name}" onerror="productImageFallbackV6(this)">
                    <span class="product-category-v6">${p.category || 'Product'}</span>
                    ${selected ? `<span class="product-check-v6"><svg viewBox="0 0 24 24"><path d="m6 12 4 4 8-9" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>` : ''}
                    <span class="product-stock-v6 ${stock <= 3 ? 'low' : ''}">${stock > 0 ? stock + ' in stock' : 'Out of stock'}</span>
                </div>
                <div class="product-card-body-v6">
                    <div class="product-brand-v6">${p.brand}</div>
                    <h3>${p.name}</h3>
                    <p>${p.size || 'Standard item'}</p>
                    <div class="product-price-row-v6">
                        <div><small>MRP</small><strong>${money(p.price)}</strong></div>
                        <span>${selected ? 'Selected' : 'Select'}</span>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

function toggleProductSelectionV6(id){
    const product = products.find(p => Number(p.id) === Number(id));
    if (!product) return;
    if (Number(product.stock || 0) <= 0) {
        alert('Ye product abhi stock mein nahi hai.');
        return;
    }
    if (selectedProductIdsV6.has(Number(id))) selectedProductIdsV6.delete(Number(id));
    else selectedProductIdsV6.add(Number(id));
    renderProductCatalogV6();
    renderSelectedProductsDrawerV6();
}

function renderSelectedProductsDrawerV6(){
    const list = document.getElementById('selectedProductsList');
    const count = selectedProductIdsV6.size;
    setText('selectedItemsBadge', count);
    setText('selectedProductCountTop', count);
    setText('selectedDrawerCount', `${count} ${count === 1 ? 'item' : 'items'}`);

    const fab = document.getElementById('selectedItemsFab');
    if (fab) fab.classList.toggle('has-items', count > 0);
    if (!list) return;

    const selected = products.filter(p => selectedProductIdsV6.has(Number(p.id)));
    if (!selected.length) {
        list.innerHTML = `
            <div class="selected-empty-v6">
                <div class="selected-empty-icon-v6"><svg viewBox="0 0 24 24"><path d="M5 5h14v14H5z" fill="none" stroke="currentColor" stroke-width="1.7" rx="2"/><path d="M8 9h8M8 13h6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></div>
                <strong>No product selected</strong>
                <span>Product card par click karke select karein.</span>
            </div>`;
        return;
    }

    list.innerHTML = selected.map(p => `
        <div class="selected-product-row-v6">
            <img src="${p.image || ''}" alt="${p.name}" onerror="productImageFallbackV6(this)">
            <div class="selected-product-info-v6">
                <strong>${p.name}</strong>
                <span>${p.brand} • ${p.size || ''}</span>
                <b>MRP ${money(p.price)}</b>
            </div>
            <button onclick="event.stopPropagation(); toggleProductSelectionV6(${Number(p.id)})" aria-label="Remove selected product">×</button>
        </div>
    `).join('');
}

function openSelectedProductsDrawer(){
    renderSelectedProductsDrawerV6();
    document.getElementById('selectedProductsDrawer')?.classList.add('open');
    document.getElementById('selectedDrawerBackdrop')?.classList.add('show');
    document.getElementById('selectedProductsDrawer')?.setAttribute('aria-hidden','false');
}
function closeSelectedProductsDrawer(){
    document.getElementById('selectedProductsDrawer')?.classList.remove('open');
    document.getElementById('selectedDrawerBackdrop')?.classList.remove('show');
    document.getElementById('selectedProductsDrawer')?.setAttribute('aria-hidden','true');
}
window.openSelectedProductsDrawer = openSelectedProductsDrawer;
window.closeSelectedProductsDrawer = closeSelectedProductsDrawer;

function checkoutSelectedProducts(){
    const selected = products.filter(p => selectedProductIdsV6.has(Number(p.id)) && Number(p.stock || 0) > 0);
    if (!selected.length) {
        alert('Pehle kam se kam ek product select kijiye.');
        return;
    }

    cart = selected.map(p => ({id:p.id, qty:1}));
    closeSelectedProductsDrawer();
    openBillingPopup();
    renderCartV5();
    calculateBill();
    calculatePaymentPreview();
}
window.checkoutSelectedProducts = checkoutSelectedProducts;
window.toggleProductSelectionV6 = toggleProductSelectionV6;

// Keep the product page synchronized with the existing application navigation.
const _openPageV6 = openPage;
openPage = function(pageId){
    _openPageV6(pageId);
    if (pageId === 'products') {
        setTimeout(() => {
            renderProductCatalogV6();
            renderSelectedProductsDrawerV6();
        }, 30);
    }
};
window.openPage = openPage;

// Search + category filters.
document.getElementById('catalogSearch')?.addEventListener('input', renderProductCatalogV6);
document.querySelectorAll('.filter-v6').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-v6').forEach(x => x.classList.remove('active'));
        btn.classList.add('active');
        activeProductCategoryV6 = btn.dataset.category || 'all';
        renderProductCatalogV6();
    });
});

// Robust drawer trigger: explicitly bind the top-left three-line button.
const desktopMenuV6 = document.getElementById('desktopMenuToggle');
if (desktopMenuV6) desktopMenuV6.onclick = () => window.openSidebar?.();
const mobileMenuV6 = document.getElementById('menuToggle');
if (mobileMenuV6) mobileMenuV6.onclick = () => window.openSidebar?.();
const sidebarCloseV6 = document.getElementById('sidebarClose');
if (sidebarCloseV6) sidebarCloseV6.onclick = () => window.closeSidebar?.();

renderProductCatalogV6();
renderSelectedProductsDrawerV6();

/* ================= V7 PRODUCTS PAGE CHECKOUT BRIDGE ================= */
function consumeProductsPageCheckoutV7(){
    const raw=localStorage.getItem("rs_checkout_products_v7");
    if(!raw)return;
    let ids=[];
    try{ids=JSON.parse(raw).map(Number)}catch(e){}
    if(!ids.length)return;
    const available=ids.map(id=>products.find(p=>Number(p.id)===id)).filter(p=>p&&Number(p.stock||0)>0);
    if(available.length)cart=available.map(p=>({id:p.id,qty:1}));
    localStorage.removeItem("rs_checkout_products_v7");
    setTimeout(()=>{
        openBillingPopup();
        renderCartV5();
        calculateBill();
        calculatePaymentPreview();
    },120);
}
window.addEventListener("load",consumeProductsPageCheckoutV7);


/* ============================================================
   V8 PRODUCTS -> BILLING CHECKOUT BRIDGE
   ============================================================ */

function importCheckoutProductsV8(){
    const raw = localStorage.getItem("rs_checkout_products_v8");
    if(!raw) return;

    let incoming = [];
    try { incoming = JSON.parse(raw); } catch(e) { incoming = []; }
    if(!Array.isArray(incoming) || !incoming.length) return;

    // Import every selected catalog item into the billing inventory if it is missing.
    incoming.forEach(item => {
        const id = Number(item.id);
        const existing = products.find(p => Number(p.id) === id);
        if(!existing){
            products.push({
                ...item,
                id,
                purchasePrice: item.purchasePrice || Math.round(Number(item.price || 0) * .80)
            });
        }
    });
    saveProducts();

    // Add all selected products to the bill with quantity 1.
    cart = incoming.map(item => {
        const p = products.find(x => Number(x.id) === Number(item.id));
        return p ? {id:p.id, qty:1} : null;
    }).filter(Boolean);

    localStorage.removeItem("rs_checkout_products_v8");

    // Open the billing desk and make selected products visible in the dropdown.
    setTimeout(() => {
        openBillingPopup();
        renderBillingProductSelectV5();

        const select = document.getElementById("billingProductSelect");
        if(select && cart.length){
            select.value = String(cart[0].id);
            updateSelectedMRPV5();
        }

        renderCartV5();
        calculateBill();
        calculatePaymentPreview();
    }, 180);
}

function markSelectedOptionsV8(){
    const select = document.getElementById("billingProductSelect");
    if(!select) return;
    [...select.options].forEach(opt => {
        const id = Number(opt.value);
        if(id && cart.some(item => Number(item.id) === id)){
            const p = products.find(x => Number(x.id) === id);
            if(p) opt.textContent = `✓ ${p.name} • ${p.size || ""} • MRP ${money(p.price)}`;
        }
    });
}

const _renderBillingProductSelectV8 = renderBillingProductSelectV5;
renderBillingProductSelectV5 = function(){
    _renderBillingProductSelectV8();
    markSelectedOptionsV8();
};

window.addEventListener("load", importCheckoutProductsV8);

document.getElementById("billingProductSelect")?.addEventListener("change", function(){
    updateSelectedMRPV5();
});


/* ============================================================
   V9 FINAL SIDEBAR CONTROL
   Dedicated binding at the very end so no older handler can
   disable the three-line menu.
   ============================================================ */
(function(){
    function bindSidebarV9(){
        const sidebar = document.getElementById("appSidebar");
        const backdrop = document.getElementById("sidebarBackdrop");
        const openButtons = [
            document.getElementById("desktopMenuToggle"),
            document.getElementById("menuToggle")
        ].filter(Boolean);
        const closeButton = document.getElementById("sidebarClose");

        if(!sidebar || !openButtons.length) return;

        const open = (ev) => {
            ev?.preventDefault();
            ev?.stopPropagation();
            sidebar.classList.add("open");
            backdrop?.classList.add("show");
            document.body.classList.add("drawer-open");
            document.body.style.overflow = "hidden";
        };

        const close = (ev) => {
            ev?.preventDefault();
            ev?.stopPropagation();
            sidebar.classList.remove("open");
            backdrop?.classList.remove("show");
            document.body.classList.remove("drawer-open");
            document.body.style.overflow = "";
        };

        openButtons.forEach(btn => {
            btn.onclick = open;
            btn.addEventListener("click", open, true);
        });
        if(closeButton){
            closeButton.onclick = close;
            closeButton.addEventListener("click", close, true);
        }
        backdrop?.addEventListener("click", close, true);

        document.addEventListener("keydown", e => {
            if(e.key === "Escape") close();
        });
    }

    if(document.readyState === "loading"){
        document.addEventListener("DOMContentLoaded", bindSidebarV9);
    }else{
        bindSidebarV9();
    }
})();

/* V9: dedicated billing page for every New Billing navigation */
(function(){
    document.querySelectorAll('.menu-item[data-page="billing"]').forEach(btn=>{
        btn.onclick=function(e){
            e.preventDefault();
            window.location.href="billing.html";
        };
    });
})();

/* V10 fallback: direct drawer API */
window.openRadhaSidebar = function(){
    const s=document.getElementById("appSidebar");
    const b=document.getElementById("sidebarBackdrop");
    if(s) s.classList.add("open");
    if(b) b.classList.add("show");
    document.body.classList.add("drawer-open");
    document.body.style.overflow="hidden";
};
window.closeRadhaSidebar = function(){
    const s=document.getElementById("appSidebar");
    const b=document.getElementById("sidebarBackdrop");
    if(s) s.classList.remove("open");
    if(b) b.classList.remove("show");
    document.body.classList.remove("drawer-open");
    document.body.style.overflow="";
};
