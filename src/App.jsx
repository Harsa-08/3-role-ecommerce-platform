import { useState, useEffect } from "react";
import { useLanguage } from "./Language";
import "./index.css";

function Navbar({ cartCount, role, setPage, setRole, setCart, setBuyNowItem }) {
  const { t } = useLanguage();
  return (
    <nav className="nav">
      <div className="navLinks">
        <div className="nav-left">
          <div className="eshop">ESHOP</div>
          {role === "user" && (
            <>
              <button className="nav-btn blue" onClick={() => { setBuyNowItem(null); setPage("home"); }}>{t("home")}</button>
              <button className="nav-btn blue" onClick={() => setPage("cart")}>{t("cart")}({cartCount})</button>
              <button className="nav-btn blue" onClick={() => setPage("wishlist")}>{t("wishlist")}</button>
              <button className="nav-btn blue" onClick={() => setPage("orders")}>{t("orders")}</button>
              <button className="nav-btn blue" onClick={() => setPage("history")}>{t("history")}</button>
              <button className="nav-btn blue" onClick={() => setPage("profile")}>{t("profile")}</button>
            </>
          )}
          {role === "employee" && (
            <>
              <button className="nav-btn green" onClick={() => setPage("employee")}>{t("dashboard")}</button>
              <button className="nav-btn green" onClick={() => setPage("employeeOrders")}>{t("orders")}</button>
              <button className="nav-btn green" onClick={() => setPage("shipped")}>{t("shipped")}</button>
              <button className="nav-btn green" onClick={() => setPage("deliverHistory")}>{t("deliverHistory")}</button>
              <button className="nav-btn green" onClick={() => setPage("profile")}>{t("profile")}</button>
            </>
          )}
          {role === "admin" && (
            <>
              <button className="nav-btn green" onClick={() => setPage("admin")}>{t("dashboard")}</button>
              <button className="nav-btn green" onClick={() => setPage("employees")}>{t("employees")}</button>
              <button className="nav-btn green" onClick={() => setPage("stock")}>{t("stock")}</button>
              <button className="nav-btn green" onClick={() => setPage("ready")}>{t("readyToShip")}</button>
              <button className="nav-btn green" onClick={() => setPage("salary")}>{t("salary")}</button>
              <button className="nav-btn green" onClick={() => setPage("returns")}>{t("returns")}</button>
              <button className="nav-btn green" onClick={() => setPage("profile")}>{t("profile")}</button>
            </>)}
          {role && (
            <button className="nav-btn red" onClick={() => {
              localStorage.clear();
              setRole(null);
              setPage("auth");
            }}>
              {t("logout")}
            </button>
          )
          }
        </div>
      </div>
    </nav>);
}
function Home({ products, addToCart, addToWishlist, orders, setPage, setSelectedProduct }) {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sort, setSort] = useState("none");
  let filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()) || p.specs.toLowerCase().includes(search.toLowerCase()));
  if (category !== "all") {
    filtered = filtered.filter(p => p.category === category);
  }
  if (priceRange === "low") {
    filtered = filtered.filter(p => p.price < 50000);
  }
  else if (priceRange === "mid") {
    filtered = filtered.filter(p => p.price >= 50000 && p.price <= 100000);
  }
  else if (priceRange === "high") {
    filtered = filtered.filter(p => p.price > 100000);
  }
  filtered = filtered.filter(p => {
    const productReviews = orders?.filter(o => o.name === p.name && o.rating);
    const avg = productReviews.length > 0 ? productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length : 0;
    if (ratingFilter === "4") return avg >= 4;
    if (ratingFilter === "3") return avg >= 3;
    return true;
  });
  if (sort === "low") {
    filtered.sort((a, b) => a.price - b.price);
  }
  else if (sort === "high") {
    filtered.sort((a, b) => b.price - a.price);
  }
  return (
    <div className="container">
      <h2>{t("products")}</h2>
      <input placeholder={t("search")} value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="filter-bar">
        <select onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="mobile">Mobile</option>
          <option value="laptop">Laptop</option>
          <option value="accessory">Accessories</option>
          <option value="footwear">Footwear</option>
          <option value="electronics">Electronics</option>
          <option value="gaming">Gaming</option>
          <option value="wearable">Wearables</option>
          <option value="appliance">Appliances</option>
        </select>
        <select onChange={(e) => setPriceRange(e.target.value)}>
          <option value="all">All Prices</option>
          <option value="low">Below ₹50K</option>
          <option value="mid">₹50K–₹1L</option>
          <option value="high">Above ₹1L</option>
        </select>
        <select onChange={(e) => setRatingFilter(e.target.value)}>
          <option value="all">All Ratings</option>
          <option value="4">4★ & above</option>
          <option value="3">3★ & above</option>
        </select>
        <select onChange={(e) => setSort(e.target.value)}>
          <option value="none">Sort By</option>
          <option value="low">Price Low → High</option>
          <option value="high">Price High → Low</option>
        </select>
      </div>
      <div className="grid">
        {filtered.map((p) => {
          const productReviews = orders?.filter(o => o.name === p.name && o.rating);
          const avg = productReviews.length > 0 ? (productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length).toFixed(1) : t("noRatings");
          return (
            <div key={p.id} className="card" onClick={() => { setSelectedProduct(p); setPage("product"); }} style={{ cursor: "pointer" }}>
              <div style={{ flex: 2 }}>
                <img
                  src={p.image}
                  alt={p.name}
                  className="product-img"
                />
                <h3>{p.name}</h3>
                <p className="price">₹{p.price}</p>
                <p>⭐ {avg}</p>
                {p.stock > 0 && p.stock <= 5 && (
                  <p style={{ color: "orange" }}>⚠️ Low Stock</p>
                )
                }

              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {p.stock === 0 ? (

                  <button className="btn btn-danger" disabled>
                    ❌ Out of Stock
                  </button>
                ) : (
                  <button
                    className="btn btn-blue"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(p);
                    }}
                  >
                    {t("addToCart")}
                  </button>
                )}
                <button
                  className="btn btn-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToWishlist(p);
                  }}
                >
                  {t("wishlist")}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
/* ================= CART ================= */
function Cart({ cart, setCart, placeOrder, userAddress, addToCart, setPage, buyNowItem, setBuyNowItem }) {
  const { t } = useLanguage();
  const [billData, setBillData] = useState(null);
  const [savedItems, setSavedItems] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const activeCart = buyNowItem ? [buyNowItem] : cart;

  const total = activeCart.reduce((s, i) => s + i.price * i.qty, 0);
  const [address, setAddress] = useState(userAddress || "");
  const [paymentMode, setPaymentMode] = useState("");
  const [upi, setUpi] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => { setAddress(userAddress || ""); }, [userAddress]);
  const validateAddress = (addr) => {
    if (!addr) return "Address is required";
    if (addr.length < 15) return "Enter full address (House, Street, City, Pincode)";
    if (!/\d+/.test(addr)) return "Include house/door number";
    if (!/[a-zA-Z]{3,}/.test(addr)) return "Include street or city name";
    if (!/\b\d{6}\b/.test(addr)) return "Enter valid 6-digit pincode";
    if (/^\d+$/.test(addr)) return "Invalid address format";
    return "";
  };
  return (
    <div className="container">
      <h2>{t("cart")}</h2>
      {activeCart.map((item) => (
        <div key={item.id} className="card row">
          {item.name}
          <div className="qty-box">
            <button
              className="qty-btn"
              onClick={() => {
                let updatedCart;

                if (buyNowItem) {
                  // ✅ If Buy Now → remove entire item
                  updatedCart = [];
                  setBuyNowItem(null);   // ✅ EXIT buy now mode
                } else {
                  updatedCart = cart
                    .map(c =>
                      c.id === item.id ? { ...c, qty: c.qty - 1 } : c
                    )
                    .filter(c => c.qty > 0);
                }

                setCart(updatedCart);

                // ✅ If cart empty → go back
                if (updatedCart.length === 0) {
                  setPage("home");
                }
              }}
            >
              −
            </button>

            <span className="qty-value">{item.qty}</span>
            <button
              className="qty-btn"
              onClick={() =>
                setCart(cart.map(c =>
                  c.id === item.id
                    ? c.qty < (c.stock || 0)
                      ? { ...c, qty: c.qty + 1 }
                      : c
                    : c))
              }
            >
              +
            </button>

          </div>
          <span>₹{item.price * item.qty}</span>
          <button
            className="btn"
            onClick={() => {
              setSavedItems([...savedItems, item]);
              setCart(cart.filter(c => c.id !== item.id));
            }}
          >
            Save for later
          </button>
        </div>
      ))}
      <h3>Total: ₹{total}</h3>

      <input placeholder="Enter Coupon" value={coupon} onChange={(e) => setCoupon(e.target.value)} />

      <button className="btn" onClick={() => {
        if (coupon === "WELCOME10") {
          setDiscount(total * 0.1);
        }
        else if (coupon === "SAVE500") {
          setDiscount(500);
        } else {
          alert("Invalid Coupon"); setDiscount(0);
        }
      }
      }>
        Apply Coupon
      </button>

      {discount > 0 && <p style={{ color: "green" }}>Discount: -₹{discount}</p>}{(() => {
        const delivery = total > 500 ? 0 : 50;
        const finalTotal = total - discount + delivery;

        return (
          <>
            <p>Delivery: {delivery === 0 ? "Free" : `₹${delivery}`}</p>
            <h3>Final Total: ₹{finalTotal}</h3>
          </>
        );
      })()}
      {!isEditing ? (
        <div className="card">
          <strong>{t("address")}:</strong>
          <p>{address || t("noAddress")}</p>
          <button className="btn" onClick={() => setIsEditing(true)}>{t("changeAddress")}</button>
        </div>
      ) : (
        <div>
          <input placeholder="Enter delivery address..." value={address} onChange={(e) => {
            const value = e.target.value;
            setAddress(value);
            setError(validateAddress(value));
          }} />
          <button className="btn" onClick={() => setIsEditing(false)}>{t("saveAddress")}</button>
        </div>
      )
      }
      <small style={{ color: "red" }}>{error}</small><br /><br />
      <button className="btn btn-green" onClick={() => {
        const err = validateAddress(address); if (err) { setError(err); return; } setShowPayment(true);
      }}>



        {t("checkout")}</button>{showPayment && (

          <div className="card" style={{ marginTop: "20px" }}>
            <h3>{t("selectPayment")}</h3>
            {/* ✅ PAYMENT OPTIONS */}
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="cod">Cash on Delivery</option>
              <option value="upi">UPI</option>
              <option value="card">Credit/Debit Card</option>
            </select>
            {/* ✅ UPI */}
            {paymentMode === "upi" && (
              <input
                placeholder="Enter UPI ID (example@upi)"
                value={upi}
                onChange={(e) => setUpi(e.target.value)}
              />
            )}
            {/* ✅ CARD */}
            {paymentMode === "card" && (
              <>
                <input
                  placeholder="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
                <input placeholder="Expiry (MM/YY)" />
                <input placeholder="CVV" />
              </>
            )}
            {/* ✅ FINAL PAY BUTTON */}
            <button
              className="btn btn-blue"
              onClick={() => {

                if (!paymentMode) {
                  alert("⚠️ select a payment method");
                  return;
                }

                if (paymentMode === "upi" && !upi.includes("@")) {
                  alert("❌ Invalid UPI ID");
                  return;
                }

                if (paymentMode === "card" && cardNumber.length < 12) {
                  alert("❌ Invalid card number");
                  return;
                }


                // ✅ FIX 1: DEFINE ITEMS
                const itemsToOrder = buyNowItem ? [buyNowItem] : cart;

                // ✅ FIX 2: CALL ONLY ONCE
                placeOrder(address, paymentMode, itemsToOrder);

                // ✅ CLEAN CART PROPERLY
                if (buyNowItem) {
                  setCart([]);
                  // optional (if you pass it down)
                  // setBuyNowItem(null);
                }

                setShowPayment(false);
                setPage("success");

              }}
            >


              {paymentMode === "cod" ? "Place Order" : "Pay Now"}</button>  </div>)}{savedItems.map(item => (

                <div key={item.id} className="card row">
                  {item.name}
                  <button onClick={() => addToCart(item)}>
                    Move to Cart
                  </button>
                </div>
              ))}
    </div>

  );
}
function Wishlist({ wishlist, setWishlist, addToCart }) {
  const { t } = useLanguage();
  return (
    <div className="container">
      <h2>{t("wishlist")}</h2>
      {wishlist.length === 0 &&
        <p>{t("emptyWishlist") || "No items"}</p>}
      {wishlist.map((item, i) => (
        <div key={i} className="card row">
          {item.name}<div>
            <button className="btn btn-blue" onClick={() => addToCart(item)}>{t("moveToCart")}</button>
            <button className="btn btn-blue" onClick={() => setWishlist(wishlist.filter((_, idx) => idx !== i))}>{t("remove")}</button>
          </div>
        </div>
      ))}
    </div>);
}
function Orders({ orders, userEmail, setOrders }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const updateOrderStatus = (id, newStatus) => {
    fetch(`http://localhost:3001/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    }).then(() => fetch("http://localhost:3001/orders")).then(res => res.json()).then(data => setOrders(data));
  }; const { t } = useLanguage(); const handlePrint = (id) => {
    const content = document.getElementById(`bill-${id}`).innerHTML;

    const win = window.open("", "", "width=800,height=600");

    win.document.write(`
    <html>
      <head>
        <title>Invoice</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          h4 { text-align: center; }
          .row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
          }
          button { display: none; } /* ✅ HIDE BUTTON */
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `);

    win.document.close();
    win.print();   // ✅ Opens print dialog
  };
  return (
    <div className="container">
      <h2>{t("orders")}</h2>
      <select onChange={(e) => setStatusFilter(e.target.value)}>

        <option value="all">All</option>
        <option value="Pending">Pending</option>
        <option value="Shipped">Shipped</option>
        <option value="Delivered">Delivered</option>
      </select>
      {orders
        .filter(o => o.userEmail === userEmail)
        .filter(o => o.status !== "Returned")
        .filter(o => statusFilter === "all" || o.status === statusFilter)
        // ✅ ADD THIS SORT
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
        .map(o => (
          <div key={o.id} className="order-card">
            {/* ✅ TOP */}
            <div className="order-header">
              <strong>{o.name}</strong>
              <span className={`status ${o.status.toLowerCase().replace(" ", "")}`}>
                {o.status}
              </span>
            </div>
            {/* ✅ DETAILS */}
            <div className="order-details">
              <p>📅 Date: {o.orderDate || "N/A"}</p>
              <p>
                🚚 {t("expectedDelivery")}:{" "}
                {o.expectedDelivery
                  ? new Date(o.expectedDelivery).toDateString()
                  : "N/A"}
              </p>

              <p>📦 Qty: {o.quantity}</p>
              <p>💰 Price: ₹{o.price * o.quantity}</p>
              <p>📍 Address: {o.address}</p>
              {(() => {
                const delivery = new Date(o.expectedDelivery);
                const today = new Date();

                const diff = Math.ceil((delivery - today) / (1000 * 60 * 60 * 24));

                return (<p>🚚 Delivery:{" "}{diff <= 0 ? t("delivered") : diff === 1 ? t("arrivingTomorrow") : `${t("arrivingIn")} ${diff} ${t("days")}`}</p>);
              })()}

            </div>
            {o.invoice && (
              <>
                {o.invoice.paymentMode === "cod" && o.status !== "Delivered" ? (
                  <div className="card" style={{ marginTop: "10px" }}>
                    <strong>💰 {t("payOnDelivery")}</strong>
                    <p>{t("totalAmount")}: ₹{o.invoice.total}</p>
                  </div>
                ) : (

                  <div
                    className="card"
                    id={`bill-${o.id}`}
                    style={{
                      marginTop: "10px",
                      background: "#fff",
                      border: "1px solid #ddd",
                      padding: "15px"
                    }}
                  >
                    {/* ✅ COMPANY HEADER */}
                    <h3 style={{ textAlign: "center" }}>🧾 ESHOP Invoice</h3>
                    <p style={{ textAlign: "center", fontSize: "14px" }}>
                      ESHOP Pvt Ltd, Chennai <br />
                      GST: 22AAAAA0000A1Z5
                    </p>
                    <hr />

                    {/* ✅ CUSTOMER DETAILS */}

                    <p><strong>Name:</strong> {o.userName}</p>
                    <p><strong>Email:</strong> {o.userEmail}</p>
                    <p><strong>Address:</strong> {o.address}</p>

                    <hr />

                    {/* ✅ ORDER DETAILS */}

                    <p><strong>Order ID:</strong> {o.id}</p>
                    <p><strong>Order Date:</strong> {o.orderDate}</p>
                    <p><strong>Payment Mode:</strong> {o.invoice.paymentMode.toUpperCase()}</p>
                    <p>
                      <strong>Delivery Date:</strong>{" "}
                      {o.expectedDelivery
                        ? new Date(o.expectedDelivery).toDateString()
                        : "N/A"}
                    </p>

                    <hr />

                    {/* ✅ ITEM TABLE */}

                    <div className="row">
                      <strong>Product</strong>
                      <strong>Qty</strong>
                      <strong>Price</strong>
                      <strong>Total</strong>
                    </div>

                    <div className="row">
                      <span>{o.name}</span>
                      <span>{o.quantity}</span>
                      <span>₹{o.price}</span>
                      <span>₹{o.price * o.quantity}</span>
                    </div>

                    <hr />

                    {/* ✅ PRICE BREAKDOWN */}{(() => {
                      const subtotal = o.price * o.quantity;
                      const delivery = subtotal > 500 ? 0 : 50;
                      const tax = Math.round(subtotal * 0.18);
                      const total = subtotal + delivery + tax;

                      return (
                        <>
                          <p>Subtotal: ₹{subtotal}</p>
                          <p>Delivery: {delivery === 0 ? "Free" : `₹${delivery}`}</p>
                          <p>GST (18%): ₹{tax}</p>
                          <hr />
                          <h3>Total: ₹{total}</h3>
                        </>
                      );

                    })()}

                    <p style={{ textAlign: "center", marginTop: "10px" }}>
                      Thank you for shopping with ESHOP
                    </p>

                    {/* ✅ PRINT BUTTON */}
                    <button className="btn btn-green" onClick={() => handlePrint(o.id)}>🖨 Print / Download Invoice</button>
                  </div>

                )}</>)}{o.deliveryPerson && (

                  <p>
                    🚚 {o.status === "Delivered"
                      ? "Delivered by"
                      : "Delivery assigned to"}: {o.deliveryPerson}
                  </p>
                )}
            {o.pickupPerson && (
              <p>📦 Pickup by: {o.pickupPerson}</p>
            )}
            {/* ✅ TIMELINE */}
            <div className="timeline">
              <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                {/* ✅ CANCEL BUTTON */}
                {o.status === "Pending" && (
                  <button
                    className="btn btn-danger"
                    onClick={() => updateOrderStatus(o.id, "Cancelled")}
                  >
                    {t("cancelOrder")}
                  </button>
                )}
                {/* ✅ RETURN BUTTON */}
                {o.status === "Delivered" && (
                  <div style={{ marginTop: "10px" }}>

                    {/* ✅ DELIVERY RATING */}
                    <input
                      type="number"
                      min="1"
                      max="5"
                      placeholder="Rate Delivery (1-5)"
                      value={o.deliveryRating || ""}
                      onChange={(e) => {
                        const rating = Number(e.target.value);

                        // ✅ update backend
                        fetch(`http://localhost:3001/orders/${o.id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            deliveryRating: rating
                          })
                        });

                        // ✅ update UI immediately
                        const updated = orders.map(item =>
                          item.id === o.id
                            ? { ...item, deliveryRating: rating }
                            : item
                        );
                        setOrders(updated);
                      }}
                    />

                    <br /><br />

                    {/* ✅ RETURN BUTTON */}
                    {(() => {
                      if (!o.orderDate) return null;

                      let orderDate;

                      if (typeof o.orderDate === "string" && o.orderDate.includes("/")) {
                        const [day, month, year] = o.orderDate.split("/");
                        orderDate = new Date(year, month - 1, day);
                      } else {
                        orderDate = new Date(o.orderDate);
                      }

                      const today = new Date();
                      const daysDiff = (today - orderDate) / (1000 * 60 * 60 * 24);

                      if (!isNaN(daysDiff) && daysDiff <= 30) {
                        return (
                          <button
                            className="btn btn-blue"
                            onClick={() => updateOrderStatus(o.id, "Return Requested")}
                          >
                            Return Product
                          </button>
                        );
                      }

                      return <span style={{ color: "gray" }}>Return expired</span>;
                    })()}

                  </div>
                )}
              </div>
              {o.timeline?.map((t, i) => (
                <div key={i} className={`step ${t.done ? "done" : ""}`}>
                  {t.step}
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
function OrderHistory({ orders, setOrders, userEmail }) {
  const { t } = useLanguage();
  return (
    <div className="container">
      <h2>{t("history")}</h2>
      {orders
        .filter(o => o.userEmail === userEmail)
        .filter(o => o.status === "Delivered").length === 0 && (
          <p>{t("noDelivered")}</p>
        )}
      {orders
        .filter(o => o.userEmail === userEmail)
        .filter(o =>
          o.status === "Delivered" ||
          o.status === "Returned" ||
          o.status === "Return Requested"
        )
        // ✅ ADD SORT HERE TOO
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
        .map((o, i) => (
          <div key={i} className="card">
            <strong>{o.name}</strong>
            {o.status === "Delivered" && "✅ Delivered"}
            {o.status === "Return Requested" && "🔁 Return Requested"}
            {o.status === "Returned" && "↩ Returned"}
            {o.status === "Return Approved" && "✅ Return Approved"}
            {o.status === "Return Rejected" && "❌ Return Rejected"}
            {o.status === "Pickup Assigned" && "📦 Pickup Assigned"}
            {o.status === "Returned" && "↩ Returned"}
            <br />
            <small>Qty: {o.quantity}</small>
            <small>{o.address}</small>
            {(() => {
              if (!o.expectedDelivery) return null;

              const delivery = new Date(o.expectedDelivery); const today = new Date();

              const diff = Math.ceil((delivery - today) / (1000 * 60 * 60 * 24));

              return (
                <p>🚚 Delivery:{" "}{diff <= 0 ? "Delivered" : diff === 1 ? "Arriving Tomorrow" : `Arriving in ${diff} days`}</p>
              );
            })()}

            {/* ✅ REVIEW SECTION */}
            {o.review ? (
              <div>
                ⭐ {o.rating}/5
                <br />
                <i>{o.review}</i>
                {/* ✅ EDIT BUTTON */}
                <br />
                <button
                  className="btn"
                  onClick={() => {
                    // ✅ SAVE CHANGE TO DB
                    fetch(`http://localhost:3001/orders/${o.id}`, {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify({
                        review: "",
                        rating: 0
                      })
                    });
                    // ✅ UPDATE UI
                    const updated = orders.map(item =>
                      item.id === o.id
                        ? { ...item, review: "", rating: 0 }
                        : item
                    );
                    setOrders(updated);
                  }}
                >
                  {t("editReview")}
                </button>
              </div>

            ) : (
              <div>
                <input value={o.tempReview || ""} placeholder="Write review..." onChange={(e) => {
                  const updated = orders.map(item => item.id === o.id ? { ...item, tempReview: e.target.value } : item);
                  setOrders(updated);
                }} />
                <input type="number" min="1" max="5" value={o.tempRating || ""} placeholder="Rating" onChange={(e) => {
                  const updated = orders.map(item => item.id === o.id ? { ...item, tempRating: e.target.value } : item);
                  setOrders(updated);
                }} />
                <button className="btn btn-green" onClick={() => {
                  const updatedOrder = { ...o, review: o.tempReview, rating: Number(o.tempRating), reviewBy: o.userName || "User" };

                  fetch(`http://localhost:3001/orders/${o.id}`, {
                    method: "PATCH", // ✅ IMPORTANT CHANGE
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ review: o.tempReview, rating: Number(o.tempRating), reviewBy: o.userName || "User" })
                  });
                  const updated = orders.map(item => item.id === o.id ? { ...updatedOrder, tempReview: "", tempRating: "" } : item);
                  setOrders(updated);
                  alert("✅ Review added!");
                }}>
                  {t("submitReview")}
                </button>
              </div>
            )}

          </div>
        ))}
    </div>
  );
}
function ProductPage({ product, orders, addToCart, addToWishlist, setPage, setBuyNowItem }) {
  const { t } = useLanguage();
  if (!product) return <div className="container">No product selected</div>;
  const reviews = orders.filter(o => o.name === product.name && o.review);
  const avg =
    reviews.length > 0
      ? (
        reviews.reduce((s, r) => s + r.rating, 0) /
        reviews.length
      ).toFixed(1)
      : t("noRatings")
    ;
  return (
    <div className="container">
      <img
        src={product.image}
        alt={product.name}
        className="product-detail-img"
      />
      <h2>{product.name}</h2>
      <p><strong>{t("price")}</strong> ₹{product.price}</p>
      <p>
        <strong>Stock:</strong>{" "}
        {product.stock === 0 ? (
          <span style={{ color: "red" }}>Out of Stock</span>
        ) : (
          product.stock
        )}
      </p>
      <p><strong>{t("specs")}:</strong> {product.specs}</p>
      <p><strong>{t("rating")}:</strong> ⭐ {avg}</p>
      {/* ✅ BUTTONS */}
      <div style={{ display: "flex", gap: "10px" }}>

        {/* ✅ ADD TO CART */}
        <button className="btn btn-blue" onClick={() => addToCart(product)}>{t("addToCart")}</button>

        {/* ✅ BUY NOW */}
        <button className="btn btn-green" onClick={() => { setBuyNowItem({ ...product, qty: 1 }); setPage("cart"); }}>⚡ Buy Now</button>

        {/* ✅ WISHLIST */}
        <button className="btn btn-danger" onClick={() => addToWishlist(product)}>{t("wishlist")}</button>

      </div>

      {/* ✅ REVIEWS */}
      <h3 style={{ marginTop: "20px" }}>{t("reviews")}</h3>
      {reviews.length === 0 && <p>{t("noReviews")}</p>}
      {reviews.map((r, idx) => (
        <div key={idx} className="card">
          ⭐ {r.rating}/5
          <br />
          <strong>{r.reviewBy || "User"}</strong>  {/* ✅ SHOW NAME */}
          <br />
          {r.review}
        </div>

      ))}</div>);
}
function Profile({ role, userData, orders = [] }) {
  const { t } = useLanguage();
  const [phone, setPhone] = useState(userData.phone || "");
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(userData.name);
  const [email, setEmail] = useState(userData.email);
  const [dob, setDob] = useState(userData.dob);
  const [address, setAddress] = useState(userData.address || "");

  const userOrders = orders.filter(o => o.userEmail === userData.email);

  const totalOrders = userOrders.length;
  const totalSpent = userOrders.reduce(
    (sum, o) => sum + o.price * o.quantity,
    0
  );

  if (!userData) return <div className="container">Loading...</div>;

  return (
    <div className="container">

      {/* ✅ PROFILE HEADER */}
      <div className="profile-card">

        {/* ✅ AVATAR */}
        <div className="avatar">
          {name.charAt(0).toUpperCase()}
        </div>

        {!editing ? (
          <>
            <h2>{name}</h2>
            <p>{userData.email}</p>

            <button className="btn btn-blue" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          </>
        ) : (
          <>

            <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
            <input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
            <input placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <button className="btn btn-green" onClick={() => {
              fetch(`http://localhost:3001/users/${userData.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, dob, address, phone })
              });

              const updatedUser = {
                ...userData,
                name,
                email,
                dob,
                address,
                phone
              };
              localStorage.setItem("userData", JSON.stringify(updatedUser));
              setEditing(false);
            }}>Save</button>
          </>
        )}
      </div>

      {/* ✅ INFO SECTION */}
      <div className="grid">

        <div className="card">
          <strong>Email</strong>
          <p>{userData.email}</p>
        </div>

        <div className="card">
          <strong>Date of Birth</strong>
          <p>{userData.dob}</p>
        </div>

        <div className="card">
          <strong>Address</strong>
          <p>{address || "Not set"}</p>
        </div>

        <div className="card">
          <strong>Role</strong>
          <p>{role}</p>
        </div>

      </div>

      {/* ✅ USER STATS */}
      <h3 style={{ marginTop: "20px" }}>Your Activity</h3>
      <div className="grid">

        <div className="card">
          Orders<br />
          <strong>{totalOrders}</strong>
        </div>

        <div className="card">
          Total Spent<br />
          <strong>₹{totalSpent}</strong>
        </div>

      </div>

      {/* ✅ PASSWORD CHANGE */}

      <div className="card" style={{ marginTop: "20px" }}>
        <h3>Security</h3>

        <button className="btn btn-danger" onClick={() => setShowPasswordChange(!showPasswordChange)}>Change Password</button>

        {/* ✅ PASSWORD FORM (VISIBLE ON CLICK) */}{showPasswordChange && (<div style={{ marginTop: "15px" }}>

          <input
            type="password"
            placeholder="Enter current password"
            value={currentPass}
            onChange={(e) => setCurrentPass(e.target.value)}
          />

          <br /><br />

          <input
            type="password"
            placeholder="Enter new password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />

          <br /><br />

          <button
            className="btn btn-green"
            onClick={() => {

              // ✅ check current password
              if (currentPass !== userData.password) {
                alert("❌ Incorrect current password");
                return;
              }

              // ✅ validate new password
              if (newPass.length < 6) {
                alert("❌ Minimum 6 characters required");
                return;
              }

              if (!/[A-Z]/.test(newPass) || !/[0-9]/.test(newPass)) {
                alert("❌ Must include uppercase & number");
                return;
              }

              // ✅ update backend
              fetch(`http://localhost:3001/users/${userData.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: newPass })
              });

              // ✅ update frontend
              const updatedUser = { ...userData, password: newPass };
              localStorage.setItem("userData", JSON.stringify(updatedUser));

              alert("✅ Password updated");

              // ✅ reset UI
              setCurrentPass("");
              setNewPass("");
              setShowPasswordChange(false);
            }}
          >
            Update Password
          </button>

          {/* ✅ CANCEL */}
          <button
            className="btn"
            style={{ marginLeft: "10px" }}
            onClick={() => {
              setShowPasswordChange(false);
              setCurrentPass("");
              setNewPass("");
            }}
          >
            Cancel
          </button>

        </div>

        )}

      </div>

    </div>
  );

}

function PaymentSuccess() {
  const { t } = useLanguage();   // ✅ ADD THIS
  return (
    <div className="container">
      <h2>✅ Order Confirmed</h2>
      <p>Your order has been placed successfully</p>
      <p>Check Orders page for tracking</p>
    </div>
  );
}
/* ================= EMPLOYEE ================= */
function EmployeeDashboard({ orders, userData }) {
  const { t } = useLanguage();
  const myOrders = orders.filter(o => o.deliveryPerson === userData?.name);

  const pending = myOrders.filter(o => o.status === "Pending").length;
  const shipped = myOrders.filter(o => o.status === "Shipped").length;

  const deliveredCount = myOrders.filter(o => o.status === "Delivered").length;

  const successRate = myOrders.length > 0 ? Math.round((deliveredCount / myOrders.length) * 100) : 0;
  const performance = successRate > 80 ? "Excellent" : successRate > 60 ? "Good" : "Needs Improvement";
  const today = new Date().toDateString();

  const todayDeliveries = orders.filter(o => o.deliveryPerson === userData?.name && new Date(o.orderDate).toDateString() === today && o.status === "Delivered");
  const todayCount = todayDeliveries.length;

  const todayEarnings = todayDeliveries.length * 50;

  const ratedOrders = myOrders.filter(o => o.deliveryRating);

  const avgRating = ratedOrders.length > 0 ? (ratedOrders.reduce((s, o) => s + o.deliveryRating, 0) / ratedOrders.length).toFixed(1) : 0;
  const delivered = orders.filter(o => o.status === "Delivered").length;
  const earnings = orders.filter(o => o.deliveryPerson === userData?.name && o.status === "Delivered").reduce((sum, o) => sum + 50, 0);

  return (
    <div className="container">
      <h2>{t("employeeDashboard")}</h2>
      {/* ✅ ORDER STATS */}
      <div className="grid">
        <div className="card">

          Earnings<br />
          <strong>₹{earnings}</strong>

        </div>
        <div className="card">
          Success Rate<br />
          <strong>{successRate}%</strong>
        </div>

        <div className="card">
          Today Earnings<br />
          <strong>₹{todayEarnings}</strong>
        </div>
        <div className="card">
          Today Deliveries<br />
          <strong>{todayCount}</strong>
        </div>

        <div className="card">
          Performance<br />
          <strong>{performance}</strong>
        </div>
        <div className="card">
          Rating<br />
          <strong
            style={{
              color:
                avgRating >= 4
                  ? "green"
                  : avgRating >= 3
                    ? "orange"
                    : "red"
            }}
          >
            ⭐ {avgRating}
          </strong>
        </div>
        <div className="card">{t("total")}<br /><strong>{orders.length}</strong></div>
        <div className="card">{t("pending")}<br /><strong>{pending}</strong></div>
        <div className="card">{t("shipped")}<br /><strong>{shipped}</strong></div>
        <div className="card">{t("delivered")}<br /><strong>{delivered}</strong></div>

      </div>
      {/* ✅ RECENT ORDERS */}
      <h3 style={{ marginTop: "30px" }}>{t("recentOrders")}</h3>
      {orders.slice(-5).map((o, i) => (
        <div key={o.id} className="card row">
          <span>{o.name}</span>
          <span className={`status ${o.status.toLowerCase().replace(" ", "")}`}>
            {o.status}
          </span>
        </div>
      ))}
    </div>
  );
}

function EmployeeOrders({ orders, setOrders, userData }) {
  const { t } = useLanguage();
  const update = (id, status, extra = {}) => {
    const updatedData = { status, ...extra };
    fetch(`http://localhost:3001/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData)
    })
      .then(() => fetch("http://localhost:3001/orders"))
      .then(res => res.json())
      .then(data => setOrders(data));
  };

  return (
    <div className="container">
      <h2>{t("orderManagement")}</h2>
      {/* ✅ AVAILABLE RETURN JOBS */}
      {orders.filter(o => o.status === "Return Approved" && !o.pickupAssignedTo).map(o => (
        <div key={o.id} className="card row">
          <div>
            <strong>{o.name}</strong><br />
            <small>Pickup Available</small>
          </div>
          <button className="btn btn-blue" onClick={() => update(o.id, "Pickup Assigned", { pickupPerson: userData.name })}>
            Accept Job
          </button>
        </div>
      ))}

      {/* ✅ AVAILABLE DELIVERY JOBS */}
      {orders.filter(o => o.status === "Shipped" && !o.deliveryPerson).map(o => (
        <div key={o.id} className="card row">
          <div>
            <strong>{o.name}</strong><br />
            <small>Customer: {o.userName}</small><br />
            <small>Address: {o.address}</small>
          </div>
          <button className="btn btn-blue" onClick={() => {
            if (o.deliveryPerson) {
              alert("Already assigned");
              return;
            }
            update(o.id, "Out for Delivery", {
              deliveryPerson: userData.name,
              deliveryId: userData.employeeId
            });
          }}>
            Accept Delivery
          </button>
          <button className="btn btn-danger" onClick={() => update(o.id, "Shipped", { deliveryPerson: null })}>
            Reject
          </button>
        </div>
      ))}

      <h3 style={{ marginTop: "20px" }}>My Delivery Jobs</h3>
      {orders.filter(o => o.deliveryPerson === userData.name && o.status === "Out for Delivery").map(o => (
        <div key={o.id} className="card row">
          <strong>{o.name}</strong>
          <span>Assigned to you</span>
        </div>
      ))}

      {/* ✅ ASSIGNED TO ME */}
      {orders.filter(o => o.status === "Pickup Assigned" && o.pickupPerson === userData.name).map(o => (
        <div key={o.id} className="card row">
          <div>
            <strong>{o.name}</strong><br />
            <small>Assigned Pickup</small>
          </div>
          <button className="btn btn-green" onClick={() => update(o.id, "Returned")}>
            Package Retrieved
          </button>
        </div>
      ))}
      <DeliveryGraph orders={orders} userData={userData} />
    </div>
  );
}

function ShippedOrders({ orders, setOrders, userData }) {
  const { t } = useLanguage();
  const deliver = (id) => {
    fetch(`http://localhost:3001/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "Delivered",
        timeline: [
          { step: "Ordered", done: true },
          { step: "Shipped", done: true },
          { step: "Delivered", done: true }
        ]
      })
    });
    setOrders(orders.map(o => o.id === id ? { ...o, status: "Delivered" } : o));
  };

  return (
    <div className="container">
      <h2>{t("shippedOrders")}</h2>
      {orders.filter(o => o.status === "Out for Delivery" && o.deliveryPerson === userData.name).map(o => (
        <div key={o.id} className="card">
          <strong>{o.name}</strong><br />
          <small>Qty: {o.quantity}</small><br />
          <small>Customer: {o.userName}</small><br />
          <small>Phone: {o.phone || "N/A"}</small><br />
          <small>Address: {o.address}</small><br />
          <button onClick={() => {
            if (!window.confirm("Confirm delivery?")) return;
            deliver(o.id);
          }}>{t("deliver")}</button>
        </div>
      ))}
    </div>
  );
}

function DeliverHistory({ orders, userData }) {
  const { t } = useLanguage();
  return (
    <div className="container">
      <h2>{t("deliverHistory")}</h2>
      {orders.filter(o => o.status === "Delivered" && o.deliveryPerson === userData.name).length === 0 && (
        <p>{t("noDelivered")}</p>
      )}
      {orders.filter(o => o.status === "Delivered").map((o) => (
        <div key={o.id} className="card row">
          <strong>{o.name}</strong>
          <span>Qty: {o.quantity}</span>
          <span>{t("delivered")}</span>
        </div>
      ))}
    </div>
  );
}

/* ================= ADMIN ================= */
function AdminDashboard({ products, orders, setPage, setOrders }) {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const topProducts = {};
  orders.forEach(o => {
    topProducts[o.name] = (topProducts[o.name] || 0) + o.quantity;
  });
  useEffect(() => {
    fetch("http://localhost:3001/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);
  const revenue = orders.reduce((sum, o) => sum + o.price * o.quantity, 0);
  const lowStock = products.filter(p => p.stock <= 5);
  const pending = orders.filter(o => o.status === "Pending").length;
  return (
    <div className="container">
      <h2>{t("dashboard")}</h2>
      {/* ✅ TOP METRICS */}

      <div className="grid">
        <div className="card">Users: {users.length}</div>
        <div className="card">Orders: {orders.length}</div>
        <div className="card">Revenue: ₹{revenue}</div>
      </div>

      {/* ✅ QUICK ACTIONS */}

      <h3>Quick Actions</h3>
      <div className="grid">
        <div className="card action" onClick={() => setPage("stock")}>
          ➕ Add Product
        </div>

        <div className="card action" onClick={() => setPage("employees")}>
          👨 Add Employee
        </div>

        <div className="card action" onClick={() => setPage("ready")}>
          📦 Process Orders
        </div>
      </div>
      <h3>Request Summary</h3>
      <div className="grid">
        <div className="card">
          Pending Orders: {orders.filter(o => o.status === "Pending").length}
        </div>

        <div className="card">
          Return Requests: {orders.filter(o => o.status === "Return Requested").length}
        </div>
      </div>
      {/* ✅ STATS CARDS */}

      <RevenueGraph orders={orders} />


      <h3>⚠️ Low Stock Items</h3>

      {lowStock.length === 0 && <p>No low stock items</p>}

      {lowStock.map(p => (

        <div key={p.id} className="card row">
          {p.name} - Stock: {p.stock}
        </div>
      ))}
      <h3>🔥 Top Selling Products</h3>

      {Object.keys(topProducts).length === 0 && <p>No sales yet</p>}

      {Object.entries(topProducts).map(([name, qty]) => (

        <div key={name} className="card row">
          {name} - Sold: {qty}
        </div>
      ))}
      {orders
        .filter(o => o.status?.toLowerCase().trim() === "pending")
        .map(o => (
          <div key={o.id} className="card row">
            <span>{o.name}</span>
            <button
              className="btn btn-blue"
              onClick={() => {
                fetch(`http://localhost:3001/orders/${o.id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    status: "Shipped",
                    timeline: [
                      { step: "Ordered", done: true },
                      { step: "Shipped", done: true },
                      { step: "Delivered", done: false }
                    ]
                  })
                })
                  .then(() => fetch("http://localhost:3001/orders"))
                  .then(res => res.json())
                  .then(data => setOrders(data));
              }}
            >
              Mark Ready
            </button>

          </div>
        ))}
      {/* ✅ RECENT ORDERS */}
      <h3 style={{ marginTop: "30px" }}>{t("recentOrders")}</h3>
      {orders.slice(-4).map((o, i) => (
        <div key={o.id} className="card row">
          <span>{o.name}</span>
          <span className={`status ${o.status.toLowerCase().replace(" ", "")}`}>
            {o.status}
          </span>          </div>
      ))}
    </div>
  );
}
function RevenueGraph({ orders }) {
  const [range, setRange] = useState("month");

  const now = new Date();

  const filtered = orders.filter(o => {
    const d = new Date(o.orderDate);
    const diff = (now - d) / (1000 * 60 * 60 * 24);

    if (range === "day") return diff <= 1;
    if (range === "month") return diff <= 30;
    if (range === "year") return diff <= 365;
    return true;
  });

  // ✅ GROUP DATA
  const grouped = {};
  filtered.forEach(o => {
    const date = new Date(o.orderDate).toLocaleDateString();
    grouped[date] = (grouped[date] || 0) + o.price * o.quantity;
  });

  const data = Object.entries(grouped).map(([date, revenue]) => ({
    date,
    revenue
  }));

  const max = Math.max(...data.map(d => d.revenue), 100);

  return (
    <div className="card">
      {/* ✅ HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>Revenue Analytics</h3>
        <strong>Total ₹{data.reduce((sum, d) => sum + d.revenue, 0)}</strong>
      </div>

      {/* ✅ GRAPH AREA */}
      <div style={{ display: "flex", marginTop: "20px" }}>

        {/* ✅ Y AXIS */}
        <div style={{ marginRight: "10px", textAlign: "right" }}>
          {[5, 4, 3, 2, 1, 0].map(i => (
            <div key={i} style={{ height: "30px", fontSize: "12px" }}>
              ₹{Math.round((max / 5) * i)}
            </div>
          ))}
        </div>

        {/* ✅ BARS */}
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "20px",
          borderLeft: "2px solid #ccc",
          borderBottom: "2px solid #ccc",
          padding: "10px",
          width: "100%"
        }}>
          {data.map((d, i) => (
            <div key={i} style={{ textAlign: "center" }}>

              {/* ✅ BAR */}
              <div style={{ position: "relative", height: "160px" }}>

                {/* ✅ BACKGROUND BAR (gray like image) */}

                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    height: "150px",
                    width: "50px",
                    background: "#d1d5db",
                    borderRadius: "6px",
                    opacity: 0.6
                  }}
                />

                {/* ✅ MAIN BAR */}

                <div
                  className="bar"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    height: `${(d.revenue / max) * 150}px`,
                    width: "50px",
                    background: "#1d4ed8",
                    borderRadius: "6px"
                  }}
                >

                  {/* ✅ TOOLTIP */}

                  <div className="bar-tooltip">
                    <strong>{d.date}</strong><br />
                    Growth: ₹{d.revenue}
                  </div>

                </div>

                {/* ✅ HOVER INFO */}

                <div
                  style={{
                    position: "absolute",
                    bottom: "105%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#1c1b1a",
                    color: "white",
                    padding: "6px 10px",
                    fontSize: "12px",
                    borderRadius: "6px",
                    opacity: 0,
                    pointerEvents: "none",
                    transition: "0.25s"
                  }}
                  className="bar-tooltip"
                >
                  ₹{d.revenue}
                  <br />
                  {d.date}
                </div>
              </div>

              {/* ✅ X LABEL */}
              <small>{d.date}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

} function DeliveryGraph({ orders, userData }) {

  const myOrders = orders.filter(
    o => o.deliveryPerson === userData?.name
  );

  const grouped = {};

  myOrders.forEach(o => {
    const date = new Date(o.orderDate).toLocaleDateString();
    grouped[date] = (grouped[date] || 0) + 1;
  });

  const data = Object.entries(grouped)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const max = Math.max(...data.map(d => d.value), 1);
  if (data.length === 0) return <p>No deliveries yet</p>;
  return (
    <div className="card" style={{ marginTop: "20px" }}>
      <h3>Delivery Activity</h3>

      <div style={{ display: "flex", alignItems: "flex-end", gap: "15px" }}>
        {data.map((d, i) => (
          <div key={i} style={{ textAlign: "center" }}>

            <div
              title={`${d.date} - ${d.value} deliveries`}
              style={{
                height: `${(d.value / max) * 120}px`,
                width: "40px",
                background: "#10b981",
                borderRadius: "5px"
              }}
            />

            <small>{d.date}</small>

          </div>
        ))}
      </div>
    </div>
  );

}
function SalaryManagement({ users }) {
  const [salaryData, setSalaryData] = useState({});

  const handleChange = (id, value) => {
    setSalaryData(prev => ({
      ...prev,
      [id]: value   // ✅ FIXED
    }));
  };

  const saveSalary = (emp) => {
    fetch(`http://localhost:3001/users/${emp.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        salary: Number(salaryData[emp.id] || emp.salary || 0)
      })
    })
      .then(() => alert("✅ Salary updated"));
  };

  return (
    <div className="container">
      <h2>Employee Salary Management</h2>

      {users
        .filter(u => u.role === "employee")
        .map(emp => (
          <div key={emp.id} className="card row">
            <span>{emp.name}</span>

            <input
              type="number"
              placeholder="Salary"
              value={salaryData[emp.id] ?? emp.salary ?? ""}
              onChange={(e) =>
                handleChange(emp.id, e.target.value)
              }
            />

            <button
              className="btn btn-green"
              onClick={() => saveSalary(emp)}
            >
              Save
            </button>
          </div>
        ))}
    </div>
  );

}

function ReadyToShip({ orders, setOrders }) {
  const markReady = (o) => {
    fetch(`http://localhost:3001/orders/${o.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "Shipped",
        timeline: [
          { step: "Ordered", done: true },
          { step: "Shipped", done: true },
          { step: "Delivered", done: false }
        ]
      })
    })
      .then(() => fetch("http://localhost:3001/orders"))
      .then(res => res.json())
      .then(data => setOrders(data));
  };

  return (
    <div className="container">
      <h2>Ready To Ship</h2>
      {orders
        .filter(o => o.status === "Pending")
        .map(o => (
          <div key={o.id} className="card row">
            <span>{o.name}</span>
            <button className="btn btn-blue" onClick={() => markReady(o)}>
              Mark Ready
            </button>
          </div>
        ))}
    </div>
  );
}

/* ================= RETURN MANAGEMENT (ADMIN) ================= */
function ReturnManagement({ orders, setOrders }) {
  const update = (id, status) => {
    fetch(`http://localhost:3001/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    })
      .then(() => fetch("http://localhost:3001/orders"))
      .then(res => res.json())
      .then(data => setOrders(data));
  };

  return (
    <div className="container">
      <h2>Return Requests</h2>
      {orders.filter(o => o.status === "Return Requested").map(o => (
        <div key={o.id} className="card row">
          <div>
            <strong>{o.name}</strong><br />
            <small>Qty: {o.quantity}</small>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            {/* ✅ APPROVE */}
            <button className="btn btn-blue" onClick={() => update(o.id, "Under Review")}>
              Review
            </button>
            <button className="btn btn-green" onClick={() => update(o.id, "Return Approved")}>
              Approve
            </button>
            <button className="btn btn-danger" onClick={() => update(o.id, "Return Rejected")}>
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function StockUpdate({ products, addProduct, deleteProduct, fetchProducts }) {
  const { t } = useLanguage();
  const [stock, setStock] = useState("");

  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [specs, setSpecs] = useState("");
  return (
    <div className="container">
      <h2>{t("stockUpdate")}</h2>
      <input
        placeholder={t("productName")}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder={t("productSpecs")}
        value={specs}
        onChange={(e) => setSpecs(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>



        <option value="">Select Category</option>

        <option value="mobile">Mobile</option>
        <option value="laptop">Laptop</option>
        <option value="accessory">Accessories</option>
        <option value="footwear">Footwear</option>
        <option value="electronics">Electronics</option>
        <option value="gaming">Gaming</option>
        <option value="wearable">Wearables</option>
        <option value="appliance">Appliances</option>

      </select>
      <input
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <input
        placeholder={t("price")}
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        placeholder="Stock Count"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />
      <button
        onClick={() => {
          addProduct({
            name,
            price: Number(price),
            specs,
            category,
            image,
            stock: Number(stock) || 0
          });
          //✅ CLEAR INPUTS
          setName("");
          setPrice("");
          setSpecs("");
          setCategory("");
        }}
      >
        {t("addProduct")}
      </button>
      <hr />
      {products.map((p) => (
        <div key={p.id} className="card row" style={{ alignItems: "center", gap: "10px" }}>

          <span style={{ flex: 1, color: p.stock === 0 ? "red" : p.stock <= 5 ? "orange" : "black" }}>
            {p.name} - ₹{p.price} | Stock: {p.stock ?? 0}
          </span>
          <input
            type="number"
            placeholder="Set Stock"
            style={{ width: "70px" }}
            onChange={(e) => {
              const newStock = Number(e.target.value);
              fetch(`http://localhost:3001/products/${p.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stock: newStock })
              }).then(() => fetchProducts());
            }}
          />
          <button
            className="btn"
            onClick={() => {
              const newStock = (p.stock || 0) - 1;
              if (newStock < 0) return;
              fetch(`http://localhost:3001/products/${p.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stock: newStock })
              }).then(() => {
                fetchProducts();
              });
            }}
          >
            −
          </button>


          <button
            className="btn btn-green"
            onClick={() => {
              const newStock = (p.stock || 0) + 1;

              fetch(`http://localhost:3001/products/${p.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stock: newStock })
              }).then(() => {
                fetchProducts();
              });
            }}
          >
            +
          </button>

          {/* DELETE */}
          <button
            className="btn btn-danger"
            onClick={() => deleteProduct(p.id)}
          >
            {t("delete")}
          </button>

        </div>
      ))}
    </div>
  );
}
function UserList({ users, title, deleteUser, addUser }) {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [search, setSearch] = useState("");

  return (
    <div className="container">
      <h2>{title}</h2>
      <input
        placeholder="Search users"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {title === "Employees" && (
        <div className="card employee-form">
          <h3>{t("addEmployee")}</h3>
          <input
            placeholder={t("fullName")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input
            placeholder={t("address")}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            placeholder={t("email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            placeholder="Employee ID (EMP...)"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          />
          <input
            placeholder={t("securityQuestion")}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <input
            placeholder={t("answer")}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button
            className="btn btn-green"
            onClick={() => {
              if (!name || !dob || !gender || !email || !password || !address || !employeeId || !question || !answer) {
                alert("⚠️ All fields are required");
                return;
              }
              if (!employeeId.startsWith("EMP")) {
                alert("❌ Employee ID must start with EMP");
                return;
              }
              addUser({
                name,
                dob,
                gender,
                address,
                email,
                password,
                role: "employee",
                employeeId,
                question,
                answer
              });
              setName("");
              setDob("");
              setGender("");
              setAddress("");
              setEmail("");
              setPassword("");
              setEmployeeId("");
              setQuestion("");
              setAnswer("");
            }}
          >
            Add Employee
          </button>
        </div>
      )}

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        users
          .filter(u => u.email.toLowerCase().includes(search.toLowerCase()))
          .map((u, i) => (
            <div key={i} className="card row">
              <div>
                <strong>{u.email}</strong>
                <br />
              </div>
              <button className="btn btn-danger" onClick={() => deleteUser(u.id)}>
                {t("remove")}
              </button>
            </div>
          ))
      )}
    </div>
  );
}
/* ================= AUTH ================= */
function Auth({ setRole, setPage, setUserEmail, setUserAddress, setUserData }) {
  const { t } = useLanguage();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [foundUser, setFoundUser] = useState(null);
  const [enteredAnswer, setEnteredAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const validate = (name, value) => {
    let error = "";
    if (name === "email") {
      if (!value) error = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        error = "Invalid email format";
    }
    if (name === "password") {
      if (!value) {
        error = "Password is required";
      } else if (value.length < 6) {
        error = "Minimum 6 characters";
      } else if (!/[A-Z]/.test(value)) {
        error = "Must include uppercase letter";
      } else if (!/[a-z]/.test(value)) {
        error = "Must include lowercase letter";
      } else if (!/[0-9]/.test(value)) {
        error = "Must include a number";
      } else if (!/[!@#$%^&*]/.test(value)) {
        error = "Must include special character";
      }
    }
    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
  };
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setLocalRole] = useState("user");
  const [employeeId, setEmployeeId] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const handleRegister = async () => {
    if (!name || !dob || !gender || !email || !password) {
      alert("⚠️ All fields are required");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      alert("❌ Enter valid 10-digit phone number");
      return;
    }
    if (role !== "admin" && !address) {
      alert("⚠️ Address is required");
      return;
    }
    if (!isValidEmail(email)) {
      alert("❌ Invalid email format");
      return;
    }
    if (password.length < 6) {
      alert("❌ Password must be at least 6 characters");
      return;
    }
    if (role === "employee") {
      if (!employeeId) {
        alert("❌ Employee ID required");
        return;
      }
      if (!employeeId.startsWith("EMP")) {
        alert("❌ Employee ID must start with 'EMP'");
        return;
      }
    }
    if (role === "admin") {
      if (!adminKey) {
        alert("❌ Admin key required");
        return;
      }
      if (!adminKey.startsWith("AD")) {
        alert("❌ Admin key must start with 'AD'");
        return;
      }
    }
    const newUser = {
      name,
      dob,
      gender,
      address,
      email,
      phone,
      password,
      role,
      question,
      answer
    };
    await fetch("http://localhost:3001/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newUser)
    });
    setIsLogin(true);
  };
  const handleLogin = async () => {
    if (!email || !password) {
      alert("⚠️ Enter email and password");
      return;
    }
    if (!isValidEmail(email)) {
      alert("❌ Invalid email format");
      return;
    }
    const res = await fetch("http://localhost:3001/users");
    const data = await res.json();
    const user = data.find(
      (u) =>
        (u.email === email || u.phone === email) &&
        u.password === password
    );
    if (!user) {
      alert("❌ Invalid credentials");
      return;
    }
    setUserData(user);
    setUserEmail(user.email);
    setUserAddress(user.address);
    setRole(user.role);
    localStorage.setItem("role", user.role);
    localStorage.setItem("userData", JSON.stringify(user));
    localStorage.setItem("userAddress", user.address);
    if (user.role === "user") setPage("home");
    if (user.role === "admin") setPage("admin");
    if (user.role === "employee") setPage("employee");
  };
  const handleGetQuestion = async () => {
    const res = await fetch("http://localhost:3001/users");
    const users = await res.json();
    const user = users.find((u) => u.email === email);
    if (!user) {
      setMessage("User not found");
      return;
    }
    setFoundUser(user);
    setMessage("");
  };
  const handleVerifyAnswer = () => {
    if (
      enteredAnswer.toLowerCase() !==
      foundUser.answer.toLowerCase()
    ) {
      setMessage("❌ Wrong answer");
      return;
    }
    setUserEmail(foundUser.email);
    setRole(foundUser.role);
    if (foundUser.role === "user") setPage("home");
    if (foundUser.role === "admin") setPage("admin");
    if (foundUser.role === "employee") setPage("employee");
  };
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="eshop">ESHOP</div>
        {!forgotMode ? (
          <>
            <h2>{isLogin ? t("login") : t("register")}</h2>

            <input
              placeholder={t("email")}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validate("email", e.target.value);
              }}
            />
            <small style={{ color: errors.email ? "red" : "green" }}>
              {errors.email ? errors.email : email && "✅ Valid Email"}
            </small>
            <br />
            <br />

            <input
              placeholder={t("password")}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validate("password", e.target.value);
              }}
            />
            {isLogin && !forgotMode && (
              <p
                style={{ cursor: "pointer", color: "#6C63FF", textAlign: "right" }}
                onClick={() => setForgotMode(true)}
              >
                {t("forgotPassword")}
              </p>
            )}
            <small style={{ color: errors.password ? "red" : "green" }}>
              {errors.password ? errors.password : password && "✅ Strong Password"}
            </small>
            <br />
            <br />
            {!isLogin && role === "employee" && (
              <>
                <input
                  placeholder="Employee ID"
                  onChange={(e) => {
                    setEmployeeId(e.target.value);
                    validate("employeeId", e.target.value);
                  }}
                />
                <small style={{ color: "red" }}>{errors.employeeId}</small>
                <br />
                <br />
              </>
            )}
            {!isLogin && role === "admin" && (
              <>
                <input
                  placeholder="Admin Key"
                  onChange={(e) => {
                    setAdminKey(e.target.value);
                    validate("adminKey", e.target.value);
                  }}
                />
                <small style={{ color: "red" }}>{errors.adminKey}</small>
                <br />
                <br />
              </>
            )}
            {!isLogin && (
              <>
                {/* ✅ NAME */}
                <input
                  placeholder={t("fullName")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <br />
                <br />
                <input
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <br />
                <br />

                {/* ✅ DOB */}
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
                <br />
                <br />

                {/* ✅ GENDER */}
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">{t("selectGender")}</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <br />
                <br />

                {/* ✅ ADDRESS ONLY FOR USER + EMPLOYEE */}
                {role !== "admin" && (
                  <>
                    <input
                      placeholder={t("homeAddress")}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    <br />
                    <br />
                  </>
                )}

                {/* EXISTING ROLE SELECT */}
                <select value={role} onChange={(e) => setLocalRole(e.target.value)}>
                  <option value="user">User</option>
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
                <br />
                <br />
              </>
            )}

            {/* ✅ SECURITY QUESTION */}
            {!isLogin && (
              <>
                <input
                  placeholder="Security Question (e.g. Your pet name?)"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                <br />
                <br />
                <input
                  placeholder={t("answer")}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
                <br />
                <br />
              </>
            )}

            <button
              className="btn btn-blue"
              disabled={Object.values(errors).some((e) => e)}
              onClick={isLogin ? handleLogin : handleRegister}
            >
              {isLogin ? t("login") : t("register")}
            </button>
            <br />
            <br />
            <button className="btn btn-green" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? t("goRegister") : t("goLogin")}
            </button>
          </>
        ) : (
          <>
            <h2>{t("forgotPasswordTitle")}</h2>
            <input
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn btn-blue" onClick={handleGetQuestion}>
              {t("getQuestion")}
            </button>

            {/* ✅ SHOW QUESTION */}
            {foundUser && (
              <>
                <p style={{ marginTop: "15px" }}>
                  <strong>Question:</strong> {foundUser.question}
                </p>
                <input
                  placeholder="Enter Answer"
                  value={enteredAnswer}
                  onChange={(e) => setEnteredAnswer(e.target.value)}
                />
                <button className="btn btn-blue" onClick={handleVerifyAnswer}>
                  {t("verifyAnswer")}
                </button>
              </>
            )}

            {/* ✅ MESSAGE */}
            <p style={{ color: "red", marginTop: "10px" }}>{message}</p>
            <button
              className="btn btn-danger"
              onClick={() => {
                setForgotMode(false);
                setFoundUser(null);
                setMessage("");
              }}
            >
              {t("backToLogin")}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

/* ================= MAIN ================= */
export default function App() {
  const { t, lang, setLang } = useLanguage(); // ✅ FIXED
  const [buyNowItem, setBuyNowItem] = useState(null);
  const [role, setRole] = useState(null); // no user logged in
  const [page, setPage] = useState("auth"); // start from login
  const [userData, setUserData] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [userAddress, setUserAddress] = useState("");

  const fetchProducts = () => {
    fetch("http://localhost:3001/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      })
      .catch(() => setProducts([]));
  };

  /* ✅ PRODUCTS FROM JSON */
  const [products, setProducts] = useState([]);
  const [usersGlobal, setUsersGlobal] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetch("http://localhost:3001/users")
      .then((res) => res.json())
      .then((data) => setUsersGlobal(data));
  }, []);

  useEffect(() => {
    const buyNowFlag = localStorage.getItem("buyNow");

    if (buyNowFlag) {
      localStorage.removeItem("buyNow");
      setPage("cart"); // ✅ go to checkout directly
    }

  }, []);

  useEffect(() => {
    fetch("http://localhost:3001/orders").then(res => res.json()).then(data => {
      if (Array.isArray(data)) { setOrders(data); } else {
        setOrders([]);
      }
    }).catch(() => setOrders([]));
  }, []);
  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    const savedUser = localStorage.getItem("userData");
    const savedAddress = localStorage.getItem("userAddress");
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) {
      setCart(savedCart);
    } if (savedRole && savedUser) {
      setRole(savedRole);
      setUserData(JSON.parse(savedUser));
      setUserAddress(savedAddress);
      if (savedRole === "user")
        setPage("home");
      if (savedRole === "admin")
        setPage("admin");
      if (savedRole === "employee")
        setPage("employee");
    }
  },
    []);
  const [cart, setCart] = useState([]);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]
  );
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const addToCart = (p) => {
    if ((p.stock || 0) === 0) { alert("❌ Out of Stock"); return; }

    const exists = cart.find(i => i.id === p.id);

    if (exists) {
      if (exists.qty >= p.stock) {
        alert("⚠️ Max stock reached");
        return;
      }

      setCart(cart.map(i =>
        i.id === p.id ? { ...i, qty: i.qty + 1 } : i
      ));
    } else {
      setCart([...cart, { ...p, qty: 1 }]);
    }
  };
  const addToWishlist = (p) => {
    const exists = wishlist.find(i => i.id === p.id);
    if (!exists) {
      setWishlist([...wishlist, p]);
    }
  };
  const placeOrder = (address, paymentMode, items = cart) => {

    const updated = items.map((i) => {

      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 5);

      const newOrder = {
        ...i,
        id: Date.now() + Math.random(),
        status: "Pending",
        address,
        quantity: i.qty,
        price: i.price,
        orderDate: new Date().toISOString(),
        deliveryRating: 0,
        expectedDelivery: deliveryDate.toISOString(),

        deliveryPerson: null,
        pickupPerson: null,

        invoice: {
          paymentMode,
          date: new Date().toLocaleString(),
          total: i.price * i.qty
        },

        paymentHistory: [{
          mode: paymentMode,
          date: new Date().toLocaleString(),
          amount: i.price * i.qty
        }],

        timeline: [
          { step: "Ordered", done: true },
          { step: "Shipped", done: false },
          { step: "Delivered", done: false }
        ],

        review: "",
        rating: 0,
        userName: userData?.name,
        userEmail: userData?.email
      };

      fetch("http://localhost:3001/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newOrder)
      });

      fetch(`http://localhost:3001/products/${i.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stock: Math.max((i.stock || 0) - i.qty, 0)
        })
      });

      setProducts(prev =>
        prev.map(p =>
          p.id === i.id
            ? { ...p, stock: Math.max((p.stock || 0) - i.qty, 0) }
            : p
        )
      );

      return newOrder;
    });

    setOrders(prev => [...prev, ...updated]);
    setCart([]);
  };

  const addProduct = async (p) => {
    await fetch("http://localhost:3001/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(p)
    });
    fetchProducts();
  };
  const deleteProduct = async (id) => {
    await fetch(`http://localhost:3001/products/${id}`, {
      method: "DELETE"
    });
    fetchProducts();
  };
  const addUser = async (newUser) => {
    await fetch("http://localhost:3001/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newUser)
    });
    // ✅ update UI
    setUsersGlobal([...usersGlobal, { ...newUser, id: Date.now() }]);
  };
  const deleteUser = async (id) => {
    await fetch(`http://localhost:3001/users/${id}`, {
      method: "DELETE"
    });
    // ✅ update UI after delete
    const updated = usersGlobal.filter(u => u.id !== id);
    setUsersGlobal(updated);
  };
  const renderPage = () => {
    /* ✅ NOT LOGGED IN → FORCE AUTH */
    if (!role) {
      return (
        <Auth
          setRole={setRole}
          setPage={setPage}
          setUserEmail={setUserEmail}
          setUserAddress={setUserAddress}
          setUserData={setUserData}
        />
      );
    }

    /* ========= USER ========= */
    if (role === "user") {
      if (page === "home") {
        return (
          <Home
            products={products}
            addToCart={addToCart}
            addToWishlist={addToWishlist}
            orders={orders}
            setPage={setPage}
            setSelectedProduct={setSelectedProduct}
          />
        );
      }
      if (page === "cart") {
        return (
          <Cart
            cart={cart}
            setCart={setCart}
            placeOrder={placeOrder}
            userAddress={userAddress}
            addToCart={addToCart}
            setPage={setPage}
            buyNowItem={buyNowItem}
            setBuyNowItem={setBuyNowItem}
          />
        );
      }
      if (page === "wishlist") {
        return <Wishlist wishlist={wishlist} setWishlist={setWishlist} addToCart={addToCart} />;
      }
      if (page === "orders") {
        return <Orders orders={orders} setOrders={setOrders} userEmail={userData?.email} />;
      }
      if (page === "history") {
        return <OrderHistory orders={orders} setOrders={setOrders} userEmail={userData?.email} />;
      }
      if (page === "success") {
        return <PaymentSuccess />;
      }
      if (page === "product") {
        return (
          <ProductPage
            product={selectedProduct}
            orders={orders}
            addToCart={addToCart}
            addToWishlist={addToWishlist}
            setPage={setPage}
            setBuyNowItem={setBuyNowItem}
          />
        );
      }
      if (page === "profile") {
        return <Profile role={role} userData={userData} />;
      }
    }

    /* ========= EMPLOYEE ========= */
    if (role === "employee") {
      if (page === "employee") {
        return <EmployeeDashboard orders={orders} userData={userData} />;
      }
      if (page === "employeeOrders") {
        return (
          <EmployeeOrders
            orders={orders}
            setOrders={setOrders}
            userData={userData}
          />
        );
      }
      if (page === "shipped") {
        return <ShippedOrders orders={orders} setOrders={setOrders} userData={userData} />;
      }
      if (page === "deliverHistory") {
        return <DeliverHistory orders={orders} userData={userData} />;
      }
      if (page === "profile") {
        return <Profile role={role} userData={userData} />;
      }
    }

    /* ========= ADMIN ========= */
    if (role === "admin") {
      if (page === "admin") {
        return (
          <AdminDashboard
            products={products}
            orders={orders}
            setPage={setPage}
            setOrders={setOrders}
          />
        );
      }
      if (page === "profile") {
        return <Profile role={role} userData={userData} />;
      }
      if (page === "orders") {
        return <Orders orders={orders} />;
      }
      if (page === "returns") {
        return <ReturnManagement orders={orders} setOrders={setOrders} />;
      }
      if (page === "ready") {
        return <ReadyToShip orders={orders} setOrders={setOrders} />;
      }
      if (page === "salary") {
        return <SalaryManagement users={usersGlobal} />;
      }
      if (page === "stock") {
        return (
          <StockUpdate
            products={products}
            addProduct={addProduct}
            deleteProduct={deleteProduct}
            fetchProducts={fetchProducts}
          />
        );
      }
      if (page === "users") {
        return (
          <UserList
            users={usersGlobal.filter((u) => u.role === "user")}
            title="Users"
          />
        );
      }
      if (page === "employees") {
        return (
          <UserList
            users={usersGlobal.filter((u) => u.role === "employee")}
            title="Employees"
            deleteUser={deleteUser}
            addUser={addUser}
          />
        );
      }
    }
  };

  return (
    <>
      {/* ✅ GLOBAL LANGUAGE SWITCHER */}
      <div className="lang-global">
        <select value={lang} onChange={(e) => setLang(e.target.value)}>
          <option value="en">English</option>
          <option value="ta">தமிழ்</option>
          <option value="hi">हिन्दी</option>
        </select>
      </div>
      {role && (
        <Navbar
          cartCount={cart.length}
          role={role}
          setPage={setPage}
          setRole={setRole}
          setCart={setCart}
          setBuyNowItem={setBuyNowItem}
        />
      )}
      {renderPage()}
    </>
  );
}