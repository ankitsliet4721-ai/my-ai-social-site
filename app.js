<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>DeepNet Social - AI Research Community</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <!-- Login Modal -->
  <div id="loginModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Welcome to DeepNet Social</h2>
        <button type="button" class="modal-close" onclick="closeLoginModal()">&times;</button>
      </div>
      <div class="modal-body">
        <div class="auth-tabs">
          <button type="button" class="auth-tab active" onclick="switchAuthTab('login')">Login</button>
          <button type="button" class="auth-tab" onclick="switchAuthTab('signup')">Sign Up</button>
        </div>
        
        <form id="loginForm" class="auth-form">
          <input type="email" id="loginEmail" placeholder="Enter email" required />
          <input type="password" id="loginPassword" placeholder="Enter password" required />
          <button type="submit" class="btn">Login</button>
          <div id="loginMessage"></div>
        </form>
        
        <form id="signupForm" class="auth-form hidden">
          <input type="email" id="signupEmail" placeholder="Enter email" required />
          <input type="password" id="signupPassword" placeholder="Create password" minlength="6" required />
          <button type="submit" class="btn">Sign Up</button>
          <div id="signupMessage"></div>
        </form>
      </div>
    </div>
  </div>

  <!-- Main App Layout -->
  <div id="app" class="hidden">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="logo">🧠 DeepNet Social</div>
        <input type="text" id="searchInput" placeholder="Search posts..." />
        <div>
          <span id="currentUserAvatar">👩‍🔬</span>
          <button onclick="logoutUser()">Logout</button>
        </div>
      </div>
    </header>

    <!-- Feed -->
    <main class="feed">
      <!-- Composer -->
      <div class="post-composer card">
        <textarea id="postContent" placeholder="Share your research insights..."></textarea>
        <button onclick="createPost()">Post</button>
      </div>

      <!-- Posts -->
      <div id="postsContainer"></div>
    </main>
  </div>

  <!-- Firebase -->
  <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js"></script>

  <script>
    // ================= Firebase Init =================
    const firebaseConfig = {
      apiKey: "AIzaSyBytov9p2TGFudvnwQZ1hSi5f9oXaSKDAQ",
      authDomain: "deepnet-social-backend.firebaseapp.com",
      projectId: "deepnet-social-backend",
      storageBucket: "deepnet-social-backend.firebasestorage.app",
      messagingSenderId: "689173633913",
      appId: "1:689173633913:web:b5290dc64ea8fd2b2f2da8",
      measurementId: "G-B1ENWRY6JK"
    };
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    // ================= Storage Helpers =================
    const STORAGE_KEY = "deepnet_posts";
    function getPosts(){ try { return JSON.parse(localStorage.getItem(STORAGE_KEY))||[]; } catch{ return []; } }
    function setPosts(p){ localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }

    // ================= Auth =================
    function switchAuthTab(tab){
      document.getElementById('loginForm').classList.toggle('hidden', tab!=='login');
      document.getElementById('signupForm').classList.toggle('hidden', tab!=='signup');
    }
    function closeLoginModal(){ document.getElementById('loginModal').style.display='none'; }
    function openLoginModal(){ document.getElementById('loginModal').style.display='block'; }
    function showApp(){ document.getElementById('app').classList.remove('hidden'); closeLoginModal(); }

    document.getElementById('signupForm').addEventListener('submit', e=>{
      e.preventDefault();
      const email=document.getElementById('signupEmail').value;
      const pass=document.getElementById('signupPassword').value;
      auth.createUserWithEmailAndPassword(email,pass).then(()=>{
        document.getElementById('signupMessage').textContent="✅ Account created!";
        setTimeout(showApp,500);
      }).catch(err=>document.getElementById('signupMessage').textContent=err.message);
    });

    document.getElementById('loginForm').addEventListener('submit', e=>{
      e.preventDefault();
      const email=document.getElementById('loginEmail').value;
      const pass=document.getElementById('loginPassword').value;
      auth.signInWithEmailAndPassword(email,pass).then(()=>{
        document.getElementById('loginMessage').textContent="✅ Login successful!";
        setTimeout(showApp,500);
      }).catch(err=>document.getElementById('loginMessage').textContent=err.message);
    });

    auth.onAuthStateChanged(user=>{
      if(user){ showApp(); document.getElementById('currentUserAvatar').textContent=user.email[0].toUpperCase(); renderPosts(); }
      else { document.getElementById('app').classList.add('hidden'); openLoginModal(); }
    });

    function logoutUser(){ auth.signOut(); }

    // ================= Posts =================
    function formatTime(t){ return new Date(t).toLocaleString(); }

    function createPost(){
      const user=auth.currentUser; if(!user) return alert("Login first!");
      const content=document.getElementById('postContent').value.trim();
      if(!content) return;
      const newPost={
        id:Date.now().toString(),
        content,
        authorId:user.uid,
        authorName:user.email.split('@')[0],
        authorEmail:user.email,
        authorAvatar:`https://i.pravatar.cc/40?u=${user.uid}`,
        createdAt:new Date().toISOString(),
        likes:0, likedBy:[], commentList:[]
      };
      const posts=getPosts(); posts.unshift(newPost); setPosts(posts);
      document.getElementById('postContent').value='';
      renderPosts();
    }

    function renderPosts(){
      const posts=getPosts();
      const container=document.getElementById('postsContainer');
      container.innerHTML='';
      posts.forEach(p=>container.appendChild(createPostElement(p)));
    }

    function createPostElement(post){
      const div=document.createElement('div');
      div.className='card post'; div.dataset.postId=post.id;
      const isLiked=post.likedBy.includes(auth.currentUser?.uid);
      div.innerHTML=`
        <div class="post-header">
          <img src="${post.authorAvatar}" class="user-avatar">
          <b>${post.authorName}</b> <small>${formatTime(post.createdAt)}</small>
        </div>
        <div class="post-content">${post.content}</div>
        <div class="post-stats">
          <span>${post.likes} reactions • <span class="comment-count">${post.commentList.length}</span> comments</span>
        </div>
        <div class="post-actions">
          <button onclick="toggleLike('${post.id}')" class="${isLiked?'liked':''}">👍 Like</button>
          <button onclick="focusCommentInput('${post.id}')">💬 Comment</button>
        </div>
        <div class="comments">
          <div class="comment-list"></div>
          <input class="comment-input" placeholder="Write a comment..." onkeydown="commentKeydown(event,'${post.id}')">
        </div>`;
      renderComments(div,post);
      return div;
    }

    function renderComments(postEl, post){
      const list=postEl.querySelector('.comment-list'); list.innerHTML='';
      (post.commentList||[]).forEach((c,idx)=>{
        const item=document.createElement('div');
        item.innerHTML=`<b>${c.author}</b>: ${c.text}
          ${auth.currentUser?.uid===c.userId?`<button onclick="deleteComment('${post.id}',${idx})">Delete</button>`:''}`;
        list.appendChild(item);
      });
    }

    function toggleLike(postId){
      const posts=getPosts(); const idx=posts.findIndex(p=>p.id===postId);
      if(idx===-1) return; const uid=auth.currentUser?.uid; if(!uid) return;
      const liked=posts[idx].likedBy.includes(uid);
      if(liked){ posts[idx].likedBy=posts[idx].likedBy.filter(x=>x!==uid); posts[idx].likes--; }
      else { posts[idx].likedBy.push(uid); posts[idx].likes++; }
      setPosts(posts); renderPosts();
    }

    function focusCommentInput(postId){
      document.querySelector(`[data-post-id="${postId}"] .comment-input`).focus();
    }

    function commentKeydown(e,postId){
      if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); addComment(postId); }
    }

    function addComment(postId){
      const posts=getPosts(); const idx=posts.findIndex(p=>p.id===postId); if(idx===-1) return;
      const input=document.querySelector(`[data-post-id="${postId}"] .comment-input`);
      const text=input.value.trim(); if(!text) return;
      const user=auth.currentUser;
      posts[idx].commentList.push({ userId:user.uid, author:user.email.split('@')[0], text, createdAt:new Date().toISOString() });
      setPosts(posts); renderPosts();
    }

    function deleteComment(postId,commentIndex){
      const posts=getPosts(); const idx=posts.findIndex(p=>p.id===postId); if(idx===-1) return;
      const comment=posts[idx].commentList[commentIndex];
      if(auth.currentUser?.uid!==comment.userId) return alert("Not allowed");
      posts[idx].commentList.splice(commentIndex,1);
      setPosts(posts); renderPosts();
    }

    // Search
    document.getElementById('searchInput').addEventListener('input', e=>{
      const q=e.target.value.toLowerCase();
      document.querySelectorAll('.post').forEach(p=>{
        p.style.display=p.innerText.toLowerCase().includes(q)?'block':'none';
      });
    });

    // Init
    window.onload=()=>{ switchAuthTab('login'); };
  </script>
</body>
</html>
