// App functionality and UI interactions

// Global app state
const appState = {
  currentUser: null,
  posts: [],
  currentSection: 'home'
};

// UI Helper functions
function showSection(section) {
  appState.currentSection = section;
  
  // Update active nav link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  
  document.querySelector(`[onclick="showSection('${section}')"]`).classList.add('active');
  
  // Here you would typically show/hide different content sections
  console.log(`Showing section: ${section}`);
}

function toggleTheme() {
  // Theme toggle functionality
  const body = document.body;
  
  if (body.classList.contains('light-theme')) {
    body.classList.remove('light-theme');
    localStorage.setItem('theme', 'dark');
  } else {
    body.classList.add('light-theme');
    localStorage.setItem('theme', 'light');
  }
}

function filterFeed(filter) {
  // Update active sidebar link
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.remove('active');
  });
  
  document.querySelector(`[onclick="filterFeed('${filter}')"]`).classList.add('active');
  
  // Filter feed content
  console.log(`Filtering feed: ${filter}`);
  // Implementation would go here
}

function showSettings() {
  console.log('Showing settings');
  // Implementation would go here
}

// Post creation functionality
function createPost() {
  const postContent = document.getElementById('postContent').value.trim();
  
  if (!postContent) {
    alert('Please enter some content for your post');
    return;
  }
  
  const privacyLevel = document.querySelector('.privacy-select').value;
  
  // Create post object
  const newPost = {
    id: Date.now().toString(),
    content: postContent,
    privacy: privacyLevel,
    author: appState.currentUser?.email || 'Anonymous',
    timestamp: new Date(),
    likes: 0,
    comments: []
  };
  
  // Add to posts array
  appState.posts.unshift(newPost);
  
  // Clear the composer
  document.getElementById('postContent').value = '';
  
  // Render the new post
  renderPosts();
  
  console.log('Post created:', newPost);
}

function togglePostType(type) {
  // Update active composer button
  document.querySelectorAll('.composer-btn').forEach(btn => {
    btn.style.backgroundColor = '';
  });
  
  event.target.style.backgroundColor = '#238636';
  
  // You could modify the composer UI based on type
  console.log(`Post type selected: ${type}`);
}

// Render posts in feed
function renderPosts() {
  const postsContainer = document.getElementById('postsContainer');
  
  if (appState.posts.length === 0) {
    postsContainer.innerHTML = `
      <div class="card" style="text-align: center; padding: 40px;">
        <h3 style="color: #8b949e; margin-bottom: 8px;">No posts yet</h3>
        <p style="color: #8b949e; font-size: 14px;">Share your first research insight above!</p>
      </div>
    `;
    return;
  }
  
  postsContainer.innerHTML = appState.posts.map(post => `
    <div class="card post">
      <div class="post-header" style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
        <div class="user-avatar">👩‍🔬</div>
        <div>
          <div style="font-weight: 600; font-size: 14px;">${post.author}</div>
          <div style="color: #8b949e; font-size: 12px;">${formatDate(post.timestamp)}</div>
        </div>
      </div>
      <div class="post-content" style="margin-bottom: 16px; line-height: 1.5;">
        ${post.content}
      </div>
      <div class="post-actions" style="display: flex; gap: 16px; color: #8b949e; font-size: 14px;">
        <button onclick="likePost('${post.id}')" style="background: none; border: none; color: inherit; cursor: pointer; display: flex; align-items: center; gap: 4px;">
          ❤️ ${post.likes}
        </button>
        <button onclick="commentPost('${post.id}')" style="background: none; border: none; color: inherit; cursor: pointer; display: flex; align-items: center; gap: 4px;">
          💬 ${post.comments.length}
        </button>
        <button onclick="sharePost('${post.id}')" style="background: none; border: none; color: inherit; cursor: pointer; display: flex; align-items: center; gap: 4px;">
          🔄 Share
        </button>
      </div>
    </div>
  `).join('');
}

// Post interaction functions
function likePost(postId) {
  const post = appState.posts.find(p => p.id === postId);
  if (post) {
    post.likes++;
    renderPosts();
  }
}

function commentPost(postId) {
  const comment = prompt('Enter your comment:');
  if (comment) {
    const post = appState.posts.find(p => p.id === postId);
    if (post) {
      post.comments.push({
        author: appState.currentUser?.email || 'Anonymous',
        content: comment,
        timestamp: new Date()
      });
      renderPosts();
    }
  }
}

function sharePost(postId) {
  console.log(`Sharing post: ${postId}`);
  alert('Post shared! (Feature would be implemented here)');
}

// Utility functions
function formatDate(date) {
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  
  return date.toLocaleDateString();
}

// Load sample data for demonstration
function loadSampleData() {
  const samplePosts = [
    {
      id: '1',
      content: 'Excited to share our new research on transformer architectures! We achieved a 15% improvement in efficiency while maintaining accuracy. 🚀 #AI #Research',
      privacy: 'public',
      author: 'Dr. Sarah Chen',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      likes: 12,
      comments: [
        { author: 'John Doe', content: 'Fascinating work!', timestamp: new Date() }
      ]
    },
    {
      id: '2',
      content: 'Looking for collaborators on a computer vision project involving medical imaging. DM if interested! #ComputerVision #Healthcare',
      privacy: 'research',
      author: 'Prof. Michael Rodriguez',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      likes: 8,
      comments: []
    }
  ];
  
  appState.posts = samplePosts;
  renderPosts();
}

// Initialize app on page load
document.addEventListener('DOMContentLoaded', () => {
  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
  }
  
  // Load sample data after a short delay (to simulate loading)
  setTimeout(() => {
    loadSampleData();
  }, 1000);
});

// Update trending topics
function updateTrendingTopics() {
  const trendingContainer = document.getElementById('trendingTopics');
  const topics = [
    '#MachineLearning',
    '#NeurIPS2025',
    '#ComputerVision',
    '#NLP',
    '#DeepLearning',
    '#AIResearch'
  ];
  
  trendingContainer.innerHTML = topics.map(topic => 
    `<div style="padding: 8px 0; color: #58a6ff; cursor: pointer;">${topic}</div>`
  ).join('');
}

// Update suggested users
function updateSuggestedUsers() {
  const suggestedContainer = document.getElementById('suggestedUsers');
  const users = [
    { name: 'Dr. Lisa Wang', field: 'Computer Vision' },
    { name: 'Prof. James Smith', field: 'NLP' },
    { name: 'Dr. Anna Kumar', field: 'Robotics' }
  ];
  
  suggestedContainer.innerHTML = users.map(user => `
    <div style="display: flex; align-items: center; gap: 8px; padding: 8px 0; border-bottom: 1px solid #30363d;">
      <div class="user-avatar" style="width: 24px; height: 24px; font-size: 12px;">👤</div>
      <div style="flex: 1;">
        <div style="font-weight: 500; font-size: 13px;">${user.name}</div>
        <div style="color: #8b949e; font-size: 11px;">${user.field}</div>
      </div>
      <button style="padding: 4px 8px; background: #238636; border: none; border-radius: 4px; color: white; font-size: 11px; cursor: pointer;">Follow</button>
    </div>
  `).join('');
}

// Initialize dynamic content
setTimeout(() => {
  updateTrendingTopics();
  updateSuggestedUsers();
}, 500);
