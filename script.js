// Fetch and display posts
async function loadPosts() {
  let res = await fetch("/posts");
  let posts = await res.json();
  displayPosts(posts);
}

// Display posts
function displayPosts(posts) {
  let postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = "";
  posts.forEach((post, index) => {
    let postDiv = document.createElement("div");
    postDiv.classList.add("post");
    postDiv.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <input type="text" placeholder="Add a comment..." onkeypress="addComment(event, ${index})">
      <div id="comments-${index}">${post.comments.map(c => `<p>💬 ${c}</p>`).join("")}</div>
    `;
    postsDiv.appendChild(postDiv);
  });
}

// Add new post
document.getElementById("postForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  let title = document.getElementById("title").value;
  let content = document.getElementById("content").value;

  await fetch("/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content })
  });

  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
  loadPosts();
});

// Add comment
async function addComment(e, index) {
  if (e.key === "Enter") {
    let comment = e.target.value;
    await fetch(`/posts/${index}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment })
    });
    e.target.value = "";
    loadPosts();
  }
}

// Search filter
document.getElementById("search").addEventListener("keyup", async function() {
  let query = this.value.toLowerCase();
  let res = await fetch("/posts");
  let posts = await res.json();
  let filtered = posts.filter(p => p.title.toLowerCase().includes(query));
  displayPosts(filtered);
});

// Initial load
loadPosts();
