document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const splashScreen = document.getElementById('splash-screen');
    const appContainer = document.getElementById('app-container');
    const mainContent = document.getElementById('main-content');
    const bottomNavItems = document.querySelectorAll('.nav-item');
    const menuBtn = document.getElementById('menu-btn');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    const sideDrawer = document.getElementById('side-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const fullModal = document.getElementById('full-modal');
    const fabUpload = document.getElementById('fab-upload');
    const fabContainer = document.getElementById('fab-container');
    const fabBackdrop = document.getElementById('fab-backdrop');
    const notifBtn = document.getElementById('notif-btn');
    const toast = document.getElementById('toast');

    // Init FAB visibility from persisted setting
    if (localStorage.getItem('fab-enabled') === 'false') fabContainer.style.display = 'none';

    // Templates
    const templates = {
        'discover': document.getElementById('tpl-discover'),
        'events': document.getElementById('tpl-events'),
        'profile': document.getElementById('tpl-profile'),
        'ask-expert': document.getElementById('tpl-ask-expert'),
        'support': document.getElementById('tpl-support'),
        'products': document.getElementById('tpl-products'),
        'store-locator': document.getElementById('tpl-store-locator'),
        'settings': document.getElementById('tpl-settings')
    };

    // Rich Sample Data for Feed
    const feedData = [
        {
            id: 1,
            url: 'https://images.unsplash.com/photo-1518635017482-1216d6101cce?auto=format&fit=crop&w=600&q=80',
            category: 'Street',
            title: 'Rainy Commute',
            author: 'Marcus Lens',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
            location: 'Tokyo, Japan',
            likes: 12400,
            comments: 342,
            camera: 'Alpha 1',
            lens: 'FE 35mm F1.4 GM',
            settings: 'f/1.4 | 1/60s | ISO 800',
            description: 'Rainy evenings in Shinjuku always provide the best reflections.',
            timestamp: Date.now() - 3600000 
        },
        {
            id: 2,
            url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
            category: 'Landscape',
            title: 'Morning Silence',
            author: 'Elena Wood',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
            location: 'Yosemite National Park',
            likes: 8900,
            comments: 120,
            camera: 'Alpha 7R V',
            lens: 'FE 16-35mm F2.8 GM',
            settings: 'f/8 | 1/125s | ISO 100',
            description: 'Captured the mist rolling over the hills just before sunrise.',
            timestamp: Date.now() - 7200000 
        },
        {
            id: 3,
            url: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=600&q=80',
            category: 'Wildlife',
            title: 'The King',
            author: 'David Hunt',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
            location: 'Serengeti, Tanzania',
            likes: 21000,
            comments: 890,
            camera: 'Alpha 9 II',
            lens: 'FE 600mm F4 GM OSS',
            settings: 'f/4 | 1/2000s | ISO 640',
            description: 'Waited 3 days in the blind for this single moment.',
            timestamp: Date.now() - 86400000 
        },
        {
            id: 4,
            url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80',
            category: 'Portrait',
            title: 'Golden Hour',
            author: 'Sarah Chen',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
            location: 'Los Angeles, CA',
            likes: 5600,
            comments: 89,
            camera: 'Alpha 7 IV',
            lens: 'FE 85mm F1.4 GM',
            settings: 'f/1.4 | 1/500s | ISO 100',
            description: 'Natural light only.',
            timestamp: Date.now() - 172800000 
        },
        {
            id: 5,
            url: 'https://images.unsplash.com/photo-1516214104703-d2507f0144aa?auto=format&fit=crop&w=600&q=80',
            category: 'Cinematic',
            title: 'Neon Drift',
            author: 'Kenji Sato',
            avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=100&q=80',
            location: 'Osaka, Japan',
            likes: 15400,
            comments: 210,
            camera: 'FX3',
            lens: 'FE 50mm F1.2 GM',
            settings: 'f/1.2 | 1/50s | ISO 3200',
            description: 'Cyberpunk vibes.',
            timestamp: Date.now() - 4000000 
        },
        {
            id: 6,
            url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=600&q=80',
            category: 'Street',
            title: 'Subway Thoughts',
            author: 'Marcus Lens',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
            location: 'New York, NY',
            likes: 9800,
            comments: 112,
            camera: 'Alpha 7C',
            lens: 'FE 40mm F2.5 G',
            settings: 'f/2.8 | 1/100s | ISO 1600',
            description: 'Quiet moments in the chaos.',
            timestamp: Date.now() - 5000000 
        }
    ];

    // Current state
    let currentFilter = 'All';
    let currentSort = 'trending';
    // Persisted save state: set of saved photo IDs
    const savedPosts = new Set();

    // --- Initialization ---
    setTimeout(() => {
        splashScreen.classList.add('hidden');
        appContainer.classList.remove('hidden');
        appContainer.classList.add('visible');
        loadView('discover'); 
    }, 1500); 

    // --- Toast Notifications ---
    window.showToast = function(message) {
        toast.querySelector('.toast-message').innerText = message;
        toast.classList.remove('hidden');
        toast.classList.add('visible');
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.classList.add('hidden'), 300);
        }, 3000);
    };

    // --- Navigation Logic ---
    bottomNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            bottomNavItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            const target = item.getAttribute('data-target');
            loadView(target);
        });
    });

    window.loadView = function(viewName) {
        mainContent.innerHTML = ''; 
        if(!templates[viewName]) return;
        let clone = templates[viewName].content.cloneNode(true);
        
        if (viewName === 'discover') {
            const feedContainer = clone.querySelector('#discover-feed');
            
            // Set up sorting
            const sortToggle = clone.querySelector('#sort-toggle');
            const sortMenu = clone.querySelector('#sort-menu');
            const sortOptions = clone.querySelectorAll('.sort-option');
            const currentSortLabel = clone.querySelector('#current-sort');

            sortToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                sortMenu.classList.toggle('hidden');
            });

            document.addEventListener('click', () => {
                if(!sortMenu.classList.contains('hidden')) {
                    sortMenu.classList.add('hidden');
                }
            });

            sortOptions.forEach(opt => {
                opt.addEventListener('click', (e) => {
                    e.stopPropagation();
                    sortOptions.forEach(o => o.classList.remove('active'));
                    opt.classList.add('active');
                    currentSort = opt.getAttribute('data-sort');
                    currentSortLabel.innerText = opt.innerText;
                    sortMenu.classList.add('hidden');
                    renderFeed(feedContainer);
                });
            });

            // Set up filtering
            const categories = clone.querySelectorAll('.category');
            categories.forEach(cat => {
                cat.addEventListener('click', () => {
                    categories.forEach(c => c.classList.remove('active'));
                    cat.classList.add('active');
                    currentFilter = cat.getAttribute('data-filter');
                    renderFeed(feedContainer);
                });
            });

            mainContent.appendChild(clone);
            renderFeed(document.getElementById('discover-feed'));
            
        } else if (viewName === 'events') {
            const eventCategories = clone.querySelectorAll('.category');
            mainContent.appendChild(clone);

            // Setting up event filtering logic after appending to DOM
            const eventsListContainer = document.getElementById('events-list');
            const eventCards = eventsListContainer.querySelectorAll('.event-card');

            // re-select event categories from real DOM
            document.querySelectorAll('.view-events .category').forEach(cat => {
                cat.addEventListener('click', () => {
                    document.querySelectorAll('.view-events .category').forEach(c => c.classList.remove('active'));
                    cat.classList.add('active');
                    
                    const filter = cat.getAttribute('data-event-filter');
                    window.showToast('Showing: ' + filter);

                    eventCards.forEach(card => {
                        if(filter === 'All') {
                            card.style.display = 'flex';
                        } else {
                            if(card.getAttribute('data-type') === filter) {
                                card.style.display = 'flex';
                            } else {
                                card.style.display = 'none';
                            }
                        }
                    });
                });
            });
            
        } else if (viewName === 'profile') {
            const profileFeed = clone.querySelector('#profile-feed');
            const emptyState = clone.querySelector('#profile-empty-state');
            
            renderProfileFeed(profileFeed, emptyState, feedData.slice(0, 3));
            
            const tabs = clone.querySelectorAll('.profile-tabs .tab');
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    const tabType = tab.getAttribute('data-profile-tab');
                    
                    if (tabType === 'uploads') {
                        renderProfileFeed(profileFeed, emptyState, feedData.slice(0, 3));
                    } else if (tabType === 'saved') {
                        renderProfileFeed(profileFeed, emptyState, [feedData[4]]);
                    } else {
                        renderProfileFeed(profileFeed, emptyState, []);
                    }
                });
            });
            mainContent.appendChild(clone);
            
        } else if (viewName === 'store-locator') {
            mainContent.appendChild(clone);
            // Setup mock search for store locator
            const searchInput = document.getElementById('store-search');
            const loadingText = document.getElementById('store-loading');
            const resultsDiv = document.getElementById('store-results');

            searchInput.addEventListener('keydown', (e) => {
                if(e.key === 'Enter') {
                    resultsDiv.classList.add('hidden');
                    loadingText.classList.remove('hidden');
                    loadingText.innerText = 'Searching for "' + searchInput.value + '"...';
                    
                    setTimeout(() => {
                        loadingText.classList.add('hidden');
                        resultsDiv.innerHTML = `
                            <div class="glass-panel" style="padding: 15px; border-radius: var(--border-radius-md); margin-bottom: 15px;">
                                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                                    <div>
                                        <div style="font-weight: 600; font-size: 1.1rem;">Sony Square - New Flagship</div>
                                        <div style="color: var(--text-secondary); font-size: 0.85rem;">0.5 miles away</div>
                                    </div>
                                    <div style="color: var(--success-green, #4CAF50); font-weight: 600; font-size: 0.85rem;">Open</div>
                                </div>
                                <div style="display: flex; gap: 10px;">
                                    <button class="btn-secondary glass-btn" style="flex: 1; padding: 8px;" onclick="window.showToast('Opening Maps...')">Directions</button>
                                    <button class="btn-secondary glass-btn" style="flex: 1; padding: 8px;" onclick="window.showToast('Calling Flagship...')">Call</button>
                                </div>
                            </div>
                        `;
                        resultsDiv.classList.remove('hidden');
                    }, 1000);
                }
            });
        } else if (viewName === 'products') {
            mainContent.appendChild(clone);
            // Products category filter
            const prodCats = document.querySelectorAll('.view-page .category[data-prod-filter]');
            const prodCards = document.querySelectorAll('#products-grid .product-card');
            prodCats.forEach(cat => {
                cat.addEventListener('click', () => {
                    prodCats.forEach(c => c.classList.remove('active'));
                    cat.classList.add('active');
                    const filter = cat.getAttribute('data-prod-filter');
                    prodCards.forEach(card => {
                        card.style.display = card.getAttribute('data-prod-type') === filter ? 'block' : 'none';
                    });
                });
            });
        } else if (viewName === 'settings') {
            mainContent.appendChild(clone);
            // Wire up FAB toggle
            const fabToggleRow = document.getElementById('settings-fab-toggle');
            const fabToggleIcon = document.getElementById('settings-fab-toggle-icon');
            function syncFabToggleUI() {
                const on = localStorage.getItem('fab-enabled') !== 'false';
                fabToggleIcon.textContent = on ? 'toggle_on' : 'toggle_off';
                fabToggleIcon.style.color = on ? 'var(--alpha-orange)' : 'var(--text-tertiary)';
            }
            syncFabToggleUI();
            fabToggleRow.addEventListener('click', () => {
                const wasOn = localStorage.getItem('fab-enabled') !== 'false';
                const nowOn = !wasOn;
                localStorage.setItem('fab-enabled', nowOn);
                fabContainer.style.display = nowOn ? '' : 'none';
                syncFabToggleUI();
                window.showToast(nowOn ? '✅ Floating button enabled' : '🚫 Floating button hidden');
            });
        } else {
            // For ask-expert, support
            mainContent.appendChild(clone);
        }

        // Scroll back to top to ensure clean view on navigation
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function renderFeed(container) {
        container.innerHTML = '';
        const fmtN = n => n >= 1000 ? (n/1000).toFixed(1)+'k' : n;

        let filteredData = [...feedData];
        if (currentFilter !== 'All') {
            filteredData = filteredData.filter(item => item.category === currentFilter);
        }
        if (currentSort === 'latest') {
            filteredData.sort((a, b) => b.timestamp - a.timestamp);
        } else if (currentSort === 'likes') {
            filteredData.sort((a, b) => b.likes - a.likes);
        } else {
            filteredData.sort((a, b) => a.id - b.id);
        }

        if (filteredData.length === 0) {
            container.innerHTML = `<div style="grid-column:span 2;text-align:center;padding:40px 20px;color:var(--text-secondary);">No posts found.</div>`;
            return;
        }

        filteredData.forEach((item, index) => {
            const el = document.createElement('div');
            el.className = 'feed-item fade-in skeleton ripple' + (index === 0 ? ' feed-featured' : '');
            el.style.animationDelay = `${index * 0.05}s`;

            const img = document.createElement('img');
            img.src = item.url;
            img.loading = 'lazy';
            img.alt = item.title;
            img.onload = () => { el.classList.remove('skeleton'); img.classList.add('loaded'); };
            img.onerror = () => {
                img.src = 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80';
                el.classList.remove('skeleton'); img.classList.add('loaded');
            };
            el.appendChild(img);

            // Category badge
            const badge = document.createElement('div');
            badge.className = 'feed-badge';
            badge.textContent = item.category;
            el.appendChild(badge);

            // Author + likes overlay
            const overlay = document.createElement('div');
            overlay.className = 'feed-overlay';
            overlay.innerHTML = `
                <div class="feed-author">
                    <img src="${item.avatar}" class="feed-author-avatar" alt="${item.author}">
                    <span>${item.author.split(' ')[0]}</span>
                </div>
                <div class="feed-likes">
                    <span class="material-symbols-outlined" style="font-size:0.85rem;font-variation-settings:'FILL' 1">favorite</span>
                    ${fmtN(item.likes)}
                </div>`;
            el.appendChild(overlay);

            el.addEventListener('click', () => openPhotoDetail(item));
            container.appendChild(el);
        });
    }

    function renderProfileFeed(container, emptyState, items) {
        container.innerHTML = '';
        if (items.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
            items.forEach((item, index) => {
                const el = document.createElement('div');
                el.className = 'feed-item fade-in skeleton ripple';
                el.style.animationDelay = `${index * 0.05}s`;
                
                const img = document.createElement('img');
                img.src = item.url;
                img.loading = 'lazy';
                img.alt = item.title;
                img.onload = () => {
                    el.classList.remove('skeleton');
                    img.classList.add('loaded');
                };
                img.onerror = () => {
                    img.src = 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80';
                    el.classList.remove('skeleton');
                    img.classList.add('loaded');
                };
                
                el.appendChild(img);
                el.addEventListener('click', () => openPhotoDetail(item));
                container.appendChild(el);
            });
        }
    }

    // --- Drawer Logic ---
    function toggleDrawer() {
        const isActive = sideDrawer.classList.contains('active');
        if (isActive) {
            sideDrawer.classList.remove('active');
            drawerOverlay.classList.remove('active');
        } else {
            sideDrawer.classList.add('active');
            drawerOverlay.classList.add('active');
        }
    }

    menuBtn.addEventListener('click', toggleDrawer);
    closeDrawerBtn.addEventListener('click', toggleDrawer);
    drawerOverlay.addEventListener('click', toggleDrawer);

    // Sidebar links
    const drawerLinks = document.querySelectorAll('.drawer-menu li');
    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            const target = link.getAttribute('data-target');
            toggleDrawer();
            setTimeout(() => {
                // Remove active state from bottom nav since we are deep linking
                bottomNavItems.forEach(nav => nav.classList.remove('active'));
                loadView(target);
            }, 300);
        });
    });

    // --- Modal System ---
    window.openModal = function(htmlContent) {
        const modalContent = fullModal.querySelector('.modal-content');
        modalContent.innerHTML = `
            <button class="icon-btn close-modal-btn glass-btn" onclick="closeModal()" style="position: absolute; top: 20px; left: 20px; z-index: 2010;">
                <span class="material-symbols-outlined">close</span>
            </button>
            ${htmlContent}
        `;
        fullModal.classList.add('active');
    };

    window.closeModal = function() {
        fullModal.classList.remove('active');
    };

    // --- Detail Views (Triggered via Modal) ---

    window.openPhotoDetail = function(photoObj) {
        if(typeof photoObj === 'number' || !photoObj) photoObj = feedData[0];
        const formatNumber = (num) => num > 999 ? (num/1000).toFixed(1) + 'k' : num;
        const isSaved = savedPosts.has(photoObj.id);

        const detailHtml = `
            <div class="photo-detail-view fade-in">
                <div style="position:relative;" id="detail-img-container">
                    <img src="${photoObj.url}" class="photo-full" alt="Full view">
                    <span class="material-symbols-outlined heart-burst" font-variation-settings="'FILL' 1" id="heart-burst">favorite</span>
                </div>
                <div class="photo-metadata">
                    <div class="creator-info ripple" onclick="window.showToast('Opening profile: ${photoObj.author}')">
                        <img src="${photoObj.avatar}" class="creator-avatar" alt="Avatar">
                        <div style="flex-grow: 1;">
                            <div class="creator-name">${photoObj.author}</div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary)">${photoObj.location}</div>
                        </div>
                        <button class="btn-secondary glass-btn ripple" style="padding: 6px 16px; font-size: 0.85rem; width: auto;"
                            onclick="event.stopPropagation(); this.innerText = this.innerText==='Follow'?'Following':'Follow'; this.classList.toggle('active'); window.showToast(this.innerText==='Following'?'Following ${photoObj.author}':'Unfollowed ${photoObj.author}');">Follow</button>
                    </div>

                    <h2 style="margin-bottom: 8px; font-size: 1.4rem;">${photoObj.title}</h2>
                    <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 20px; line-height: 1.5;">${photoObj.description}</p>

                    <div class="photo-actions">
                        <button class="action-btn ripple" id="like-btn-${photoObj.id}"
                            onclick="this.classList.toggle('liked'); window.showToast(this.classList.contains('liked') ? '❤️ Liked!' : 'Like removed');">
                            <span class="material-symbols-outlined">favorite</span> ${formatNumber(photoObj.likes)}
                        </button>
                        <button class="action-btn ripple" onclick="window.openComments(${photoObj.id})">
                            <span class="material-symbols-outlined">chat_bubble</span> ${photoObj.comments}
                        </button>
                        <button class="action-btn ripple" id="save-btn-${photoObj.id}"
                            onclick="window.toggleSave(${photoObj.id}, this)"
                            style="${isSaved ? 'color: var(--alpha-orange)' : ''}">
                            <span class="material-symbols-outlined" style="${isSaved ? 'font-variation-settings: FILL 1' : ''}">bookmark</span>
                            ${isSaved ? 'Saved' : 'Save'}
                        </button>
                        <button class="action-btn ripple" style="margin-left: auto;" onclick="window.showToast('🔗 Link copied!')">
                            <span class="material-symbols-outlined">share</span>
                        </button>
                    </div>

                    <div class="metadata-grid glass-panel" style="padding: 15px; border-radius: var(--border-radius-md); margin-bottom: 20px;">
                        <div class="meta-item">
                            <span class="meta-label">Camera</span>
                            <span class="meta-value" style="cursor:pointer; color: var(--alpha-orange);"
                                onclick="window.openGearSearch('${photoObj.camera}')">${photoObj.camera} ↗</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Lens</span>
                            <span class="meta-value" style="cursor:pointer; color: var(--alpha-orange);"
                                onclick="window.openGearSearch('${photoObj.lens}')">${photoObj.lens} ↗</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Settings</span>
                            <span class="meta-value tech">${photoObj.settings}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Category</span>
                            <span class="meta-value" style="cursor:pointer;"
                                onclick="closeModal(); document.querySelector('.category[data-filter=\\'${photoObj.category}\\']')?.click();">${photoObj.category}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        openModal(detailHtml);

        // Double Tap to Like Logic
        let lastTap = 0;
        const imgContainer = document.getElementById('detail-img-container');
        const heartBurst = document.getElementById('heart-burst');
        const likeBtn = document.getElementById(`like-btn-${photoObj.id}`);

        imgContainer.addEventListener('click', function(e) {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 500 && tapLength > 0) {
                // Double tap detected!
                heartBurst.classList.remove('animate');
                void heartBurst.offsetWidth; // trigger reflow
                heartBurst.classList.add('animate');
                
                if (!likeBtn.classList.contains('liked')) {
                    likeBtn.classList.add('liked');
                    window.showToast('❤️ Liked!');
                }
                e.preventDefault();
            }
            lastTap = currentTime;
        });
    };

    // Save toggle — persisted across opens
    window.toggleSave = function(id, btn) {
        if (savedPosts.has(id)) {
            savedPosts.delete(id);
            btn.innerHTML = '<span class="material-symbols-outlined">bookmark</span> Save';
            btn.style.color = '';
            window.showToast('Removed from saved');
        } else {
            savedPosts.add(id);
            btn.innerHTML = '<span class="material-symbols-outlined" style="font-variation-settings: FILL 1">bookmark</span> Saved';
            btn.style.color = 'var(--alpha-orange)';
            window.showToast('📌 Post saved!');
        }
    };

    // Comments modal
    window.openComments = function(photoId) {
        const mockComments = [
            { user: 'elena.wood', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80', text: 'This is absolutely stunning! What time was this taken?', time: '2h ago' },
            { user: 'david.hunt', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=60&q=80', text: 'Love the bokeh on the Alpha 1. Incredible DR too.', time: '5h ago' },
            { user: 'kenji.sato', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=60&q=80', text: 'You need to run a workshop, seriously 🔥', time: '1d ago' },
        ];
        const commentItems = mockComments.map(c => `
            <div style="display:flex; gap:12px; padding: 15px 0; border-bottom: 1px solid var(--glass-border);">
                <img src="${c.avatar}" style="width:36px; height:36px; border-radius:50%; object-fit:cover; flex-shrink:0;">
                <div style="flex:1;">
                    <div style="font-weight:600; font-size:0.9rem; margin-bottom:4px;">@${c.user} <span style="color:var(--text-secondary); font-weight:400; font-size:0.8rem;">${c.time}</span></div>
                    <div style="font-size:0.95rem; color:var(--text-secondary);">${c.text}</div>
                    <button style="margin-top:6px; font-size:0.8rem; color:var(--text-tertiary);" onclick="window.showToast('Reply to @${c.user}')">Reply</button>
                </div>
            </div>
        `).join('');

        const commentsHtml = `
            <div class="fade-in" style="padding: 70px 20px 100px;">
                <h2 style="font-size:1.4rem; margin-bottom:5px;">Comments</h2>
                <div style="color:var(--text-secondary); font-size:0.85rem; margin-bottom:20px;">3 comments</div>
                ${commentItems}
            </div>
            <div style="position:fixed; bottom:0; left:0; right:0; padding:15px 20px; background: rgba(10,10,10,0.9); backdrop-filter:blur(20px); border-top:1px solid var(--glass-border); display:flex; gap:10px; z-index:3000;">
                <input type="text" id="comment-input" class="glass-input" placeholder="Add a comment..." style="flex:1; padding: 12px 16px; border-radius: var(--border-radius-pill);">
                <button class="btn-primary" style="width:auto; padding: 10px 20px;"
                    onclick="const v=document.getElementById('comment-input').value.trim(); if(!v){window.showToast('Write something first!');return;} window.showToast('Comment posted!'); document.getElementById('comment-input').value='';">Post</button>
            </div>
        `;
        openModal(commentsHtml);
    };

    // Gear search → navigates to Products and highlights matching item
    window.openGearSearch = function(gearName) {
        closeModal();
        bottomNavItems.forEach(nav => nav.classList.remove('active'));
        loadView('products');
        setTimeout(() => window.showToast('🔍 Searching: ' + gearName), 400);
    };

    // Edit profile modal
    window.openEditProfile = function() {
        const editHtml = `
            <div class="fade-in" style="padding: 80px 20px 100px;">
                <h2 style="font-size:1.5rem; margin-bottom:5px;">Edit Profile</h2>
                <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:30px;">Update your Alpha Community profile.</p>

                <div style="text-align:center; margin-bottom:30px;">
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
                        style="width:90px; height:90px; border-radius:50%; object-fit:cover; border:3px solid var(--alpha-orange); margin-bottom:12px;">
                    <br>
                    <button class="btn-secondary glass-btn" style="padding:6px 20px; font-size:0.85rem; width:auto;"
                        onclick="window.showToast('Opening camera roll...')">Change Photo</button>
                </div>

                <div style="display:flex; flex-direction:column; gap:15px;">
                    <div>
                        <label style="font-size:0.8rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:1px; margin-bottom:6px; display:block;">Display Name</label>
                        <input type="text" class="glass-input" value="Alex Mercer" style="width:100%; padding:14px 16px; border-radius:var(--border-radius-sm);">
                    </div>
                    <div>
                        <label style="font-size:0.8rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:1px; margin-bottom:6px; display:block;">Username</label>
                        <input type="text" class="glass-input" value="@alex.alpha" style="width:100%; padding:14px 16px; border-radius:var(--border-radius-sm);">
                    </div>
                    <div>
                        <label style="font-size:0.8rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:1px; margin-bottom:6px; display:block;">Bio</label>
                        <textarea class="glass-input" rows="3" style="width:100%; padding:14px 16px; border-radius:var(--border-radius-sm); resize:none;">Visual storyteller. Sony Alpha Artisan.</textarea>
                    </div>
                    <div>
                        <label style="font-size:0.8rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:1px; margin-bottom:6px; display:block;">Location</label>
                        <input type="text" class="glass-input" value="New York, NY" style="width:100%; padding:14px 16px; border-radius:var(--border-radius-sm);">
                    </div>
                    <div>
                        <label style="font-size:0.8rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:1px; margin-bottom:6px; display:block;">Website</label>
                        <input type="text" class="glass-input" value="alexmercer.photo" style="width:100%; padding:14px 16px; border-radius:var(--border-radius-sm);">
                    </div>
                </div>
            </div>
            <div style="position:fixed; bottom:0; left:0; right:0; padding:15px 20px; background:rgba(10,10,10,0.9); backdrop-filter:blur(20px); border-top:1px solid var(--glass-border); z-index:3000;">
                <button class="btn-primary" style="width:100%; max-width:100%; padding:14px; font-size:1rem;"
                    onclick="window.showToast('✅ Profile saved!'); setTimeout(closeModal, 400);">Save Changes</button>
            </div>
        `;
        openModal(editHtml);
    };

    window.openEventDetail = function(type) {
        const isContest = type === 'contest';
        const detailHtml = `
            <div class="fade-in" style="padding-bottom: 100px;">
                <img src="${isContest ? 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80' : 'https://images.unsplash.com/photo-1478147424096-e61b17b2b2b4?auto=format&fit=crop&w=800&q=80'}" style="width: 100%; height: 250px; object-fit: cover;" alt="Event">
                <div style="padding: 20px;">
                    <div style="display: inline-block; background: ${isContest ? 'var(--alpha-orange)' : 'var(--accent-blue)'}; color: white; padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; margin-bottom: 12px;">${isContest ? 'Contest' : 'Workshop'}</div>
                    <h2 style="font-size: 1.6rem; margin-bottom: 10px;">${isContest ? 'Urban Lights Challenge' : 'Mastering Portrait Lighting'}</h2>
                    <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 20px;">
                        ${isContest ? 
                        'Join our monthly photography challenge. Submit your best night street photography for a chance to win a brand new Sony FE 50mm F1.2 GM lens. The community will vote on the top 10 finalists.' : 
                        'Join Alpha Artisan Jane Doe for an exclusive 2-hour online masterclass focusing on studio lighting setups for dramatic portraiture. Perfect for intermediate photographers.'}
                    </p>
                    
                    <h3 style="font-size: 1.1rem; margin-bottom: 10px; color: var(--alpha-orange);">Details</h3>
                    <ul style="color: var(--text-secondary); line-height: 1.8; margin-left: 20px; margin-bottom: 30px;">
                        <li><strong>Date:</strong> Ends October 31st</li>
                        <li><strong>Eligibility:</strong> Global, 18+</li>
                        <li><strong>Format:</strong> JPEG/RAW submission</li>
                    </ul>
                </div>
                
                <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 20px; background: rgba(10,10,10,0.8); backdrop-filter: blur(15px); border-top: 1px solid var(--glass-border); z-index: 2020;">
                    <button class="btn-primary" style="width: 100%; max-width: 100%; font-size: 1.1rem; padding: 15px;" onclick="window.showToast('${isContest ? 'Submitted Entry Successfully' : 'Registered Successfully'}'); closeModal();">
                        ${isContest ? 'Submit Entry' : 'Register Now'}
                    </button>
                </div>
            </div>
        `;
        openModal(detailHtml);
    };

    // --- Speed Dial FAB ---
    let fabOpen = false;

    function openFabDial() {
        fabOpen = true;
        fabContainer.classList.add('open');
        fabBackdrop.style.display = 'block';
    }
    function closeFabDial() {
        fabOpen = false;
        fabContainer.classList.remove('open');
        fabBackdrop.style.display = 'none';
    }

    // Backdrop closes the dial
    fabBackdrop.addEventListener('click', closeFabDial);

    // Sub-action handlers
    document.getElementById('fab-btn-gallery').addEventListener('click', () => {
        closeFabDial();
        window.showToast('📷 Opening Gallery...');
    });
    document.getElementById('fab-btn-camera').addEventListener('click', () => {
        closeFabDial();
        window.showToast('📸 Opening Camera...');
    });
    document.getElementById('fab-btn-write').addEventListener('click', () => {
        closeFabDial();
        const writeHtml = `
            <div class="fade-in" style="padding: 80px 20px 100px;">
                <h2 style="font-size:1.5rem; margin-bottom:5px;">New Post</h2>
                <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:24px;">Share your shot with the Alpha community.</p>
                <div>
                    <label style="font-size:0.8rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:1px; margin-bottom:6px; display:block;">Title</label>
                    <input type="text" class="glass-input" placeholder="Give your shot a title..." style="width:100%; padding:14px 16px; border-radius:var(--border-radius-sm); margin-bottom:16px;">
                </div>
                <div>
                    <label style="font-size:0.8rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:1px; margin-bottom:6px; display:block;">Description</label>
                    <textarea class="glass-input" rows="4" placeholder="Tell the story behind the shot..." style="width:100%; padding:14px 16px; border-radius:var(--border-radius-sm); resize:none; margin-bottom:16px;"></textarea>
                </div>
                <div>
                    <label style="font-size:0.8rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:1px; margin-bottom:6px; display:block;">Camera Gear</label>
                    <input type="text" class="glass-input" placeholder="e.g. Alpha 7R V, FE 50mm F1.2 GM" style="width:100%; padding:14px 16px; border-radius:var(--border-radius-sm);">
                </div>
            </div>
            <div style="position:fixed; bottom:0; left:0; right:0; padding:15px 20px; background:rgba(10,10,10,0.9); backdrop-filter:blur(20px); border-top:1px solid var(--glass-border); z-index:3000;">
                <button class="btn-primary" style="width:100%; max-width:100%; padding:14px; font-size:1rem;" onclick="window.showToast('✅ Post submitted!'); setTimeout(closeModal, 400);">Share Post</button>
            </div>
        `;
        openModal(writeHtml);
    });

    // --- Draggable FAB Container with Edge Snap & Peek ---
    (function makeDraggable(el) {
        let pointerDown = false;
        let moved = false;
        let wasDockedOnDown = false;
        let startX, startY, startLeft, startTop;
        let isDocked = false;       // true when FAB is peeking at an edge
        let dockedSide = null;      // 'left' | 'right'
        const PEEK_PX = 29;         // half of 58px = 50% visible when docked

        function getPos(e) {
            const t = e.touches ? e.touches[0] : e;
            return { x: t.clientX, y: t.clientY };
        }

        // Snap to nearest edge, peek at 50%
        function snapToEdge(currentLeft, currentTop) {
            const size = el.offsetWidth;
            const midX = currentLeft + size / 2;
            const snapRight = midX > window.innerWidth / 2;
            dockedSide = snapRight ? 'right' : 'left';
            const clampedTop = Math.max(80, Math.min(window.innerHeight - size - 80, currentTop));
            el.style.transition = 'left 0.4s cubic-bezier(0.16,1,0.3,1), top 0.3s cubic-bezier(0.16,1,0.3,1)';
            el.style.top = clampedTop + 'px';
            el.style.right = 'auto';
            el.style.bottom = 'auto';
            el.style.left = snapRight
                ? (window.innerWidth - PEEK_PX) + 'px'
                : (PEEK_PX - size) + 'px';
            isDocked = true;
            el.classList.add('fab-docked', 'fab-docked-' + dockedSide);
        }

        // Animate FAB back into full view
        function undock(animate) {
            if (!isDocked) return;
            const size = el.offsetWidth;
            el.style.transition = animate !== false ? 'left 0.35s cubic-bezier(0.16,1,0.3,1)' : 'none';
            el.style.left = dockedSide === 'right'
                ? (window.innerWidth - size - 16) + 'px'
                : '16px';
            isDocked = false;
            el.classList.remove('fab-docked', 'fab-docked-left', 'fab-docked-right');
        }

        el.addEventListener('mousedown', onDown);
        el.addEventListener('touchstart', onDown, { passive: true });
        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('mouseup', onUp);
        window.addEventListener('touchend', onUp);

        // Desktop hover: slide back in
        el.addEventListener('mouseenter', () => { if (isDocked) undock(true); });

        function onDown(e) {
            if (e.button !== undefined && e.button !== 0) return;
            if (e.target !== el && e.target !== fabUpload && !fabUpload.contains(e.target)) return;
            pointerDown = true;
            moved = false;
            wasDockedOnDown = isDocked;
            const pos = getPos(e);
            startX = pos.x;
            startY = pos.y;
            const rect = el.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            el.style.transition = 'none';
        }

        function onMove(e) {
            if (!pointerDown) return;
            const pos = getPos(e);
            const dx = pos.x - startX;
            const dy = pos.y - startY;
            if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
                if (!moved && isDocked) {
                    // Strip docked state immediately so drag starts clean
                    isDocked = false;
                    el.classList.remove('fab-docked', 'fab-docked-left', 'fab-docked-right');
                }
                moved = true;
            }
            if (!moved) return;
            e.preventDefault && e.preventDefault();
            if (fabOpen) closeFabDial();
            let newLeft = startLeft + dx;
            let newTop = startTop + dy;
            const size = el.offsetWidth;
            newLeft = Math.max(8, Math.min(window.innerWidth - size - 8, newLeft));
            newTop = Math.max(8, Math.min(window.innerHeight - size - 8, newTop));
            el.style.left = newLeft + 'px';
            el.style.top = newTop + 'px';
            el.style.right = 'auto';
            el.style.bottom = 'auto';
        }

        function onUp() {
            if (!pointerDown) return;
            pointerDown = false;
            if (moved) {
                const rect = el.getBoundingClientRect();
                snapToEdge(rect.left, rect.top);
            } else if (wasDockedOnDown) {
                // Tap on docked FAB: slide in then the click event opens the dial
                undock(true);
            } else {
                el.style.transition = '';
            }
        }
    })(fabContainer);

    // Main FAB click = toggle speed dial (only fires if not dragging)
    fabUpload.addEventListener('click', () => {
        // If container was dragged, don't toggle
        if (fabOpen) {
            closeFabDial();
        } else {
            openFabDial();
        }
    });



    // --- Notifications Flow ---
    notifBtn.addEventListener('click', () => {
        const notifHtml = `
            <div class="fade-in" style="padding: 80px 20px 20px;">
                <h2 style="font-size: 1.5rem; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid var(--glass-border);">Notifications</h2>
                
                <div style="display: flex; flex-direction: column; gap: 15px;">
                    <div class="glass-panel" style="display: flex; gap: 15px; align-items: center; padding: 15px; border-radius: var(--border-radius-sm); cursor:pointer;" onclick="window.openEventDetail('contest')">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--alpha-orange); display: flex; align-items: center; justify-content: center;">
                            <span class="material-symbols-outlined" style="color: white; font-size: 1.2rem;">emoji_events</span>
                        </div>
                        <div>
                            <div style="font-weight: 500;">New Contest Announced!</div>
                            <div style="font-size: 0.85rem; color: var(--text-secondary);">Urban Lights Challenge is now open.</div>
                        </div>
                    </div>
                    
                    <div class="glass-panel" style="display: flex; gap: 15px; align-items: center; padding: 15px; border-radius: var(--border-radius-sm); cursor:pointer;" onclick="window.showToast('Opening Marcus Lens Profile')">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=40&q=80" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                        <div>
                            <div style="font-weight: 500;">Marcus Lens started following you.</div>
                            <div style="font-size: 0.85rem; color: var(--text-secondary);">2 hours ago</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        openModal(notifHtml);
    });

});
