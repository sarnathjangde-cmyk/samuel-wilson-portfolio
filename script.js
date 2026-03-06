// ग्लोबल वेरिएबल्स
let currentUser = null;
let posters = {
    graphicDesign: [],
    webDesign: []
};
let users = [];
let chats = [];

// लोडिंग एनिमेशन
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelector('.loader').style.display = 'none';
        document.querySelector('.website-content').style.display = 'block';
    }, 2500);
    
    // लोकल स्टोरेज से डेटा लोड करें
    loadData();
    renderPosters();
});

// डेटा लोड करें
function loadData() {
    // यूजर्स लोड करें
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    }
    
    // चैट्स लोड करें
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
        chats = JSON.parse(savedChats);
    }
    
    // पोस्टर्स लोड करें
    loadDemoPosters();
}

// डेमो पोस्टर्स लोड करें - यहाँ अपने image paths डालो
function loadDemoPosters() {
    // ग्राफिक डिजाइन पोस्टर्स
    posters.graphicDesign = [
        {
            id: 1,
            title: "ग्राफिक डिजाइन 1",
            image: "images/graphic-design/poster1.jpg",  // ← यहाँ अपना path डालो
            likes: 45000,
            category: "graphic"
        },
        {
            id: 2,
            title: "ग्राफिक डिजाइन 2",
            image: "images/graphic-design/poster2.jpg",  // ← यहाँ अपना path डालो
            likes: 32000,
            category: "graphic"
        },
        {
            id: 3,
            title: "ग्राफिक डिजाइन 3",
            image: "images/graphic-design/poster3.jpg",  // ← यहाँ अपना path डालो
            likes: 28000,
            category: "graphic"
        }
    ];
    
    // वेब डिजाइन पोस्टर्स
    posters.webDesign = [
        {
            id: 101,
            title: "वेब डिजाइन 1",
            image: "images/web-design/website1.jpg",  // ← यहाँ अपना path डालो
            likes: 67000,
            category: "web"
        },
        {
            id: 102,
            title: "वेब डिजाइन 2",
            image: "images/web-design/website2.jpg",  // ← यहाँ अपना path डालो
            likes: 54000,
            category: "web"
        },
        {
            id: 103,
            title: "वेब डिजाइन 3",
            image: "images/web-design/website3.jpg",  // ← यहाँ अपना path डालो
            likes: 41000,
            category: "web"
        }
    ];
}

// पोस्टर्स रेंडर करें
function renderPosters() {
    // ग्राफिक डिजाइन पोस्टर्स
    const graphicGrid = document.getElementById('graphicDesigns');
    graphicGrid.innerHTML = posters.graphicDesign.map(poster => `
        <div class="poster-card" data-id="${poster.id}" data-category="graphic">
            <img src="${poster.image}" alt="${poster.title}" class="poster-image">
            <div class="poster-info">
                <h3 class="poster-title">${poster.title}</h3>
                <div class="poster-actions">
                    <button class="like-btn ${isLikedByUser(poster.id) ? 'active' : ''}" onclick="toggleLike(${poster.id}, 'graphic')">
                        <i class="fas fa-heart"></i>
                    </button>
                    <span class="like-count">${poster.likes}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    // वेब डिजाइन पोस्टर्स
    const webGrid = document.getElementById('webDesigns');
    webGrid.innerHTML = posters.webDesign.map(poster => `
        <div class="poster-card" data-id="${poster.id}" data-category="web">
            <img src="${poster.image}" alt="${poster.title}" class="poster-image">
            <div class="poster-info">
                <h3 class="poster-title">${poster.title}</h3>
                <div class="poster-actions">
                    <button class="like-btn ${isLikedByUser(poster.id) ? 'active' : ''}" onclick="toggleLike(${poster.id}, 'web')">
                        <i class="fas fa-heart"></i>
                    </button>
                    <span class="like-count">${poster.likes}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// चेक करें कि यूजर ने लाइक किया है या नहीं
function isLikedByUser(posterId) {
    if (!currentUser) return false;
    return currentUser.likes && currentUser.likes.includes(posterId);
}

// लाइक टॉगल करें
function toggleLike(posterId, category) {
    if (!currentUser) {
        alert('कृपया पहले लॉगिन करें');
        document.getElementById('loginModal').style.display = 'block';
        return;
    }
    
    const poster = category === 'graphic' 
        ? posters.graphicDesign.find(p => p.id === posterId)
        : posters.webDesign.find(p => p.id === posterId);
    
    if (!poster) return;
    
    const liked = currentUser.likes.includes(posterId);
    
    if (liked) {
        // अनलाइक करें
        poster.likes--;
        currentUser.likes = currentUser.likes.filter(id => id !== posterId);
    } else {
        // लाइक करें
        poster.likes++;
        currentUser.likes.push(posterId);
    }
    
    // यूजर डेटा सेव करें
    saveUserData();
    renderPosters();
}

// यूजर डेटा सेव करें
function saveUserData() {
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
    }
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

// लॉगिन मॉडल
const loginModal = document.getElementById('loginModal');
const profileBtn = document.getElementById('profileBtn');
const closeBtn = document.querySelector('.close');

profileBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentUser) {
        // प्रोफाइल मॉडल दिखाएं
        showProfileModal();
    } else {
        loginModal.style.display = 'block';
    }
});

closeBtn.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

// लॉगिन फॉर्म सबमिट
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const identifier = document.getElementById('loginIdentifier').value;
    
    // चेक करें यूजर पहले से मौजूद है या नहीं
    let user = users.find(u => u.email === identifier || u.phone === identifier);
    
    if (!user) {
        // नया यूजर बनाएं
        user = {
            id: Date.now(),
            email: identifier.includes('@') ? identifier : null,
            phone: identifier.includes('@') ? null : identifier,
            likes: [],
            favorites: [],
            createdAt: new Date().toISOString()
        };
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    loginModal.style.display = 'none';
    showProfileModal();
});

// प्रोफाइल मॉडल दिखाएं
function showProfileModal() {
    const profileModal = document.getElementById('profileModal');
    profileModal.style.display = 'block';
    
    // पसंदीदा पोस्टर्स दिखाएं
    renderFavorites();
    
    // चैट मैसेज दिखाएं
    renderUserChats();
}

// पसंदीदा पोस्टर्स रेंडर करें
function renderFavorites() {
    const favoritesGrid = document.querySelector('.favorites-grid');
    if (!currentUser) return;
    
    const favoritePosters = [];
    
    // ग्राफिक डिजाइन से पसंदीदा
    posters.graphicDesign.forEach(poster => {
        if (currentUser.likes.includes(poster.id)) {
            favoritePosters.push(poster);
        }
    });
    
    // वेब डिजाइन से पसंदीदा
    posters.webDesign.forEach(poster => {
        if (currentUser.likes.includes(poster.id)) {
            favoritePosters.push(poster);
        }
    });
    
    if (favoritePosters.length === 0) {
        favoritesGrid.innerHTML = '<p class="no-favorites">अभी तक कोई पसंदीदा पोस्टर नहीं है</p>';
    } else {
        favoritesGrid.innerHTML = favoritePosters.map(poster => `
            <div class="poster-card">
                <img src="${poster.image}" alt="${poster.title}" class="poster-image">
                <div class="poster-info">
                    <h3 class="poster-title">${poster.title}</h3>
                </div>
            </div>
        `).join('');
    }
}

// यूजर चैट रेंडर करें
function renderUserChats() {
    const chatMessages = document.getElementById('userChatMessages');
    if (!currentUser) return;
    
    const userChats = chats.filter(chat => chat.userId === currentUser.id);
    
    chatMessages.innerHTML = userChats.map(chat => `
        <div class="message ${chat.sender === 'user' ? 'user' : 'admin'}">
            <div class="message-content">${chat.message}</div>
            <div class="message-time">${new Date(chat.timestamp).toLocaleTimeString()}</div>
        </div>
    `).join('');
}

// सपोर्ट चैट
const supportChatBtn = document.getElementById('supportChatBtn');
const supportChatModal = document.getElementById('supportChatModal');
const closeSupport = document.querySelector('.close-support');

supportChatBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!currentUser) {
        alert('कृपया पहले लॉगिन करें');
        loginModal.style.display = 'block';
        return;
    }
    supportChatModal.style.display = 'block';
    renderSupportChat();
});

closeSupport.addEventListener('click', () => {
    supportChatModal.style.display = 'none';
});

// सपोर्ट चैट रेंडर करें
function renderSupportChat() {
    const chatMessages = document.getElementById('supportChatMessages');
    if (!currentUser) return;
    
    const userChats = chats.filter(chat => chat.userId === currentUser.id);
    
    chatMessages.innerHTML = userChats.map(chat => `
        <div class="message ${chat.sender === 'user' ? 'user' : 'admin'}">
            <div class="message-content">${chat.message}</div>
            <div class="message-time">${new Date(chat.timestamp).toLocaleTimeString()}</div>
        </div>
    `).join('');
}

// चैट मैसेज भेजें
document.getElementById('sendSupportChat').addEventListener('click', () => {
    sendMessage('support');
});

document.getElementById('sendUserChat').addEventListener('click', () => {
    sendMessage('user');
});

function sendMessage(type) {
    const input = type === 'support' 
        ? document.getElementById('supportChatInput')
        : document.getElementById('userChatInput');
    
    const message = input.value.trim();
    if (!message || !currentUser) return;
    
    const chatMessage = {
        id: Date.now(),
        userId: currentUser.id,
        message: message,
        sender: 'user',
        timestamp: new Date().toISOString(),
        read: false
    };
    
    chats.push(chatMessage);
    localStorage.setItem('chats', JSON.stringify(chats));
    
    input.value = '';
    
    if (type === 'support') {
        renderSupportChat();
    } else {
        renderUserChats();
    }
    
    // एडमिन को नोटिफिकेशन (अगर एडमिन पैनल खुला है)
    if (document.getElementById('adminChatPanel').style.display === 'block') {
        renderAdminChats();
    }
}

// एडमिन पैनल (सिक्योरिटी की के साथ)
let adminLoggedIn = false;

// एडमिन लॉगिन (सिक्योर की: admin123)
window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        const password = prompt('एडमिन पासवर्ड दर्ज करें:');
        if (password === 'admin123') {
            adminLoggedIn = true;
            document.getElementById('adminChatPanel').style.display = 'block';
            renderAdminChats();
        }
    }
});

// एडमिन चैट रेंडर करें
function renderAdminChats() {
    const adminChats = document.querySelector('.admin-chats');
    
    // यूजर्स के अनुसार चैट ग्रुप करें
    const chatGroups = {};
    chats.forEach(chat => {
        if (!chatGroups[chat.userId]) {
            chatGroups[chat.userId] = [];
        }
        chatGroups[chat.userId].push(chat);
    });
    
    adminChats.innerHTML = Object.keys(chatGroups).map(userId => {
        const user = users.find(u => u.id == userId);
        const userChats = chatGroups[userId];
        const unreadCount = userChats.filter(c => !c.read && c.sender === 'user').length;
        
        return `
            <div class="admin-chat-group" data-userid="${userId}">
                <div class="admin-chat-header">
                    <h4>${user ? user.email || user.phone : 'Unknown User'}</h4>
                    ${unreadCount > 0 ? `<span class="unread-badge">${unreadCount}</span>` : ''}
                </div>
                <div class="admin-chat-messages" id="admin-chat-${userId}">
                    ${userChats.map(chat => `
                        <div class="message ${chat.sender}">
                            <div class="message-content">${chat.message}</div>
                            <div class="message-time">${new Date(chat.timestamp).toLocaleTimeString()}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="admin-chat-reply">
                    <textarea id="reply-${userId}" placeholder="जवाब लिखें..."></textarea>
                    <button onclick="sendAdminReply(${userId})">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// एडमिन रिप्लाई भेजें
function sendAdminReply(userId) {
    const replyInput = document.getElementById(`reply-${userId}`);
    const message = replyInput.value.trim();
    
    if (!message) return;
    
    const chatMessage = {
        id: Date.now(),
        userId: userId,
        message: message,
        sender: 'admin',
        timestamp: new Date().toISOString(),
        read: true
    };
    
    chats.push(chatMessage);
    localStorage.setItem('chats', JSON.stringify(chats));
    
    replyInput.value = '';
    renderAdminChats();
}

// एडमिन पैनल बंद करें
document.getElementById('closeAdminPanel').addEventListener('click', () => {
    document.getElementById('adminChatPanel').style.display = 'none';
    adminLoggedIn = false;
});

// प्रोफाइल टैब स्विचिंग
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        const tab = e.target.dataset.tab;
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(tab + 'Tab').classList.add('active');
    });
});

// प्रोफाइल मॉडल बंद करें
document.querySelector('.close-profile').addEventListener('click', () => {
    document.getElementById('profileModal').style.display = 'none';
});

// विंडो के बाहर क्लिक करने पर मॉडल बंद करें
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// ज्वाइन फॉर्म सबमिट
document.getElementById('joinForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('धन्यवाद! हम जल्द ही आपसे संपर्क करेंगे।');
    e.target.reset();
});

// स्मूथ स्क्रोलिंग
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// स्क्रॉल पर नेविगेशन एक्टिव
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});





