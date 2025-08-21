# Engineer's Guide - Community Module (HTML/CSS/JS + Node.js)

A responsive Community module (like Quora) built with **HTML**, **CSS**, **JavaScript**, and **Node.js Express** backend for the "Engineer's Guide" final year project.

## 🚀 Features

### Core Functionality
- ✅ **Persistent Data Storage** - Questions and answers stored on server
- ✅ **Cross-Computer Sharing** - Data shared across all connected computers
- ✅ **Ask Questions** - Form with title, content, and tags
- ✅ **Answer Questions** - Community members can provide answers
- ✅ **Upvote/Downvote** - Voting system for answers
- ✅ **User Authentication** - Mock authentication system
- ✅ **Tag System** - Categorize questions (DSA, Internships, Resume, etc.)
- ✅ **Real-time Updates** - Dynamic content without page refresh

### Backend API
- ✅ **GET /api/questions** - Fetch all questions
- ✅ **POST /api/questions** - Create new questions
- ✅ **GET /api/questions/:id** - Get specific question details
- ✅ **PUT /api/questions/:id** - Update questions (add answers, vote)

### UI/UX Features
- ✅ **Clean, Modern Design** - Inspired by Quora/Stack Overflow
- ✅ **Responsive Layout** - Works on desktop, tablet, and mobile
- ✅ **Card-based Design** - Clean presentation of questions and answers
- ✅ **Modal System** - Smooth interactions for forms and details
- ✅ **Loading States** - Show loading indicators while fetching data

## 📁 Project Structure

```
COMMUNITY/
├── 📄 server.js              # Node.js Express server
├── 📄 package.json           # Dependencies
├── 📁 public/
│   ├── 📄 index.html         # Main HTML file
│   ├── 📄 styles.css         # CSS styles
│   └── 📄 script.js          # Frontend JavaScript
└── 📄 README_HTML.md         # This documentation
```

## 🛠️ Technologies Used

- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with Flexbox and Grid
- **JavaScript (ES6+)** - Frontend functionality
- **Node.js** - Backend runtime
- **Express.js** - Web server framework
- **CORS** - Cross-origin resource sharing
- **Font Awesome** - Icons for UI elements
- **Google Fonts** - Inter font family

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ installed
- Modern web browser

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   # or for development with auto-restart:
   npm run dev
   ```

3. **Open the Application**
   Visit [http://localhost:3000](http://localhost:3000)

### No Build Process Required!
This project uses vanilla HTML, CSS, and JavaScript, so you can run it directly.

## 📱 Features Overview

### Homepage
- **Hero Section**: Welcome message and community introduction
- **Feature Cards**: Three main community features
  - Connect with Engineers
  - Share Insights
  - Support Each Other

### Community Page
- **Trending Discussions**: List of popular questions from server
- **Question Cards**: Display with author, tags, and engagement metrics
- **Interactive Elements**: Click to view full discussions

### Ask Question Form
- **Title Input**: Clear question title
- **Content Area**: Detailed question description
- **Tag System**: Categorize with relevant tags
- **Form Validation**: Required fields and proper formatting

### Question Detail View
- **Full Question**: Complete question with author info
- **Answers Section**: All community answers from server
- **Voting System**: Upvote/downvote answers
- **Add Answer**: Form to contribute answers

### Authentication
- **Sign In Modal**: Email/password authentication
- **Google OAuth**: Mock Google sign-in
- **User State**: Track logged-in user

## 🔧 API Endpoints

### Questions
- `GET /api/questions` - Get all questions
- `POST /api/questions` - Create new question
- `GET /api/questions/:id` - Get specific question
- `PUT /api/questions/:id` - Update question (add answers, vote)

## 🎯 Sample Data

The application includes realistic engineering questions:

1. **"How can I get an internship in 2nd year?"**
   - Tags: Internships, Resume, DSA
   - 23 replies, 45 likes

2. **"Best tools for remote team collaboration"**
   - Tags: Remote Work, Team Management, Tools
   - 15 replies, 32 likes

3. **"Machine Learning roadmap for beginners"**
   - Tags: Machine Learning, AI, Learning Path
   - 28 replies, 67 likes

4. **"Resume tips for software engineering roles"**
   - Tags: Resume, Career, Software Engineering
   - 19 replies, 41 likes

## 🌐 Cross-Computer Sharing

### How It Works:
1. **Server Storage**: All data is stored on the Node.js server
2. **Real-time Updates**: Changes are immediately available to all users
3. **Shared Database**: Questions and answers persist across sessions
4. **Network Access**: Multiple computers can access the same data

### To Share Across Computers:
1. **Deploy the server** to a cloud platform (Heroku, Railway, etc.)
2. **Update the API URL** in `public/script.js`
3. **Access from any computer** using the deployed URL

## 🔧 Development

### Adding New Features
1. **New Question Types**: Modify the server data structure
2. **Additional Tags**: Update the tag system in JavaScript
3. **User Roles**: Extend the user role system
4. **Styling**: Customize colors and layout in `public/styles.css`

### Database Operations
```javascript
// Create a new question
const response = await fetch('/api/questions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Your question title',
    content: 'Your question content',
    author: 'Your name',
    tags: ['tag1', 'tag2']
  })
});

// Get all questions
const response = await fetch('/api/questions');
const data = await response.json();

// Add an answer
const response = await fetch(`/api/questions/${questionId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'addAnswer',
    answerData: {
      author: 'Your name',
      content: 'Your answer'
    }
  })
});
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Desktop**: 1200px+ (full layout)
- **Tablet**: 768px-1199px (adjusted grid)
- **Mobile**: <768px (stacked layout)

## 🎨 Color Scheme

- **Primary**: #667eea (Purple)
- **Secondary**: #764ba2 (Dark Purple)
- **Background**: #f8fafc (Light Gray)
- **Text**: #1a202c (Dark Gray)
- **Accent**: #e6f3ff (Light Blue)

## 🚀 Deployment

### Local Development
```bash
npm install
npm start
# Visit http://localhost:3000
```

### Production Deployment

#### Option 1: Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login and deploy
heroku login
heroku create your-app-name
git push heroku main
```

#### Option 2: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### Option 3: Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

## 🔮 Future Enhancements

- **Real-time Chat**: WebSocket integration
- **Mentorship System**: Connect mentors with mentees
- **Job Board**: Integration with job postings
- **Advanced Search**: Filter by tags, date, popularity
- **User Profiles**: Detailed user information and activity
- **Notification System**: Real-time notifications
- **Dark Mode**: Toggle between light and dark themes
- **Image Upload**: Support for question/answer images
- **Email Notifications**: Notify users of responses
- **Database Integration**: MongoDB or PostgreSQL for persistence

## 🐛 Troubleshooting

### Common Issues:

1. **Port 3000 already in use**
   ```bash
   # Kill the process
   lsof -ti:3000 | xargs kill -9
   # Or use a different port
   PORT=3001 npm start
   ```

2. **API not responding**
   ```bash
   # Check if server is running
   curl http://localhost:3000/api/questions
   ```

3. **CORS errors**
   ```bash
   # Make sure CORS is enabled in server.js
   # Check browser console for errors
   ```

4. **Static files not loading**
   ```bash
   # Check if public folder exists
   ls public/
   # Verify file paths in HTML
   ```

## 📞 Support

For questions or support:
- **Email**: contact@engineersguide.com
- **Telegram**: Join our community group
- **Twitter**: Follow for updates

## 📄 License

This project is created for educational purposes as a final year project.

---

**🎉 Your Community module is ready to use with cross-computer sharing!**

### Key Benefits:
- ✅ **No build process** - Pure HTML/CSS/JS
- ✅ **Cross-computer sharing** - Data shared across all users
- ✅ **Real-time updates** - Changes appear immediately
- ✅ **Responsive design** - Works on all devices
- ✅ **Professional UI/UX** - Inspired by Quora/Stack Overflow 