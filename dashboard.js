// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    initializeNavigation();
    initializeProgressCircle();
    initializeStreak();
    initializeCatalogue();
    loadUserData();
});

// Initialize dashboard functionality
function initializeDashboard() {
    // Load user data from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.full_name) {
        document.getElementById('userName').textContent = user.full_name;
    }
    
    // Initialize course data
    loadRecentCourses();
    loadActiveCourses();
    loadCompletedCourses();
    loadCatalogCourses();
}

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-page]');
    const pages = document.querySelectorAll('.page-content');
    const navItems = document.querySelectorAll('.nav-item');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            
            // Update active nav item
            navItems.forEach(item => item.classList.remove('active'));
            this.closest('.nav-item').classList.add('active');
            
            // Show target page
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(targetPage + 'Page').classList.add('active');
        });
    });
    
    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
}

// Progress circle animation
function initializeProgressCircle() {
    const progressCircle = document.querySelector('.progress-circle');
    const progress = progressCircle.getAttribute('data-progress');
    
    // Animate progress circle
    setTimeout(() => {
        progressCircle.style.setProperty('--progress', progress);
    }, 500);
}

// Course toggle functionality
function initializeCourseToggle() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const activeCoursesList = document.getElementById('activeCoursesList');
    const completedCoursesList = document.getElementById('completedCoursesList');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            
            // Update active button
            toggleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide course lists
            if (type === 'active') {
                activeCoursesList.style.display = 'grid';
                completedCoursesList.style.display = 'none';
            } else {
                activeCoursesList.style.display = 'none';
                completedCoursesList.style.display = 'grid';
            }
        });
    });
}

// Initialize streak calendar
function initializeStreak() {
    const calendarGrid = document.getElementById('calendarGrid');
    const calendarMonth = document.getElementById('calendarMonth');
    const prevMonth = document.getElementById('prevMonth');
    const nextMonth = document.getElementById('nextMonth');
    
    let currentDate = new Date();
    
    function generateCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        // Update month display
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        calendarMonth.textContent = `${monthNames[month]} ${year}`;
        
        // Clear calendar
        calendarGrid.innerHTML = '';
        
        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const headerDiv = document.createElement('div');
            headerDiv.className = 'calendar-day-header';
            headerDiv.textContent = day;
            headerDiv.style.fontWeight = '600';
            headerDiv.style.color = 'var(--text-secondary)';
            headerDiv.style.padding = '0.5rem';
            headerDiv.style.textAlign = 'center';
            calendarGrid.appendChild(headerDiv);
        });
        
        // Add empty cells for days before month starts
        for (let i = 0; i < startingDay; i++) {
            const emptyDiv = document.createElement('div');
            calendarGrid.appendChild(emptyDiv);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day';
            dayDiv.textContent = day;
            
            // Add streak indicators (mock data)
            const dayDate = new Date(year, month, day);
            const today = new Date();
            
            if (dayDate.toDateString() === today.toDateString()) {
                dayDiv.classList.add('today');
            } else if (day % 3 === 0 && day <= today.getDate() && month === today.getMonth()) {
                dayDiv.classList.add('streak');
            } else if (day % 7 === 0 && day <= today.getDate() && month === today.getMonth()) {
                dayDiv.classList.add('missed');
            }
            
            calendarGrid.appendChild(dayDiv);
        }
    }
    
    // Navigation event listeners
    prevMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate);
    });
    
    nextMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate);
    });
    
    // Initialize calendar
    generateCalendar(currentDate);
}

// Initialize catalogue functionality
function initializeCatalogue() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('courseSearch');
    
    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter courses
            filterCourses(category, searchInput.value);
        });
    });
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-category');
            filterCourses(activeFilter, this.value);
        });
    }
    
    // Initialize course toggle when courses page is accessed
    setTimeout(initializeCourseToggle, 100);
}

// Load recent courses data
function loadRecentCourses() {
    // This would typically come from an API
    const recentCourses = [
        {
            title: 'Web Development Fundamentals',
            description: 'Learn HTML, CSS, and JavaScript basics',
            progress: 65,
            icon: 'fas fa-code'
        },
        {
            title: 'Database Design',
            description: 'Master SQL and database concepts',
            progress: 40,
            icon: 'fas fa-database'
        },
        {
            title: 'Mobile App Development',
            description: 'Build apps with React Native',
            progress: 15,
            icon: 'fas fa-mobile-alt'
        }
    ];
    
    // Recent courses are already in the HTML, no need to regenerate
}

// Load active courses
function loadActiveCourses() {
    const activeCourses = [
        {
            title: 'Advanced JavaScript',
            description: 'Master ES6+ features and async programming',
            progress: 75,
            icon: 'fab fa-js-square',
            coins: 150
        },
        {
            title: 'React Development',
            description: 'Build modern web applications with React',
            progress: 50,
            icon: 'fab fa-react',
            coins: 200
        },
        {
            title: 'Node.js Backend',
            description: 'Server-side development with Node.js',
            progress: 30,
            icon: 'fab fa-node-js',
            coins: 180
        }
    ];
    
    const container = document.getElementById('activeCoursesList');
    container.innerHTML = activeCourses.map(course => `
        <div class="course-card">
            <div class="course-image">
                <i class="${course.icon}"></i>
            </div>
            <div class="course-info">
                <h4 class="course-title">${course.title}</h4>
                <p class="course-description">${course.description}</p>
                <div class="course-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${course.progress}%"></div>
                    </div>
                    <span class="progress-text">${course.progress}% Complete</span>
                </div>
                <div class="course-coins" style="margin-top: 1rem; color: var(--accent-warning);">
                    <i class="fas fa-coins"></i> ${course.coins} coins required
                </div>
            </div>
        </div>
    `).join('');
}

// Load completed courses
function loadCompletedCourses() {
    const completedCourses = [
        {
            title: 'HTML & CSS Basics',
            description: 'Foundation of web development',
            completedDate: '2024-11-15',
            icon: 'fab fa-html5',
            rating: 5
        },
        {
            title: 'JavaScript Fundamentals',
            description: 'Core JavaScript concepts',
            completedDate: '2024-11-20',
            icon: 'fab fa-js-square',
            rating: 4
        },
        {
            title: 'Git Version Control',
            description: 'Source code management',
            completedDate: '2024-11-25',
            icon: 'fab fa-git-alt',
            rating: 5
        }
    ];
    
    const container = document.getElementById('completedCoursesList');
    container.innerHTML = completedCourses.map(course => `
        <div class="course-card">
            <div class="course-image">
                <i class="${course.icon}"></i>
            </div>
            <div class="course-info">
                <h4 class="course-title">${course.title}</h4>
                <p class="course-description">${course.description}</p>
                <div class="course-meta" style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                    <span style="color: var(--text-secondary); font-size: 0.85rem;">
                        Completed: ${new Date(course.completedDate).toLocaleDateString()}
                    </span>
                    <div class="rating" style="color: var(--accent-warning);">
                        ${'★'.repeat(course.rating)}${'☆'.repeat(5 - course.rating)}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Load catalog courses
function loadCatalogCourses() {
    const catalogCourses = [
        {
            title: 'Python for Data Science',
            description: 'Learn Python for data analysis and machine learning',
            category: 'data',
            price: 250,
            rating: 4.8,
            students: 1205,
            icon: 'fab fa-python'
        },
        {
            title: 'UI/UX Design Principles',
            description: 'Master user interface and experience design',
            category: 'design',
            price: 180,
            rating: 4.9,
            students: 856,
            icon: 'fas fa-palette'
        },
        {
            title: 'Business Strategy',
            description: 'Strategic thinking for modern businesses',
            category: 'business',
            price: 300,
            rating: 4.7,
            students: 623,
            icon: 'fas fa-chart-line'
        },
        {
            title: 'Full Stack Development',
            description: 'Complete web development bootcamp',
            category: 'programming',
            price: 400,
            rating: 4.9,
            students: 2105,
            icon: 'fas fa-laptop-code'
        },
        {
            title: 'Machine Learning Basics',
            description: 'Introduction to ML algorithms and concepts',
            category: 'data',
            price: 320,
            rating: 4.6,
            students: 945,
            icon: 'fas fa-robot'
        },
        {
            title: 'Graphic Design Mastery',
            description: 'Professional graphic design techniques',
            category: 'design',
            price: 220,
            rating: 4.8,
            students: 734,
            icon: 'fas fa-paint-brush'
        }
    ];
    
    window.allCatalogCourses = catalogCourses; // Store for filtering
    renderCatalogCourses(catalogCourses);
}

// Render catalog courses
function renderCatalogCourses(courses) {
    const container = document.getElementById('catalogueGrid');
    container.innerHTML = courses.map(course => `
        <div class="course-card" data-category="${course.category}">
            <div class="course-image">
                <i class="${course.icon}"></i>
            </div>
            <div class="course-info">
                <h4 class="course-title">${course.title}</h4>
                <p class="course-description">${course.description}</p>
                <div class="course-meta" style="display: flex; justify-content: space-between; align-items: center; margin: 1rem 0;">
                    <div class="course-rating" style="color: var(--accent-warning);">
                        ★ ${course.rating} (${course.students})
                    </div>
                    <div class="course-price" style="color: var(--accent-secondary); font-weight: 600;">
                        ${course.price} coins
                    </div>
                </div>
                <button class="enroll-btn" style="width: 100%; padding: 0.75rem; background: var(--gradient-primary); border: none; border-radius: var(--border-radius); color: white; font-weight: 600; cursor: pointer; transition: var(--transition-normal);">
                    Enroll Now
                </button>
            </div>
        </div>
    `).join('');
    
    // Add click handlers for enroll buttons
    container.querySelectorAll('.enroll-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            alert('Enrollment functionality will be implemented with backend integration!');
        });
    });
}

// Filter courses function
function filterCourses(category, searchTerm) {
    let filteredCourses = window.allCatalogCourses || [];
    
    // Filter by category
    if (category !== 'all') {
        filteredCourses = filteredCourses.filter(course => course.category === category);
    }
    
    // Filter by search term
    if (searchTerm) {
        filteredCourses = filteredCourses.filter(course => 
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    renderCatalogCourses(filteredCourses);
}

// Load user data
function loadUserData() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.id) {
        // Redirect to login if no user data
        window.location.href = 'index.html';
        return;
    }
    
    // Update UI with user data
    if (user.full_name) {
        document.getElementById('userName').textContent = user.full_name;
    }
    
    // You can add more user-specific data loading here
}

// Utility function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        padding: 1rem 1.5rem;
        color: var(--text-primary);
        box-shadow: 0 8px 32px var(--shadow-primary);
        z-index: 9999;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}