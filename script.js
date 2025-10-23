const products = [
    { id: 1, title: "Ivory Silk Blouse", price: 89.99, description: "A classic silk blouse, perfect for work or weekend wear. Breathable and luxurious.", tags: ["Workwear", "Minimal", "Tops"], image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80", sizes: ["XS", "S", "M", "L", "XL"], avgRating: 4.8, isTopRated: true, type: "Tops", reviews: [
        { user: "Sarah K.", rating: 5, comment: "Fantastic quality silk. Fits perfectly according to the size guide!" },
        { user: "J. Doe", rating: 4, comment: "Great blouse, though sleeves are a little long." }
    ]},
    { id: 2, title: "Wide-Leg Trousers", price: 129.50, description: "Comfortable high-waisted trousers with a wide leg fit. Available in Navy.", tags: ["Casual", "Minimal", "Bottoms"], image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=50", sizes: ["XS", "S", "M", "L", "XL"], avgRating: 4.5, isTopRated: true, type: "Bottoms", reviews: [
        { user: "Mark L.", rating: 5, comment: "My new favorite work pants. The fit is incredibly flattering." },
        { user: "Priya S.", rating: 4, comment: "Very comfortable, true to size." }
    ]},
    { id: 3, title: "Navy Tailored Blazer", price: 199.00, description: "A sharp, double-breasted blazer for a professional look. Made from high-quality wool blend.", tags: ["Workwear", "Outerwear"], image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=60", sizes: ["S", "M", "L", "XL"], avgRating: 4.2, isTopRated: false, type: "Tops", reviews: [
        { user: "Alex T.", rating: 4, comment: "High quality blazer, great for meetings." }
    ]},
    { id: 4, title: "Satin Slip Dress", price: 75.00, description: "Elegant midi slip dress. Perfect for evening events or layering.", tags: ["Evening", "Minimal", "Dress"], image: "https://images.unsplash.com/photo-1520975913164-6f2b6d6f3b31?w=600&q=60", sizes: ["XS", "S", "M", "L"], avgRating: 4.9, isTopRated: true, type: "Tops", reviews: [
        { user: "Kelly B.", rating: 5, comment: "Obsessed with this dress. Fits like a glove!" },
        { user: "Ryan M.", rating: 5, comment: "A stunning piece. Excellent value for money." }
    ]},
    { id: 5, title: "Cropped Denim Jacket", price: 95.00, description: "A stylish cropped jacket with silver hardware. Great for casual outfits.", tags: ["Casual", "Outerwear"], image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=70", sizes: ["S", "M", "L", "XL"], avgRating: 3.9, isTopRated: false, type: "Tops", reviews: [
        { user: "Jane D.", rating: 3, comment: "A bit too cropped for my liking." }
    ]},
    { id: 6, title: "A-Line Mini Skirt", price: 55.00, description: "A versatile black mini skirt with a flattering A-line silhouette.", tags: ["Casual", "Bottoms"], image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=40", sizes: ["XS", "S", "M", "L"], avgRating: 4.7, isTopRated: true, type: "Bottoms", reviews: [
        { user: "Chris W.", rating: 5, comment: "Perfect summer skirt. Highly recommend!" }
    ]}
];

let mockOrders = []; 
// --- APP STATE (Initialized to defaults, overwritten by localStorage) ---
const tags = ["Casual", "Workwear", "Evening", "Minimal", "Tops", "Bottoms", "Outerwear", "Dress"];
let selectedTags = [];
let cart = []; 
let checkoutStep = 1; 
let userSizes = { 
    tops: null, // e.g., "M (31in Bust)"
    bottoms: null // e.g., "M (28in Waist)"
};


// --- DOM ELEMENTS ---
const productBrowsingSection = document.getElementById("productBrowsingSection");
const checkoutSection = document.getElementById("checkoutSection");
const profileBtn = document.getElementById("profileBtn");
const outfitsContainer = document.getElementById("outfitsContainer");

const tagsContainer = document.getElementById("tagsContainer");
const productGridContainer = document.getElementById("productGridContainer");
const priceSortSelect = document.getElementById("priceSort");

// Modals
const measurementsModal = document.getElementById("measurementsModal");
const cartModal = document.getElementById("cartModal");
const productDetailModal = document.getElementById("productDetailModal"); 
const productDetailContent = document.getElementById("productDetailContent");
const reviewsList = document.getElementById("reviewsList"); 
const avgRatingSpan = document.getElementById("avgRating"); 
const modalSuggestedSection = document.getElementById("modalSuggestedSection"); 
// NEW: Size Guide Modal for Product View
const productViewSizeGuideModal = document.getElementById("productViewSizeGuideModal");
const closeProductViewSizeGuideModal = document.getElementById("closeProductViewSizeGuideModal");

// Cart Elements
const openCartBtn = document.getElementById("openCartBtn");
const cartItemsContainer = document.getElementById("cartItemsContainer");

// Measurement Modal Elements
const sizeChartContainer = document.getElementById("sizeChartContainer");
const viewSizeChartBtn = document.getElementById("viewSizeChartBtn");
const closeSizeChartBtn = document.getElementById("closeSizeChartBtn");
const saveMeasurementsBtn = document.getElementById("saveMeasurements");
const closeModalBtn = document.getElementById("closeModal");

// NEW: Toast Container & My Size Filter
let mySizeFilterContainer = document.querySelector('.product-filters input#mySizeFilter') ? document.querySelector('.product-filters').parentElement : null;
if (!mySizeFilterContainer) {
    mySizeFilterContainer = document.createElement('div');
    mySizeFilterContainer.className = 'sort-controls';
    mySizeFilterContainer.innerHTML = `
        <input type="checkbox" id="mySizeFilter" style="margin-right: 5px;">
        <label for="mySizeFilter">Show Only My Size</label>
    `;
    // Ensure productBrowsingSection exists before trying to prepend
    if (document.querySelector('.product-filters')) {
        document.querySelector('.product-filters').prepend(mySizeFilterContainer);
    }
}
const mySizeFilter = document.getElementById("mySizeFilter");

let toastNotification = document.getElementById('toastNotification');
if (!toastNotification) {
    toastNotification = document.createElement('div');
    toastNotification.id = 'toastNotification';
    document.body.appendChild(toastNotification);
}


// --- SIZE MAPPING DATA ---
const sizeMap = {
    // Tops & Dresses
    'XS': '26-28', 
    'S': '29-31', 
    'M': '32-34', 
    'L': '35-37', 
    'XL': '38+', 
    // Bottoms (Updated to letter sizes with corresponding waist ranges)
    'XS-B': '24-25', 
    'S-B': '26-27',
    'M-B': '28-29',
    'L-B': '30-32',
    'XL-B': '33-35'
};


// --- PERSISTENT STORAGE & UTILITY ---

/** Loads state from localStorage on startup. */
function loadAppState() {
    try {
        const savedSizes = localStorage.getItem('closetteUserSizes');
        const savedCart = localStorage.getItem('closetteCart');
        const savedOrders = localStorage.getItem('closetteMockOrders');
        
        const initialMockOrders = [
            { id: "O1001", date: "2024-05-10", total: 318.99, status: "Delivered", items: ["Navy Tailored Blazer (L)", "Ivory Silk Blouse (M)"] },
            { id: "O1002", date: "2024-06-15", total: 184.50, status: "Shipped", items: ["Wide-Leg Trousers (M)", "A-Line Mini Skirt (S)"] }
        ];

        if (savedSizes) {
            userSizes = JSON.parse(savedSizes);
            // Conversion logic for old numeric data (retained for safety)
            if (userSizes.bottoms && !userSizes.bottoms.includes('(')) {
                const numericSize = parseInt(userSizes.bottoms);
                let coreSize = null;
                if (numericSize) {
                    if (numericSize >= 24 && numericSize <= 25) coreSize = 'XS-B';
                    else if (numericSize >= 26 && numericSize <= 27) coreSize = 'S-B';
                    else if (numericSize >= 28 && numericSize <= 29) coreSize = 'M-B';
                    else if (numericSize >= 30 && numericSize <= 32) coreSize = 'L-B';
                    else if (numericSize >= 33 && numericSize <= 35) coreSize = 'XL-B';
                    
                    if (coreSize) {
                        userSizes.bottoms = `${extractCoreSize(coreSize)} (${getRangeDetails(coreSize)})`;
                    }
                }
            }
        }
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
        
        mockOrders = savedOrders ? JSON.parse(savedOrders) : initialMockOrders;

    } catch (e) {
        console.error("Could not load state from localStorage:", e);
    }
}

/** Saves state to localStorage. */
function saveAppState() {
    try {
        localStorage.setItem('closetteUserSizes', JSON.stringify(userSizes));
        localStorage.setItem('closetteCart', JSON.stringify(cart));
        localStorage.setItem('closetteMockOrders', JSON.stringify(mockOrders));
    } catch (e) {
        console.error("Could not save state to localStorage:", e);
    }
}

/** Converts size text (e.g., "M (31in Bust)") to the core size ("M" or "S"). */
function extractCoreSize(sizeText) {
    if (!sizeText) return null;
    return sizeText.split(' ')[0].replace(/\(|\)/g, '');
}

/** Helper to simulate fetching detailed size info for display on the profile */
function getRangeDetails(coreSize) {
    if (!coreSize) return "";

    let range = sizeMap[coreSize];
    if (range) {
        if (coreSize.endsWith('-B')) {
            return `${range}in Waist`;
        } else {
            return `${range}in Bust`;
        }
    }
    return "";
}

/** Generates star HTML based on rating (e.g., ★★★★☆) */
function getStarRating(rating) {
    const roundedRating = Math.round(rating);
    const fullStars = '★'.repeat(roundedRating);
    const emptyStars = '☆'.repeat(5 - roundedRating);
    return fullStars + emptyStars;
}

/** Shows a non-blocking toast notification. */
function showToast(message, duration = 3000) {
    toastNotification.textContent = message;
    toastNotification.classList.add('show');
    
    setTimeout(() => {
        toastNotification.classList.remove('show');
    }, duration);
}

// --- SIZE CHART & MEASUREMENTS MODAL LOGIC (Profile Modal) ---

function toggleSizeChart(show) {
    if (show) {
        sizeChartContainer.style.display = 'block';
        viewSizeChartBtn.style.display = 'none'; 
        closeSizeChartBtn.style.display = 'block'; 
        saveMeasurementsBtn.style.display = 'none';
        closeModalBtn.style.display = 'none';
        
    } else {
        sizeChartContainer.style.display = 'none';
        viewSizeChartBtn.style.display = 'block'; 
        closeSizeChartBtn.style.display = 'none'; 
        saveMeasurementsBtn.style.display = 'block';
        closeModalBtn.style.display = 'block';
    }
}

function initializeMeasurementsModal() {
    const topsLetterSizeSelect = document.getElementById("topsLetterSize");
    const bottomsLetterSizeSelect = document.getElementById("bottomsLetterSize");
    const topsRangeSizeSelect = document.getElementById("topsRangeSize");
    const bottomsRangeSizeSelect = document.getElementById("bottomsRangeSize");
    
    if (userSizes.tops) {
        topsLetterSizeSelect.value = extractCoreSize(userSizes.tops);
        topsRangeSizeSelect.value = sizeMap[topsLetterSizeSelect.value];
    } else {
        topsLetterSizeSelect.value = "";
        topsRangeSizeSelect.value = "";
    }
    
    if (userSizes.bottoms) {
        const coreBottomsSize = extractCoreSize(userSizes.bottoms); // e.g., 'M'
        bottomsLetterSizeSelect.value = coreBottomsSize; // Display as 'M'
        bottomsRangeSizeSelect.value = sizeMap[`${coreBottomsSize}-B`]; // Look up range with '-B'
    } else {
        bottomsLetterSizeSelect.value = "";
        bottomsRangeSizeSelect.value = "";
    }

    syncRangeSize('topsLetterSize', 'topsRangeSize', false);
    syncRangeSize('bottomsLetterSize', 'bottomsRangeSize', true);

    topsLetterSizeSelect.onchange = () => syncRangeSize('topsLetterSize', 'topsRangeSize', false);
    topsRangeSizeSelect.onchange = () => syncLetterSize('topsRangeSize', 'topsLetterSize', false);
    bottomsLetterSizeSelect.onchange = () => syncRangeSize('bottomsLetterSize', 'bottomsRangeSize', true);
    bottomsRangeSizeSelect.onchange = () => syncLetterSize('bottomsRangeSize', 'bottomsLetterSize', true);

    document.getElementById("viewSizeChartBtn").onclick = () => toggleSizeChart(true);
    document.getElementById("closeSizeChartBtn").onclick = () => toggleSizeChart(false);
    
    document.getElementById("closeModal").onclick = () => measurementsModal.style.display = "none";
    document.getElementById("saveMeasurements").onclick = saveMeasurementsHandler;

    toggleSizeChart(false); 
    measurementsModal.style.display = "flex";
}

function syncRangeSize(letterSelectId, rangeSelectId, isBottoms = false) {
    const letterSizeSelect = document.getElementById(letterSelectId);
    const rangeSizeSelect = document.getElementById(rangeSelectId);
    let selectedLetter = letterSizeSelect.value;
    
    if (isBottoms && selectedLetter) {
        selectedLetter += '-B';
    }

    if (selectedLetter && sizeMap.hasOwnProperty(selectedLetter)) {
        rangeSizeSelect.value = sizeMap[selectedLetter];
    } else if (!selectedLetter) {
        rangeSizeSelect.value = "";
    }
}

function syncLetterSize(rangeSelectId, letterSelectId, isBottoms = false) {
    const letterSizeSelect = document.getElementById(letterSelectId);
    const rangeSizeSelect = document.getElementById(rangeSelectId);
    const selectedRange = rangeSizeSelect.value;
    
    if (selectedRange) {
        let correspondingLetter = "";
        for (const [letter, range] of Object.entries(sizeMap)) {
            if (range === selectedRange) {
                if (isBottoms && letter.endsWith('-B')) {
                    correspondingLetter = letter.replace('-B', '');
                    break; 
                } else if (!isBottoms && !letter.endsWith('-B')) {
                    correspondingLetter = letter;
                    break;
                }
            }
        }
        if (correspondingLetter) {
            letterSizeSelect.value = correspondingLetter;
        }
    } else {
        letterSizeSelect.value = "";
    }
}


function saveMeasurementsHandler() {
    const topsLetterSize = document.getElementById("topsLetterSize").value;
    const bottomsLetterSize = document.getElementById("bottomsLetterSize").value;
    
    if (!topsLetterSize || !bottomsLetterSize) {
        showToast("Please select both a Tops size and a Bottoms size.", 4000);
        return;
    }
    
    const coreBottomsSizeForMap = `${bottomsLetterSize}-B`; 

    const topsDetails = getRangeDetails(topsLetterSize);
    const bottomsDetails = getRangeDetails(coreBottomsSizeForMap);

    userSizes.tops = `${topsLetterSize} (${topsDetails})`;
    userSizes.bottoms = `${bottomsLetterSize} (${bottomsDetails})`;
    
    saveAppState();
    measurementsModal.style.display = "none";
    renderProducts();
    renderOutfits();
    showToast("Your perfect fit measurements have been saved!", 3000);
}

// --- NAVIGATION & GENERAL UTILITY FUNCTIONS ---

function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price, 0);
}

function updateCartCount() {
    openCartBtn.textContent = `Cart (${cart.length})`;
}

function navigateTo(view) {
    productBrowsingSection.style.display = 'none';
    checkoutSection.style.display = 'none';
    
    let profileSection = document.getElementById('profileSection');
    if (!profileSection) {
        profileSection = document.createElement('section');
        profileSection.id = 'profileSection';
        profileSection.className = 'profile-section';
        // Assumes .main is the parent container. You might need to adjust this.
        document.querySelector('.main')?.appendChild(profileSection) || document.body.appendChild(profileSection);
    }
    profileSection.style.display = 'none';

    if (view === 'browsing') {
        productBrowsingSection.style.display = 'block';
    } else if (view === 'checkout') {
        if (cart.length === 0) {
             showToast("Your cart is empty. Cannot proceed to checkout.", 4000);
             navigateTo('browsing');
             return;
        }
        checkoutSection.style.display = 'block';
        checkoutStep = 1; 
        renderCheckout();
    } else if (view === 'profile') {
        profileSection.style.display = 'block';
        renderProfile();
    }
}


// --- PROFILE RENDERING FUNCTION (BEWAKOOF-STYLE MENU IMPLEMENTED) ---

function toggleProfileSubSection(sectionToShowId) {
    const sections = ['accountDetails', 'orderHistory', 'verticalMenu'];
    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            // Only hide/show the dynamic content sections, not the whole layout
            if (id === 'accountDetails' || id === 'orderHistory') {
                section.style.display = (id === sectionToShowId) ? 'block' : 'none';
            }
        }
    });
}

function renderProfile() {
    const profileSection = document.getElementById('profileSection');
    const topsSizeText = userSizes.tops ? userSizes.tops : "Not Set";
    const bottomsSizeText = userSizes.bottoms ? userSizes.bottoms : "Not Set";

    const ordersHTML = mockOrders.map(order => {
        let statusClass = "status-processing";
        if (order.status === "Delivered") {
            statusClass = "status-delivered";
        } else if (order.status === "Shipped") {
            statusClass = "status-shipped";
        }
        
        return `
            <div class="order-item">
                <strong>Order #${order.id}</strong>
                <p>Date: ${order.date} | Total: $${order.total.toFixed(2)}</p>
                <p>Status: <span class="order-status ${statusClass}">${order.status}</span></p>
                <p style="font-size: 0.9em; color: #666;">Items: ${order.items.join(', ')}</p>
            </div>
        `;
    }).join('');

    profileSection.innerHTML = `
        <h1>My Closette Account</h1>
        
        <div class="profile-layout-container">
            
            <div class="profile-icon-nav-row">
                <button class="icon-nav-item" onclick="toggleProfileSubSection('accountDetails')">
                    <i class="fas fa-user icon"></i>
                    <span>My Account</span>
                </button>
                <button class="icon-nav-item" onclick="toggleProfileSubSection('orderHistory')">
                    <i class="fas fa-truck icon"></i>
                    <span>My Orders</span>
                </button>
                <button class="icon-nav-item" onclick="showToast('Wallet integration placeholder.', 2000)">
                    <i class="fas fa-wallet icon"></i>
                    <span>My Wallet</span>
                </button>
                <button class="icon-nav-item" onclick="showToast('Wishlist feature placeholder.', 2000)">
                    <i class="far fa-heart icon"></i>
                    <span>My Wishlist</span>
                </button>
            </div>

            <div class="profile-content-area">
                
                <div class="profile-content-sub-section" id="accountDetails">
                    <div class="account-card">
                        <h3>My Perfect Fit</h3>
                        <p><strong>Tops/Dresses:</strong> ${topsSizeText}</p>
                        <p><strong>Bottoms/Skirts:</strong> ${bottomsSizeText}</p>
                        <button class="secondary-btn" onclick="initializeMeasurementsModal()">Update Measurements</button>
                    </div>

                    <div class="account-card" style="margin-top: 20px;">
                        <h3>Account & Contact</h3>
                        <p><strong>Name:</strong> John Doe</p>
                        <p><strong>Email:</strong> john.doe@closette.com</p>
                        <button class="secondary-btn" onclick="showToast('Edit Account Info functionality would go here.', 3000)">Edit Info</button>
                    </div>
                    
                    <div class="vertical-menu-list" id="verticalMenu">
                        <h4 class="menu-header">SUPPORT & LEGAL</h4>
                        <a href="#" class="menu-item" onclick="showToast('Help & Support page placeholder.', 2000)">Help & Support</a>
                        <a href="#" class="menu-item" onclick="showToast('Feedback page placeholder.', 2000)">Feedback & Suggestions</a>
                        <a href="#" class="menu-item" onclick="showToast('Terms of Service page placeholder.', 2000)">Terms & Conditions</a>
                        
                        <h4 class="menu-header">ABOUT CLOSETTE</h4>
                        <a href="#" class="menu-item" onclick="showToast('Our Story page placeholder.', 2000)">Our Story</a>
                        <a href="#" class="menu-item" onclick="showToast('Community page placeholder.', 2000)">Fanbook / Community</a>
                        
                        <button class="logout-btn" onclick="showToast('User Logged Out (Placeholder).', 3000)">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>

                <div class="profile-content-sub-section" id="orderHistory" style="display: none;">
                    <h2>Order History</h2>
                    <div class="order-history-list">
                        ${ordersHTML.length > 0 ? ordersHTML : '<p>No orders placed yet.</p>'}
                    </div>
                    <button class="secondary-btn" onclick="toggleProfileSubSection('accountDetails')" style="margin-top: 20px;">Back to My Account</button>
                </div>

            </div>
        </div>
        <button class="secondary-btn" onclick="navigateTo('browsing')" style="margin-top: 30px;">
            <i class="fas fa-arrow-left"></i> Continue Shopping
        </button>
    `;
    
    // Ensure that 'accountDetails' is the default visible section
    toggleProfileSubSection('accountDetails');
}


// --- CHECKOUT RENDERING FUNCTIONS (STEP-BY-STEP) ---
function renderCheckout() {
    const checkoutSection = document.getElementById("checkoutSection");
    const stepsHTML = `
        <div class="checkout-steps">
            <span class="checkout-step ${checkoutStep === 1 ? 'active' : ''}">1. Shipping & Address</span>
            <span class="checkout-step ${checkoutStep === 2 ? 'active' : ''}">2. Payment Method</span>
            <span class="checkout-step ${checkoutStep === 3 ? 'active' : ''}">3. Review & Pay</span>
        </div>
    `;

    let contentHTML = '';
    
    if (checkoutStep === 1) {
        contentHTML = `
            <h2>Shipping Information</h2>
            <form id="shippingForm" class="checkout-form">
                <label for="fullName">Full Name</label>
                <input type="text" id="fullName" value="John Doe" required>

                <label for="address1">Address Line 1</label>
                <input type="text" id="address1" value="123 Main St" required>
                
                <div class="checkout-address-group">
                    <div>
                        <label for="city">City</label>
                        <input type="text" id="city" value="Anytown" required>
                    </div>
                    <div>
                        <label for="zip">Zip/Postal Code</label>
                        <input type="text" id="zip" value="10001" required pattern="[0-9]{5,6}" title="Must be a valid postal code.">
                    </div>
                </div>

                <label for="shippingMethod">Shipping Method</label>
                <select id="shippingMethod">
                    <option value="standard">Standard Shipping (5-7 days) - $5.00</option>
                    <option value="express">Express Shipping (2-3 days) - $15.00</option>
                </select>

                <div class="modal-actions" style="justify-content: flex-end;">
                    <button type="button" class="secondary-btn" onclick="navigateTo('browsing')">Back to Shopping</button>
                    <button type="submit" class="primary-btn">Continue to Payment</button>
                </div>
            </form>
        `;
    } 
    
    else if (checkoutStep === 2) {
        contentHTML = `
            <h2>Payment Method</h2>
            <form id="paymentForm" class="checkout-form">
                <label for="cardNumber">Card Number</label>
                <input type="text" id="cardNumber" placeholder="xxxx xxxx xxxx xxxx" required pattern="[0-9]{16}" title="Must be 16 digits">

                <div class="checkout-address-group">
                    <div>
                        <label for="expiry">Expiry (MM/YY)</label>
                        <input type="text" id="expiry" placeholder="01/26" required pattern="(0[1-9]|1[0-2])\\/[0-9]{2}" title="Format: MM/YY (e.g., 01/26)">
                    </div>
                    <div>
                        <label for="cvv">CVV</label>
                        <input type="text" id="cvv" placeholder="123" required pattern="[0-9]{3,4}" title="3 or 4 digits">
                    </div>
                </div>
                
                <label for="cardName">Name on Card</label>
                <input type="text" id="cardName" value="John Doe" required>


                <div class="modal-actions" style="justify-content: space-between;">
                    <button type="button" class="secondary-btn" onclick="checkoutStep = 1; renderCheckout();">Back to Shipping</button>
                    <button type="submit" class="primary-btn">Review Order</button>
                </div>
            </form>
        `;
    } 
    
    else if (checkoutStep === 3) {
        const subtotal = getCartTotal();
        const shippingSelect = document.getElementById("shippingMethod");
        const shippingFee = shippingSelect && shippingSelect.value === 'express' ? 15.00 : 5.00; 
        const total = subtotal + shippingFee;

        contentHTML = `
            <h2>Review & Confirm Order</h2>
            <div class="checkout-summary">
                <h3>Order Summary</h3>
                ${cart.map(item => `
                    <div>
                        <span>${item.title} (Size: ${item.size})</span>
                        <span>$${item.price.toFixed(2)}</span>
                    </div>
                `).join('')}
                <hr style="margin: 10px 0;">
                <div><span>Subtotal:</span><span>$${subtotal.toFixed(2)}</span></div>
                <div><span>Shipping:</span><span>$${shippingFee.toFixed(2)}</span></div>
                <hr style="margin: 10px 0;">
                <div><strong>Total:</strong><strong>$${total.toFixed(2)}</strong></div>
            </div>
            
            <div style="margin-top: 20px;">
                <p>Delivery Address: ${document.getElementById('address1')?.value || '123 Main St'}, ${document.getElementById('city')?.value || 'Anytown'}, ${document.getElementById('zip')?.value || '10001'}</p>
                <p>Payment Method: Card ending in ${document.getElementById('cardNumber')?.value.slice(-4) || '****'}</p>
            </div>

            <div class="modal-actions" style="justify-content: space-between;">
                <button type="button" class="secondary-btn" onclick="checkoutStep = 2; renderCheckout();">Back to Payment</button>
                <button id="placeOrderBtn" class="primary-btn">Place Order ($${total.toFixed(2)})</button>
            </div>
        `;
    }

    checkoutSection.innerHTML = stepsHTML + contentHTML;

    if (checkoutStep === 1) {
        document.getElementById('shippingForm').onsubmit = (e) => {
            e.preventDefault();
            const form = e.target;
            if (form.checkValidity()) {
                checkoutStep = 2; 
                renderCheckout();
            } else {
                showToast("Please fill in all required fields correctly.", 3000);
            }
        };
    } else if (checkoutStep === 2) {
        document.getElementById('paymentForm').onsubmit = (e) => {
            e.preventDefault();
            const form = e.target;
            if (form.checkValidity()) {
                checkoutStep = 3; 
                renderCheckout();
            } else {
                showToast("Please check card details for correct format.", 4000);
            }
        };
    } else if (checkoutStep === 3) {
        document.getElementById('placeOrderBtn').onclick = () => {
            const shippingFee = document.getElementById("shippingMethod").value === 'express' ? 15.00 : 5.00;
            const newOrder = {
                id: "O" + (parseInt(mockOrders[0].id.substring(1)) + 1).toString(),
                date: new Date().toISOString().slice(0, 10),
                total: getCartTotal() + shippingFee,
                status: "Processing",
                items: cart.map(item => `${item.title} (Size: ${item.size})`)
            };
            mockOrders.unshift(newOrder); 

            cart = []; 
            updateCartCount();
            saveAppState();
            showToast("Order Placed Successfully! Thank you for shopping with Closette.", 5000);
            navigateTo('profile'); 
        };
    }
}

// --- PRODUCT DETAIL & SUGGESTION RENDERING ---

/** Renders the list of highly-rated products in a horizontal scroll view *inside the modal*. */
function renderSuggestedProductsInModal(currentProductId) {
    const topRatedProducts = products
        .filter(p => p.isTopRated && p.avgRating >= 4.5 && p.id !== currentProductId)
        .sort((a, b) => b.avgRating - a.avgRating);
        
    modalSuggestedSection.innerHTML = "";

    if (topRatedProducts.length === 0) {
        modalSuggestedSection.innerHTML = "<p style='padding: 10px 0; color: #666;'>No other highly rated products available right now.</p>";
        return;
    }
    
    let html = `<h3>Other Highly Rated Products</h3>
        <div class="modal-suggested-scroll-container">`;

    topRatedProducts.forEach(product => {
        html += `
            <div class="suggested-item" onclick="window.renderProductDetail(${product.id})">
                <img src="${product.image}" alt="${product.title}">
                <div class="item-details">
                    <strong style="font-size: 0.9em;">${product.title}</strong>
                    <div class="rating-stars">${getStarRating(product.avgRating)}</div>
                    <span style="font-size: 0.9em;">$${product.price.toFixed(2)}</span>
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    modalSuggestedSection.innerHTML = html;
}

function renderProductReviews(reviews, avgRating) {
    avgRatingSpan.textContent = avgRating.toFixed(1);
    
    if (reviews.length === 0) {
        reviewsList.innerHTML = `<p style="color: #666;">No customer reviews yet. Be the first!</p>`;
        return;
    }
    
    reviewsList.innerHTML = reviews.map(review => `
        <div class="review-item">
            <div class="rating">${getStarRating(review.rating)}</div>
            <strong>${review.user}</strong>
            <p>${review.comment}</p>
        </div>
    `).join('');
}

// --- NEW SIZE GUIDE MODAL HANDLERS ---
if (closeProductViewSizeGuideModal) {
    closeProductViewSizeGuideModal.onclick = () => {
        productViewSizeGuideModal.style.display = "none";
    };
}
window.addEventListener('click', function(event) {
    if (event.target === productViewSizeGuideModal) {
        productViewSizeGuideModal.style.display = "none";
    }
});
// -------------------------------------


// Function to display an individual product's detailed view
function renderProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let defaultSize = null;
    const userCoreTops = extractCoreSize(userSizes.tops);
    const userCoreBottoms = extractCoreSize(userSizes.bottoms); 

    // Determine the recommended size based on product type
    if (product.type === "Tops" || product.type === "Dress" || product.type === "Outerwear") {
        if (product.sizes.includes(userCoreTops)) {
            defaultSize = userCoreTops;
        }
    } else if (product.type === "Bottoms") {
        if (product.sizes.includes(userCoreBottoms)) {
            defaultSize = userCoreBottoms;
        }
    }
    
    // Size Tiles HTML
    const sizeOptionsHTML = product.sizes.map(size => {
        const isDefault = size === defaultSize;
        const recommendedTag = isDefault && userCoreTops ? `(My Fit: ${size})` : '';
        const selectedClass = isDefault ? 'selected' : '';
        return `
            <div class="size-tile ${selectedClass}" data-size="${size}">
                ${size} ${recommendedTag}
            </div>
        `;
    }).join('');

    const productHTML = `
        <div class="product-detail-image">
            <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="product-detail-info">
            <h2>${product.title}</h2>
            <div class="rating-stars" style="font-size: 1.5em; margin-bottom: 5px;">${getStarRating(product.avgRating)} (${product.reviews.length})</div>
            <span class="price">$${product.price.toFixed(2)}</span>
            
            <p style="margin-bottom: 20px;">${product.description}</p>

            <label>Select Size:</label>
            <div id="sizeOptionsContainer" class="size-options-container">
                ${sizeOptionsHTML}
            </div>
            
            <button id="viewSizeGuideBtn" class="size-guide-btn">View Full Size Guide</button>
            
            <div class="product-detail-actions">
                <button id="addToCartBtn" class="primary-btn">Add to Cart</button>
            </div>
        </div>
    `;

    productDetailContent.innerHTML = productHTML;
    renderProductReviews(product.reviews, product.avgRating);
    renderSuggestedProductsInModal(product.id);

    // --- Dynamic Event Listeners for the New Content ---
    
    // Size selection logic
    let selectedSize = defaultSize;
    document.querySelectorAll('#sizeOptionsContainer .size-tile').forEach(tile => {
        tile.addEventListener('click', function() {
            document.querySelectorAll('#sizeOptionsContainer .size-tile').forEach(t => t.classList.remove('selected'));
            this.classList.add('selected');
            selectedSize = this.dataset.size;
        });
    });

    // Add to Cart logic
    document.getElementById('addToCartBtn').onclick = () => {
        if (!selectedSize) {
            showToast("Please select a size before adding to cart.", 3000);
            return;
        }
        
        cart.push({
            id: Date.now(), // Unique ID for cart item
            productId: product.id,
            title: product.title,
            price: product.price,
            size: selectedSize
        });
        
        saveAppState();
        updateCartCount();
        showToast(`Added ${product.title} (${selectedSize}) to cart!`, 3000);
        productDetailModal.style.display = "none";
        renderCart(); 
    };

    // Size Guide Button logic
    document.getElementById('viewSizeGuideBtn').onclick = () => {
        productViewSizeGuideModal.style.display = "flex";
    };

    productDetailModal.style.display = "flex";
}


// --- CART RENDERING & LOGIC ---

function renderCart() {
    const total = getCartTotal();
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <p style="text-align: center; color: #666; padding: 20px;">Your cart is empty!</p>
        `;
        document.getElementById('checkoutBtn').disabled = true;
        document.getElementById('checkoutBtn').classList.remove('primary-btn');
        document.getElementById('checkoutBtn').classList.add('secondary-btn');
    } else {
        const cartItemsHTML = cart.map((item, index) => `
            <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding: 10px 0;">
                <div style="flex-grow: 1;">
                    <strong>${item.title}</strong>
                    <p style="font-size: 0.9em; color: #555;">Size: ${item.size}</p>
                    <p style="font-weight: bold; color: #000;">$${item.price.toFixed(2)}</p>
                </div>
                <button onclick="removeFromCart(${index})" style="background: none; border: none; color: red; font-size: 1.2em; cursor: pointer;">&times;</button>
            </div>
        `).join('');

        cartItemsContainer.innerHTML = cartItemsHTML + `
            <div style="text-align: right; font-size: 1.2em; font-weight: bold; margin-top: 15px;">
                Cart Total: $${total.toFixed(2)}
            </div>
        `;
        document.getElementById('checkoutBtn').disabled = false;
        document.getElementById('checkoutBtn').classList.add('primary-btn');
        document.getElementById('checkoutBtn').classList.remove('secondary-btn');
    }
}

function removeFromCart(index) {
    const itemTitle = cart[index].title;
    cart.splice(index, 1);
    saveAppState();
    updateCartCount();
    renderCart();
    showToast(`${itemTitle} removed from cart.`, 3000);
}


// --- PRODUCT & OUTFIT GRID RENDERING ---

function renderProductItem(product) {
    const userCoreTops = extractCoreSize(userSizes.tops);
    const userCoreBottoms = extractCoreSize(userSizes.bottoms); 
    
    let fitBadge = '';
    const isTop = product.type === "Tops" || product.type === "Dress" || product.type === "Outerwear";
    const isBottom = product.type === "Bottoms";

    if ((isTop && product.sizes.includes(userCoreTops)) || (isBottom && product.sizes.includes(userCoreBottoms))) {
        fitBadge = `<span style="background-color: #00a651; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7em; margin-right: 5px;">✅ My Fit</span>`;
    }

    return `
        <div class="product-item" onclick="window.renderProductDetail(${product.id})">
            <img src="${product.image}" alt="${product.title}">
            <div class="product-info">
                <strong title="${product.title}">${product.title}</strong>
                <span>${fitBadge}$${product.price.toFixed(2)}</span>
                <div class="rating-stars" style="font-size: 1em;">${getStarRating(product.avgRating)}</div>
            </div>
        </div>
    `;
}

function renderProducts() {
    let filteredProducts = products.slice(); 

    // Filter by selected tags
    if (selectedTags.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            product.tags.some(tag => selectedTags.includes(tag))
        );
    }
    
    // Filter by 'My Size'
    if (mySizeFilter && mySizeFilter.checked) {
        const userCoreTops = extractCoreSize(userSizes.tops);
        const userCoreBottoms = extractCoreSize(userSizes.bottoms); 
        
        filteredProducts = filteredProducts.filter(product => {
            const isTop = product.type === "Tops" || product.type === "Dress" || product.type === "Outerwear";
            const isBottom = product.type === "Bottoms";
            
            const hasTopsFit = isTop && product.sizes.includes(userCoreTops);
            const hasBottomsFit = isBottom && product.sizes.includes(userCoreBottoms);
            
            return hasTopsFit || hasBottomsFit;
        });
    }

    // Sort products
    const sortValue = priceSortSelect.value;
    if (sortValue === 'low_to_high') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'high_to_low') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } 

    productGridContainer.innerHTML = filteredProducts.map(renderProductItem).join('');
}


function renderOutfits() {
    // Mock outfit generation logic based on user size and tags
    const userCoreTops = extractCoreSize(userSizes.tops);
    const userCoreBottoms = extractCoreSize(userSizes.bottoms); 

    const topsForUser = products.filter(p => p.type !== "Bottoms" && p.sizes.includes(userCoreTops || 'M'));
    const bottomsForUser = products.filter(p => p.type === "Bottoms" && p.sizes.includes(userCoreBottoms || 'M'));

    let outfitsHTML = '';

    if (topsForUser.length > 0 && bottomsForUser.length > 0) {
        // Generate up to 3 random outfits
        for (let i = 0; i < Math.min(3, topsForUser.length, bottomsForUser.length); i++) {
            const top = topsForUser[i]; // Simple sequential pairing for mock-up
            const bottom = bottomsForUser[i];
            
            // This is a mockup; in a real app, you'd combine images/styles
            outfitsHTML += `
                <div class="wardrobe-item" onclick="showToast('Outfit Suggestion: ${top.title} + ${bottom.title} (Size: ${userCoreTops || 'M'})', 4000)">
                    <img src="${top.image}" alt="Outfit Image" style="height: 150px; object-fit: cover;">
                    <div class="product-info" style="padding: 0.5rem; text-align: center;">
                        <strong style="font-size: 0.9em;">Fit #${i + 1}</strong>
                        <span style="font-size: 0.8em; color: green;">Your Perfect Fit</span>
                    </div>
                </div>
            `;
        }
    } else {
        outfitsHTML = '<p style="padding: 10px; color: #666;">Set your size to view personalized outfit suggestions!</p>';
    }

    outfitsContainer.innerHTML = outfitsHTML;
}


function renderTags() {
    tagsContainer.innerHTML = tags.map(tag => `
        <button class="${selectedTags.includes(tag) ? 'active' : ''}" data-tag="${tag}">${tag}</button>
    `).join('');
    
    document.querySelectorAll('.tags button').forEach(button => {
        button.addEventListener('click', function() {
            const tag = this.dataset.tag;
            const index = selectedTags.indexOf(tag);
            if (index > -1) {
                selectedTags.splice(index, 1);
            } else {
                selectedTags.push(tag);
            }
            renderTags(); // Re-render tags to update active state
            renderProducts(); 
        });
    });
}


// --- INITIALIZATION ---

function initializeApp() {
    window.renderProductDetail = renderProductDetail; 
    
    loadAppState();
    updateCartCount();
    renderTags();
    renderProducts();
    renderOutfits();
    
    // Add event listeners for sorting and filtering
    priceSortSelect.addEventListener('change', renderProducts);
    mySizeFilter.addEventListener('change', renderProducts);

    // Navigation listeners
    profileBtn.addEventListener('click', () => navigateTo('profile'));
    openCartBtn.addEventListener('click', () => {
        renderCart();
        cartModal.style.display = "flex";
    });

    // Close cart modal
    document.getElementById("closeCartModal").addEventListener('click', () => {
        cartModal.style.display = "none";
    });
    
    // Close product detail modal
    document.getElementById("closeProductDetailModal").addEventListener('click', () => {
        productDetailModal.style.display = "none";
    });
    
    // Checkout button inside cart
    document.getElementById("checkoutBtn").addEventListener('click', () => {
        cartModal.style.display = "none";
        navigateTo('checkout');
    });

    // Default view
    navigateTo('browsing');
    
    // Check for existing user sizes and prompt if not set
    if (!userSizes.tops || !userSizes.bottoms) {
        setTimeout(() => {
            showToast("Welcome! Set your size for personalized fit recommendations.", 5000);
        }, 1000); 
        // For the full experience, uncomment the line below:
        // initializeMeasurementsModal();
    }
}

initializeApp();
