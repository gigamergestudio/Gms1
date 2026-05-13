/* ============================================
   FIREBASE CONFIGURATION
   ============================================ */

// Initialize Firebase (Replace with your config)
const firebaseConfig = {
    apiKey: "AIzaSyDummyKeyForDevelopment123456789",
    authDomain: "gigamerge-studio.firebaseapp.com",
    projectId: "gigamerge-studio",
    storageBucket: "gigamerge-studio.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Mock Firebase for development (without external dependencies)
// In production, replace with actual Firebase SDK
class MockFirebase {
    constructor(config) {
        this.config = config;
        this.users = JSON.parse(localStorage.getItem('gm_users')) || [];
        this.projects = JSON.parse(localStorage.getItem('gm_projects')) || [];
        this.creators = JSON.parse(localStorage.getItem('gm_creators')) || this.initializeCreators();
        this.currentUser = null;
        this.loadCurrentUser();
    }

    initializeCreators() {
        const creators = [
            {
                id: 'creator_1',
                name: 'Alex Rivera',
                role: 'Video Editor',
                category: 'video',
                image: '🎬',
                skills: ['Adobe Premiere', 'DaVinci Resolve', 'Color Grading'],
                rating: 4.9,
                projects: 45,
                description: 'Professional video editor with 8+ years experience'
            },
            {
                id: 'creator_2',
                name: 'Sarah Chen',
                role: 'Full Stack Developer',
                category: 'developer',
                image: '💻',
                skills: ['React', 'Node.js', 'Python', 'AWS'],
                rating: 4.8,
                projects: 32,
                description: 'Expert in scalable web applications'
            },
            {
                id: 'creator_3',
                name: 'Marcus Johnson',
                role: 'Content Writer',
                category: 'writer',
                image: '✍️',
                skills: ['Blog Writing', 'SEO', 'Copywriting', 'Technical Writing'],
                rating: 4.7,
                projects: 58,
                description: 'Specialized in engaging content creation'
            },
            {
                id: 'creator_4',
                name: 'Emma Watson',
                role: 'Motion Graphics',
                category: 'video',
                image: '✨',
                skills: ['After Effects', 'Cinema 4D', 'Animation'],
                rating: 4.9,
                projects: 28,
                description: 'Creative motion designer'
            },
            {
                id: 'creator_5',
                name: 'David Lee',
                role: 'Backend Engineer',
                category: 'developer',
                image: '⚙️',
                skills: ['Go', 'PostgreSQL', 'Kubernetes', 'Docker'],
                rating: 4.8,
                projects: 21,
                description: 'Enterprise-level backend systems'
            },
            {
                id: 'creator_6',
                name: 'Lisa Anderson',
                role: 'Social Media Manager',
                category: 'writer',
                image: '📱',
                skills: ['Social Strategy', 'Community Management', 'Analytics'],
                rating: 4.6,
                projects: 34,
                description: 'Grow your social media presence'
            },
            {
                id: 'creator_7',
                name: 'James Wilson',
                role: 'Filmmaker',
                category: 'video',
                image: '🎥',
                skills: ['Cinematography', 'Directing', 'Scriptwriting'],
                rating: 4.7,
                projects: 19,
                description: 'Cinematic storytelling specialist'
            },
            {
                id: 'creator_8',
                name: 'Nina Patel',
                role: 'UI/UX Designer & Developer',
                category: 'developer',
                image: '🎨',
                skills: ['Figma', 'React', 'CSS', 'Interaction Design'],
                rating: 4.9,
                projects: 26,
                description: 'Beautiful and functional designs'
            }
        ];
        localStorage.setItem('gm_creators', JSON.stringify(creators));
        return creators;
    }

    signUp(email, password, name, role) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this.users.find(u => u.email === email)) {
                    reject(new Error('Email already exists'));
                    return;
                }

                const user = {
                    id: 'user_' + Date.now(),
                    email,
                    password, // In production, use proper hashing
                    name,
                    role,
                    createdAt: new Date().toISOString(),
                    profile: {
                        bio: '',
                        skills: [],
                        rating: 5,
                        portfolio: []
                    }
                };

                this.users.push(user);
                localStorage.setItem('gm_users', JSON.stringify(this.users));
                this.currentUser = user;
                localStorage.setItem('gm_currentUser', JSON.stringify(user));
                resolve(user);
            }, 800);
        });
    }

    logIn(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = this.users.find(u => u.email === email && u.password === password);
                if (!user) {
                    reject(new Error('Invalid email or password'));
                    return;
                }
                this.currentUser = user;
                localStorage.setItem('gm_currentUser', JSON.stringify(user));
                resolve(user);
            }, 800);
        });
    }

    logOut() {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.currentUser = null;
                localStorage.removeItem('gm_currentUser');
                resolve();
            }, 300);
        });
    }

    loadCurrentUser() {
        const user = localStorage.getItem('gm_currentUser');
        if (user) {
            this.currentUser = JSON.parse(user);
        }
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getCreators(filter = 'all') {
        if (filter === 'all') return this.creators;
        return this.creators.filter(c => c.category === filter);
    }

    getCreatorById(id) {
        return this.creators.find(c => c.id === id);
    }

    postProject(projectData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!this.currentUser) {
                    reject(new Error('User not logged in'));
                    return;
                }

                const project = {
                    id: 'project_' + Date.now(),
                    ...projectData,
                    clientId: this.currentUser.id,
                    clientName: this.currentUser.name,
                    createdAt: new Date().toISOString(),
                    applicants: []
                };

                this.projects.push(project);
                localStorage.setItem('gm_projects', JSON.stringify(this.projects));
                resolve(project);
            }, 600);
        });
    }

    getProjects() {
        return this.projects;
    }

    applyForProject(projectId) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!this.currentUser) {
                    reject(new Error('User not logged in'));
                    return;
                }

                const project = this.projects.find(p => p.id === projectId);
                if (!project) {
                    reject(new Error('Project not found'));
                    return;
                }

                const application = {
                    creatorId: this.currentUser.id,
                    creatorName: this.currentUser.name,
                    appliedAt: new Date().toISOString()
                };

                if (!project.applicants) project.applicants = [];
                project.applicants.push(application);
                localStorage.setItem('gm_projects', JSON.stringify(this.projects));
                resolve(application);
            }, 500);
        });
    }

    getLeaderboard() {
        // Sort creators by rating and project count
        return [...this.creators].sort((a, b) => {
            if (b.rating !== a.rating) {
                return b.rating - a.rating;
            }
            return b.projects - a.projects;
        });
    }

    updateUserProfile(userId, profileData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = this.users.find(u => u.id === userId);
                if (!user) {
                    reject(new Error('User not found'));
                    return;
                }

                user.profile = { ...user.profile, ...profileData };
                localStorage.setItem('gm_users', JSON.stringify(this.users));
                if (this.currentUser && this.currentUser.id === userId) {
                    this.currentUser = user;
                    localStorage.setItem('gm_currentUser', JSON.stringify(user));
                }
                resolve(user);
            }, 500);
        });
    }
}

// Initialize Firebase
const db = new MockFirebase(firebaseConfig);

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { db, MockFirebase };
}
