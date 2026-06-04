/* ============================================
   AI CHATBOT SYSTEM - INTELLIGENT RESPONSES
   ============================================ */

class ChatbotSystem {
    constructor() {
        this.chatHistory = [];
        this.setupEventListeners();
        this.initializeResponses();
    }

    initializeResponses() {
        this.responses = {
            greetings: [
                "नमस्ते! 👋 GigaMerge Studio में स्वागत है! कैसे मदद कर सकते हैं?",
                "Hi there! 😊 Welcome to GigaMerge. What can I help you with today?",
                "Namaste! 🙏 I'm your GigaMerge assistant. How can I assist you?",
                "Hey! 👀 Ready to connect with amazing creators? Let me help!",
                "Swagat hai! 🌟 Ask me anything about GigaMerge Studio."
            ],
            
            joining: [
                "GigaMerge join करने के लिए सिर्फ 3 स्टेप्स! 1️⃣ Login करो 2️⃣ Profile बनाओ 3️⃣ तुरंत शुरू करो!",
                "Joining GigaMerge is super easy! Click 'Login' and sign up in seconds. 🚀",
                "Join करने के लिए बस अपना email दो और एक strong password बनाओ! 💪",
                "नया member बनने के लिए ये करो: 1) Sign Up करो 2) अपना role चुनो (Creator या Client) 3) Profile complete करो ✅",
                "It takes less than 2 minutes to join! Premium features के लिए upgrade कर सकते हो बाद में. 💎"
            ],

            plans: [
                "हमारे 3 प्लान्स हैं: 1️⃣ Starter (Free) - Basic features 2️⃣ Professional ($9.99/month) - Advanced tools 3️⃣ Enterprise - Custom solution 🚀",
                "We have flexible plans! Starter is free, Professional is $9.99/month with advanced analytics. 📊",
                "सभी users के लिए free account बन सकता है! Professional प्लान advanced features, priority support देता है. 💼",
                "Professional plan सबसे popular है! Analytics, custom branding, priority support - सब कुछ! ⭐",
                "हर plan में money-back guarantee है! 30 दिन के अंदर वापसी कर सकते हो. 💰"
            ],

            payments: [
                "हम multiple payment methods support करते हैं - Credit Card, Debit Card, UPI! 💳",
                "Payment करना बहुत safe है - हम latest encryption use करते हैं! 🔒",
                "सभी transactions secure हैं और आसानी से process होते हैं! Instant confirmation मिलता है. ✅",
                "We accept all major payment methods including digital wallets! 📱",
                "Installment payment plans भी available हैं कुछ cards के लिए! आसानी से pay कर सको. 💸"
            ],

            creators: [
                "Creators के लिए ये features हैं: 1️⃣ Portfolio showcase 2️⃣ Project bidding 3️⃣ Rating system 4️⃣ Earnings dashboard 💰",
                "अपना skill दिखाओ और ढेर सारे projects पाओ! Clients सीधे तुम्हारे साथ काम करना चाहते हैं. 🎯",
                "Creator बन कर तुम निम्नलिखित earn कर सकते हो: Video editing, Development, Writing, Design और बहुत कुछ! 🌟",
                "खुद का बॉस बनो! GigaMerge पर हजारों projects available हैं creators के लिए. 👑",
                "Top creators को special badges मिलते हैं! और प्रमोशन भी मिलता है premium community में. 🏆"
            ],

            clients: [
                "Clients के लिए हजारों verified creators available हैं! सही person choose करो. 👨‍💼",
                "अपनी project post करो और talented creators से offers पाओ! Budget set करो और deadline दे. 📝",
                "आसानी से team manage कर सकते हो एक dashboard से! सभी project timeline track हो जाता है. 📊",
                "Escrow payment system से secure transactions होती हैं! Dispute resolution भी है. 🛡️",
                "Client reviews से creators का quality judge कर सकते हो! Verified ratings देखो. ⭐"
            ],

            projects: [
                "Project post करने के लिए: 1) Title दो 2) Description दो 3) Budget fix करो 4) Deadline set करो 🎯",
                "हर project के लिए timeline है, budget है, और specific requirements हो सकती हैं. 📋",
                "Projects सभी categories में available हैं - Video Editing, Development, Writing, Design आदि! 🎬",
                "एक अच्छा project description लिखने से ज्यादा बढ़िया applications मिलते हैं! विस्तार से लिखो. 📝",
                "Projects को public या private रख सकते हो! Only interested creators को invite कर सकते हो. 🔒"
            ],

            leaderboard: [
                "Leaderboard top performers को दिखाता है! Rating और completed projects के आधार पर rank होता है. 🏆",
                "Top 3 creators special recognition पाते हैं! Badge और featured position मिलता है. 👑",
                "हर month का leaderboard reset होता है! Fresh opportunities सभी को मिलते हैं. 🔄",
                "Leaderboard में ऊपर आने से job opportunities बढ़ जाती हैं! ज्यादा clients interested होते हैं. 📈",
                "Rating 4.5+ से ऊपर रखो और top creators में join कर! Special perks मिलेंगे. 💎"
            ],

            support: [
                "24/7 customer support available है! Email, Chat, या Form से contact कर सकते हो. 📞",
                "हर सवाल का जवाब 24 घंटे में मिलता है! हमारी team तुम्हारी मदद के लिए तैयार है. ✅",
                "Common issues के लिए FAQ section भी है! Quick answers के लिए वहां check करो. 🔍",
                "Problem आ रही है? तुरंत support team को contact करो! Fast resolution guaranteed. 🚀",
                "Document करो और साथ details दो तो problem quickly solve हो जाती है! 📸"
            ],

            rules: [
                "GigaMerge के rules simple हैं: 1) Honest work करो 2) Payment time पर दो 3) Quality maintain करो 4) Respectful रहो. 👍",
                "Scams या fraud कड़ी punishment पाएंगे - account ban हो सकता है! हमेशा ethical रहो. ⚠️",
                "Intellectual property respected होनी चाहिए! किसी का काम copy न कर. 🚫",
                "Rules follow करो तो GigaMerge safe और trusted community है सभी के लिए! 🤝",
                "किसी rule का violation हो तो report कर सकते हो! Team तुरंत action लेगी. 🛡️"
            ],

            features: [
                "GigaMerge के top features: Portfolio showcase, Bidding system, Secure payments, Rating system, Leaderboard! ⭐",
                "Advanced analytics dashboard से अपना growth track कर सकते हो! सभी stats visible हैं. 📊",
                "Portfolio showcase में तुम्हारी best work लगा सकते हो! Clients को impress कर सकते हो. 🎨",
                "Real-time notifications मिलते हैं जब कोई interest show करे! तुरंत respond कर सकते हो. 🔔",
                "Secure messaging system है direct communication के लिए! No spam, No scams. 💬"
            ],

            earnings: [
                "Earnings transparent हैं! Exactly देख सकते हो कि कितना earn किया हर project से. 💰",
                "आप अपने rates set कर सकते हो! Negotiation भी कर सकते हो clients के साथ. 💲",
                "Monthly payout होता है सीधे तुम्हारे bank account में! No hidden charges. 🏦",
                "Commission बहुत fair है - सिर्फ small percentage! ज्यादातर पैसे तुम्हें मिलता है. 💵",
                "Earnings leaderboard देख सकते हो - top earners कौन हैं! Motivation मिलता है. 📈"
            ],

            feedback: [
                "Feedback system से clients अपनी rating दे सकते हैं! Honest reviews से reputation बढ़ता है. ⭐",
                "5-star rating पाना है तो quality work deliver करो! Deadlines follow करो aur communication अच्छी रखो. 🎯",
                "Bad reviews recover कर सकते हो अगर अगली projects में better performance दो! Second chance मिलता है. 🔄",
                "Reviews से ही clients decide करते हैं किसे hire करना है! इसलिए quality पर ध्यान दो. 👀",
                "Positive feedback से तुम्हारा profile rank बढ़ता है! ज्यादा opportunities आती हैं. 📈"
            ],

            motivation: [
                "तुम्हारे सभी सपने यहां पूरे हो सकते हैं! Dedicate रहो, consistent रहो, तो success निश्चित है! 💪",
                "GigaMerge पर हजारों success stories हैं! Success की journey शुरू करो आज. 🚀",
                "छोटे से शुरू करो, लेकिन बड़े सपने देखो! Growth आएगी dedication से. 🌱",
                "तुम्हारा काम बोलता है! Quality deliver करो तो clients खुद ढूंढ लेंगे तुम्हें. 💎",
                "Community का part बन जाओ! सीखो, सिखाओ, grow करो एक साथ! 🤝"
            ],

            goodbye: [
                "अलविदा! 👋 अगर कोई और सवाल हो तो बेझिझक पूछना. चलते हो?",
                "Bye! Hope I helped! Good luck with your GigaMerge journey! 🌟",
                "अच्छा चलते हैं! अगली बार फिर मिलेंगे. Happy creating! 😊",
                "Take care! Happy earning! 💰 फिर मिलेंगे! 👋",
                "Goodbye! Remember - consistency is key to success! See you soon! 🚀"
            ]
        };
    }

    setupEventListeners() {
        const chatbotToggle = document.getElementById('chatbotToggle');
        const chatbotClose = document.getElementById('chatbotClose');
        const chatbotSend = document.getElementById('chatbotSend');
        const chatbotInput = document.getElementById('chatbotInput');

        if (chatbotToggle) {
            chatbotToggle.addEventListener('click', () => this.toggleChatbot());
        }

        if (chatbotClose) {
            chatbotClose.addEventListener('click', () => this.closeChatbot());
        }

        if (chatbotSend) {
            chatbotSend.addEventListener('click', () => this.sendMessage());
        }

        if (chatbotInput) {
            chatbotInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        }

        // Show greeting
        this.addBotMessage(this.getRandomResponse('greetings'));
    }

    toggleChatbot() {
        const chatbot = document.getElementById('chatbot');
        chatbot.classList.toggle('active');
    }

    closeChatbot() {
        document.getElementById('chatbot').classList.remove('active');
    }

    sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();

        if (!message) return;

        this.addUserMessage(message);
        input.value = '';

        // Simulate typing
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.addBotMessage(response);
        }, 500 + Math.random() * 500);
    }

    addUserMessage(message) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const messageEl = document.createElement('div');
        messageEl.className = 'message user-message';
        messageEl.innerHTML = `<p>${this.escapeHtml(message)}</p>`;
        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        this.chatHistory.push({ type: 'user', message });
    }

    addBotMessage(message) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const messageEl = document.createElement('div');
        messageEl.className = 'message bot-message';
        messageEl.innerHTML = `<p>${this.escapeHtml(message)}</p>`;
        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        this.chatHistory.push({ type: 'bot', message });
    }

    generateResponse(userMessage) {
        const input = userMessage.toLowerCase();

        // Keyword matching for different topics
        const topics = {
            joining: ['join', 'signup', 'how to start', 'register', 'नया', 'शुरू', 'account', 'start'],
            plans: ['plan', 'pricing', 'cost', 'fee', 'price', 'प्लान', 'कीमत', 'कितना'],
            payments: ['payment', 'pay', 'currency', 'rupee', 'dollar', 'पेमेंट', 'भुगतान', 'पैसा'],
            creators: ['creator', 'editor', 'developer', 'writer', 'earn', 'make', 'क्रिएटर', 'कमाई'],
            clients: ['client', 'hire', 'project', 'post', 'hirer', 'employer', 'काम', 'मजदूरी'],
            projects: ['project', 'work', 'bid', 'job', 'task', 'प्रोजेक्ट', 'काम', 'लगभग'],
            leaderboard: ['leaderboard', 'rank', 'top', 'rating', 'score', 'लीडर', 'रैंक', 'शीर्ष'],
            support: ['help', 'support', 'issue', 'problem', 'contact', 'मदद', 'समस्या', 'सहायता'],
            rules: ['rule', 'policy', 'guideline', 'quality', 'ethical', 'नियम', 'कानून'],
            features: ['feature', 'feature', 'tool', 'dashboard', 'functions', 'सुविधा'],
            earnings: ['earn', 'money', 'payment', 'income', 'rate', 'कमाई', 'आय', 'रुपये'],
            feedback: ['review', 'rating', 'feedback', 'comment', 'star', 'रिव्यू', 'रेटिंग'],
            goodbye: ['bye', 'goodbye', 'see you', 'later', 'बाई', 'अलविदा', 'फिर', 'जाता']
        };

        // Find matching topic
        for (const [topic, keywords] of Object.entries(topics)) {
            if (keywords.some(keyword => input.includes(keyword))) {
                return this.getRandomResponse(topic);
            }
        }

        // Default responses for unmatched queries
        const defaults = [
            "वह interesting सवाल है! 🤔 क्या और detail दे सकते हो?",
            "Hmm, I didn't quite understand. Can you rephrase? 🤷",
            "यह topic के बारे में मेरे पास ज्यादा info नहीं है! Support team से contact करो. 📞",
            "Great question! For detailed info, check our FAQ या support से contact करो. 📖",
            "I'm here to help! बस अपना सवाल फिर से पूछ दो! 😊"
        ];

        return defaults[Math.floor(Math.random() * defaults.length)];
    }

    getRandomResponse(category) {
        const responses = this.responses[category];
        if (!responses) return "मुझे समझ नहीं आया! 😅";
        return responses[Math.floor(Math.random() * responses.length)];
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize Chatbot
document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new ChatbotSystem();
});
