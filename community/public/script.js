// State Management
let currentUser = null;
let questions = [];

// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    fetchQuestions();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Ask Question Form
    const askQuestionForm = document.getElementById('askQuestionForm');
    if (askQuestionForm) {
        askQuestionForm.addEventListener('submit', handleAskQuestion);
    }
    
    // Auth Form
    const authForm = document.getElementById('authForm');
    if (authForm) {
        authForm.addEventListener('submit', handleAuth);
    }
    
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
        }
    });
}

// API Functions
async function fetchQuestions() {
    try {
        const response = await fetch(`${API_BASE_URL}/questions`);
        const data = await response.json();
        
        if (data.success) {
            questions = data.data;
            renderDiscussions();
        }
    } catch (error) {
        console.error('Error fetching questions:', error);
        showNotification('Failed to load questions', 'error');
    }
}

async function postQuestion(questionData) {
    try {
        const response = await fetch(`${API_BASE_URL}/questions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(questionData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            questions.unshift(data.data);
            renderDiscussions();
            return true;
        } else {
            throw new Error(data.error || 'Failed to post question');
        }
    } catch (error) {
        console.error('Error posting question:', error);
        showNotification(error.message, 'error');
        return false;
    }
}

async function getQuestionDetails(questionId) {
    try {
        const response = await fetch(`${API_BASE_URL}/questions/${questionId}`);
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        } else {
            throw new Error(data.error || 'Failed to fetch question details');
        }
    } catch (error) {
        console.error('Error fetching question details:', error);
        showNotification(error.message, 'error');
        return null;
    }
}

async function addAnswer(questionId, answerData) {
    try {
        const response = await fetch(`${API_BASE_URL}/questions/${questionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'addAnswer',
                answerData: answerData
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Update the question in our local array
            const questionIndex = questions.findIndex(q => q.id === questionId);
            if (questionIndex !== -1) {
                questions[questionIndex] = data.data;
            }
            return data.data;
        } else {
            throw new Error(data.error || 'Failed to add answer');
        }
    } catch (error) {
        console.error('Error adding answer:', error);
        showNotification(error.message, 'error');
        return null;
    }
}

async function voteAnswer(questionId, answerId, voteType) {
    try {
        const response = await fetch(`${API_BASE_URL}/questions/${questionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'voteAnswer',
                answerId: answerId,
                voteType: voteType
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Update the question in our local array
            const questionIndex = questions.findIndex(q => q.id === questionId);
            if (questionIndex !== -1) {
                questions[questionIndex] = data.data;
            }
            return data.data;
        } else {
            throw new Error(data.error || 'Failed to vote on answer');
        }
    } catch (error) {
        console.error('Error voting on answer:', error);
        showNotification(error.message, 'error');
        return null;
    }
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

function openAuthModal() {
    openModal('authModal');
}

function showAskQuestionForm() {
    if (!currentUser) {
        openAuthModal();
        return;
    }
    openModal('askQuestionModal');
}

function showConnectModal() {
    alert('Connect feature coming soon!');
}

function showMentorshipPage() {
    alert('Mentorship page coming soon!');
}

// Render Functions
function renderDiscussions() {
    const discussionsList = document.getElementById('discussionsList');
    if (!discussionsList) return;
    
    if (questions.length === 0) {
        discussionsList.innerHTML = `
            <div class="loading-state">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading discussions...</p>
            </div>
        `;
        return;
    }
    
    discussionsList.innerHTML = questions.map(question => `
        <div class="discussion-card" onclick="openQuestionDetail('${question.id}')">
            <div class="discussion-header">
                <div class="user-avatar">${question.authorAvatar}</div>
                <div class="discussion-info">
                    <h3>${question.title}</h3>
                    <div class="discussion-author">by ${question.author}</div>
                </div>
            </div>
            <div class="discussion-tags">
                ${question.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="discussion-metrics">
                <div class="metric">
                    <i class="fas fa-comments"></i>
                    <span>${question.replies} replies</span>
                </div>
                <div class="metric">
                    <i class="fas fa-heart"></i>
                    <span>${question.likes} likes</span>
                </div>
                <div class="metric">
                    <i class="fas fa-clock"></i>
                    <span>${question.timeAgo}</span>
                </div>
            </div>
        </div>
    `).join('');
}

async function renderQuestionDetail(questionId) {
    const question = await getQuestionDetails(questionId);
    if (!question) return;
    
    const modalTitle = document.getElementById('modalQuestionTitle');
    const modalContent = document.getElementById('questionDetailContent');
    
    if (modalTitle) modalTitle.textContent = question.title;
    
    if (modalContent) {
        modalContent.innerHTML = `
            <div class="question-content">
                <p><strong>${question.author}</strong> asked:</p>
                <p>${question.content}</p>
                <div class="discussion-tags">
                    ${question.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="answers-section">
                <h4>${question.answers.length} Answer${question.answers.length !== 1 ? 's' : ''}</h4>
                ${question.answers.map(answer => `
                    <div class="answer">
                        <div class="answer-header">
                            <span class="answer-author">${answer.author}</span>
                            <span class="answer-date">${answer.date}</span>
                        </div>
                        <div class="answer-content">${answer.content}</div>
                        <div class="answer-actions">
                            <button class="vote-btn" onclick="voteAnswer('${question.id}', '${answer.id}', 'up')">
                                <i class="fas fa-thumbs-up"></i>
                                <span>${answer.votes}</span>
                            </button>
                            <button class="vote-btn" onclick="voteAnswer('${question.id}', '${answer.id}', 'down')">
                                <i class="fas fa-thumbs-down"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="add-answer-section">
                <h4>Add Your Answer</h4>
                <form class="answer-form" onsubmit="addAnswerToQuestion(event, '${question.id}')">
                    <div class="form-group">
                        <textarea placeholder="Write your answer..." required></textarea>
                    </div>
                    <button type="submit" class="btn-primary">Post Answer</button>
                </form>
            </div>
        `;
    }
}

// Form Handlers
async function handleAskQuestion(e) {
    e.preventDefault();
    
    const title = document.getElementById('questionTitle').value;
    const content = document.getElementById('questionContent').value;
    const tags = document.getElementById('questionTags').value;
    
    const questionData = {
        title: title,
        content: content,
        author: currentUser ? currentUser.name : 'Anonymous',
        authorAvatar: currentUser ? currentUser.name.split(' ').map(n => n[0]).join('') : 'AN',
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    
    const success = await postQuestion(questionData);
    
    if (success) {
        // Reset form
        e.target.reset();
        closeModal('askQuestionModal');
        showNotification('Question posted successfully!', 'success');
    }
}

function handleAuth(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    
    // Mock authentication
    currentUser = {
        name: email.split('@')[0],
        email: email,
        role: 'Student'
    };
    
    closeModal('authModal');
    showNotification('Successfully signed in!', 'success');
    
    // Update UI for logged-in user
    updateAuthUI();
}

function signInWithGoogle() {
    // Mock Google OAuth
    currentUser = {
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        role: 'Student'
    };
    
    closeModal('authModal');
    showNotification('Successfully signed in with Google!', 'success');
    updateAuthUI();
}

// Utility Functions
async function openQuestionDetail(questionId) {
    await renderQuestionDetail(questionId);
    openModal('questionDetailModal');
}

async function addAnswerToQuestion(e, questionId) {
    e.preventDefault();
    
    const answerText = e.target.querySelector('textarea').value;
    
    const answerData = {
        author: currentUser ? currentUser.name : 'Anonymous',
        content: answerText
    };
    
    const updatedQuestion = await addAnswer(questionId, answerData);
    
    if (updatedQuestion) {
        // Re-render the question detail
        await renderQuestionDetail(questionId);
        
        // Reset form
        e.target.reset();
        showNotification('Answer posted successfully!', 'success');
    }
}

async function voteAnswer(questionId, answerId, voteType) {
    const updatedQuestion = await voteAnswer(questionId, answerId, voteType);
    
    if (updatedQuestion) {
        // Re-render the question detail
        await renderQuestionDetail(questionId);
    }
}

function updateAuthUI() {
    const signinBtn = document.querySelector('.signin-btn');
    if (currentUser && signinBtn) {
        signinBtn.textContent = currentUser.name;
        signinBtn.onclick = function() {
            // Show user menu or profile
            alert(`Welcome, ${currentUser.name}!`);
        };
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Export functions for global access
window.openAuthModal = openAuthModal;
window.showAskQuestionForm = showAskQuestionForm;
window.showConnectModal = showConnectModal;
window.showMentorshipPage = showMentorshipPage;
window.closeModal = closeModal;
window.openQuestionDetail = openQuestionDetail;
window.voteAnswer = voteAnswer;
window.addAnswerToQuestion = addAnswerToQuestion;
window.signInWithGoogle = signInWithGoogle; 