/* ============================================
   DATABASE OPERATIONS
   ============================================ */

class DatabaseManager {
    constructor() {
        this.setupEventListeners();
        this.loadAllData();
    }

    setupEventListeners() {
        // Creators Section
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.filterCreators(e.target.dataset.filter));
        });

        // Projects Section
        const postProjectBtn = document.getElementById('postProjectBtn');
        if (postProjectBtn) {
            postProjectBtn.addEventListener('click', () => this.openProjectModal());
        }

        const projectModalClose = document.getElementById('projectModalClose');
        if (projectModalClose) {
            projectModalClose.addEventListener('click', () => this.closeProjectModal());
        }

        const submitProjectBtn = document.getElementById('submitProjectBtn');
        if (submitProjectBtn) {
            submitProjectBtn.addEventListener('click', () => this.handleProjectSubmit());
        }

        // Profile Modal
        const profileModalClose = document.getElementById('profileModalClose');
        if (profileModalClose) {
            profileModalClose.addEventListener('click', () => this.closeProfileModal());
        }
    }

    loadAllData() {
        this.loadCreators();
        this.loadProjects();
        this.loadLeaderboard();
    }

    // ============ CREATORS ============

    loadCreators(filter = 'all') {
        const creators = db.getCreators(filter);
        const grid = document.getElementById('creatorsGrid');

        if (!grid) return;

        grid.innerHTML = creators.map(creator => `
            <div class="creator-card fade-in">
                <div class="creator-image">${creator.image}</div>
                ${creator.projects > 40 ? `<div class="creator-badge">⭐ Top Creator</div>` : ''}
                
                <div class="creator-info">
                    <h3 class="creator-name">${creator.name}</h3>
                    <p class="creator-role">${creator.role}</p>
                    
                    <div class="creator-rating">
                        <span>${'⭐'.repeat(Math.floor(creator.rating))}</span>
                        <span>${creator.rating}</span>
                    </div>
                    
                    <div class="creator-skills">
                        ${creator.skills.slice(0, 3).map(skill => 
                            `<span class="skill-tag">${skill}</span>`
                        ).join('')}
                    </div>
                    
                    <div class="creator-stats">
                        <span>${creator.projects} Projects</span>
                        <span>Since 2021</span>
                    </div>
                    
                    <button class="btn btn-primary" onclick="dbManager.viewCreatorProfile('${creator.id}')">
                        View Profile
                    </button>
                </div>
            </div>
        `).join('');

        // Trigger animations
        this.triggerScrollAnimations();
    }

    filterCreators(filter) {
        // Update active tab
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        event.target.classList.add('active');

        // Load filtered creators
        this.loadCreators(filter);
    }

    viewCreatorProfile(creatorId) {
        const creator = db.getCreatorById(creatorId);
        if (!creator) return;

        const profileModal = document.getElementById('profileModal');
        const profileContent = document.getElementById('profileContent');

        profileContent.innerHTML = `
            <div class="profile-header">
                <div class="profile-avatar">${creator.image}</div>
                <h3 class="profile-name">${creator.name}</h3>
                <p class="profile-role">${creator.role}</p>
            </div>

            <div class="profile-section">
                <h4>About</h4>
                <p>${creator.description}</p>
            </div>

            <div class="profile-section">
                <h4>Skills</h4>
                <div class="profile-skills">
                    ${creator.skills.map(skill => 
                        `<span class="profile-skill">${skill}</span>`
                    ).join('')}
                </div>
            </div>

            <div class="profile-section">
                <h4>Stats</h4>
                <p><strong>Rating:</strong> ⭐ ${creator.rating}/5</p>
                <p><strong>Completed Projects:</strong> ${creator.projects}</p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md); margin-top: var(--spacing-lg);">
                <button class="btn btn-secondary full-width" id="hireBtnProfile">Hire Now</button>
                <button class="btn btn-primary full-width" id="messageBtn">Message</button>
            </div>
        `;

        document.getElementById('hireBtnProfile').addEventListener('click', () => {
            authManager.showNotification(`Hire feature coming soon! 🚀`, 'info');
        });

        document.getElementById('messageBtn').addEventListener('click', () => {
            authManager.showNotification(`Messaging feature coming soon! 💬`, 'info');
        });

        profileModal.classList.add('active');
    }

    closeProfileModal() {
        document.getElementById('profileModal').classList.remove('active');
    }

    // ============ PROJECTS ============

    loadProjects() {
        const projects = db.getProjects();
        const list = document.getElementById('projectsList');

        if (!list) return;

        if (projects.length === 0) {
            list.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <p style="color: var(--text-secondary); font-size: 1.1rem;">No projects posted yet. Be the first to post one! 🚀</p>
                </div>
            `;
            return;
        }

        list.innerHTML = projects.map(project => `
            <div class="project-card fade-in">
                <span class="project-category">${project.category}</span>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-client">by ${project.clientName}</p>
                <p class="project-description">${project.description}</p>
                
                <div class="project-meta">
                    <span class="project-budget">$${project.budget}</span>
                    <span class="project-timeline">Deadline: ${new Date(project.deadline).toLocaleDateString()}</span>
                </div>
                
                <button class="btn btn-primary" onclick="dbManager.applyForProject('${project.id}')">
                    Apply Now
                </button>
            </div>
        `).join('');

        this.triggerScrollAnimations();
    }

    openProjectModal() {
        if (!authManager.currentUser) {
            authManager.showNotification('Please login to post a project', 'error');
            authManager.openAuthModal();
            return;
        }

        if (authManager.currentUser.role !== 'client') {
            authManager.showNotification('Only clients can post projects', 'error');
            return;
        }

        document.getElementById('projectModal').classList.add('active');
    }

    closeProjectModal() {
        document.getElementById('projectModal').classList.remove('active');
    }

    async handleProjectSubmit() {
        const title = document.getElementById('projectTitle').value.trim();
        const category = document.getElementById('projectCategory').value;
        const description = document.getElementById('projectDescription').value.trim();
        const budget = parseFloat(document.getElementById('projectBudget').value);
        const deadline = document.getElementById('projectDeadline').value;

        if (!title || !category || !description || !budget || !deadline) {
            authManager.showNotification('Please fill in all fields', 'error');
            return;
        }

        try {
            const project = await db.postProject({
                title,
                category,
                description,
                budget,
                deadline
            });

            // Clear form
            document.getElementById('projectTitle').value = '';
            document.getElementById('projectCategory').value = '';
            document.getElementById('projectDescription').value = '';
            document.getElementById('projectBudget').value = '';
            document.getElementById('projectDeadline').value = '';

            this.closeProjectModal();
            this.loadProjects();
            authManager.showNotification('Project posted successfully! 🎉', 'success');
        } catch (error) {
            authManager.showNotification(error.message, 'error');
        }
    }

    async applyForProject(projectId) {
        if (!authManager.currentUser) {
            authManager.showNotification('Please login to apply', 'error');
            authManager.openAuthModal();
            return;
        }

        if (authManager.currentUser.role !== 'creator') {
            authManager.showNotification('Only creators can apply for projects', 'error');
            return;
        }

        try {
            await db.applyForProject(projectId);
            authManager.showNotification('Application submitted! Good luck! 🍀', 'success');
        } catch (error) {
            authManager.showNotification(error.message, 'error');
        }
    }

    // ============ LEADERBOARD ============

    loadLeaderboard() {
        const leaderboard = db.getLeaderboard();
        
        // Top 3
        const top3 = leaderboard.slice(0, 3);
        if (top3.length > 0) {
            const rank1 = top3.find((_, i) => i === 0);
            if (rank1) {
                document.getElementById('rank1').innerHTML = `
                    <p class="name">${rank1.name}</p>
                    <p class="score">⭐ ${rank1.rating}</p>
                `;
            }
        }
        if (top3.length > 1) {
            const rank2 = top3.find((_, i) => i === 1);
            if (rank2) {
                document.getElementById('rank2').innerHTML = `
                    <p class="name">${rank2.name}</p>
                    <p class="score">⭐ ${rank2.rating}</p>
                `;
            }
        }
        if (top3.length > 2) {
            const rank3 = top3.find((_, i) => i === 2);
            if (rank3) {
                document.getElementById('rank3').innerHTML = `
                    <p class="name">${rank3.name}</p>
                    <p class="score">⭐ ${rank3.rating}</p>
                `;
            }
        }

        // Full leaderboard (starting from rank 4)
        const list = document.getElementById('leaderboardList');
        if (!list) return;

        list.innerHTML = leaderboard.map((creator, index) => `
            <div class="leaderboard-row fade-in">
                <div class="rank-number">#${index + 1}</div>
                <div class="rank-name">${creator.name}</div>
                <div class="rank-score">⭐ ${creator.rating}</div>
                <div class="rank-projects">${creator.projects} 📦</div>
            </div>
        `).join('');

        this.triggerScrollAnimations();
    }

    // ============ UTILITIES ============

    triggerScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }
}

// Initialize Database Manager
document.addEventListener('DOMContentLoaded', () => {
    window.dbManager = new DatabaseManager();
});
