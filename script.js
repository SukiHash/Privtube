let nextPageToken = ''; // Variable to store the next page token
let isLoading = false; // Variable to prevent multiple simultaneous requests
let history = []; // Array to store history

function searchVideos() {
  var searchQuery = document.getElementById('searchInput').value.trim();
  if (searchQuery === '') return;

  nextPageToken = ''; // Reset token when a new search is performed
  clearVideoContainer(); // Clear existing videos
  addToHistory(searchQuery); // Add to history
  loadVideos(searchQuery);
}

function loadVideos(keyword) {
  if (isLoading) return;

  isLoading = true;
  var url = `https://www.googleapis.com/youtube/v3/search?key=AIzaSyD264oh-8oBj02CTcHgD024qr633XOw1Ks&type=video&part=snippet&q=${keyword}&pageToken=${nextPageToken}&maxResults=20`;

  // Fetching YouTube API
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.items) {
        displayVideos(data.items);
        nextPageToken = data.nextPageToken || ''; // Update the next page token
      }
      isLoading = false;
    })
    .catch(error => {
      console.error('Error fetching videos:', error);
      isLoading = false;
    });
}

function displayVideos(videos) {
  var videoGrid = document.getElementById('videoGrid');

  videos.forEach(video => {
    if (!video.id.videoId) return; // Skip videos without ID (e.g., channels)

    var videoId = video.id.videoId;
    var videoTitle = video.snippet.title;
    var videoThumbnail = video.snippet.thumbnails.medium.url;

    // Create a container for video item with thumbnail and title
    var videoItem = document.createElement('div');
    videoItem.classList.add('video-item');

    // Create thumbnail image element
    var thumbnailImg = document.createElement('img');
    thumbnailImg.classList.add('video-thumbnail');
    thumbnailImg.src = videoThumbnail;

    // Create a div for video title
    var titleDiv = document.createElement('div');
    titleDiv.classList.add('video-title');
    titleDiv.textContent = videoTitle;

    // Append thumbnail and title to the video item container
    videoItem.appendChild(thumbnailImg);
    videoItem.appendChild(titleDiv);

    // Handle click event to embed video
    videoItem.onclick = function() {
      embedVideo(videoId);
    };

    // Append video item to the video grid
    videoGrid.appendChild(videoItem);
  });
}

function embedVideo(videoId) {
  var videoGrid = document.getElementById('videoGrid');
  videoGrid.innerHTML += `<iframe width="100%" height="400" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
}

function clearVideoContainer() {
  var videoGrid = document.getElementById('videoGrid');
  videoGrid.innerHTML = ''; // Remove existing videos
}

// Function to add to history
function addToHistory(query) {
  history.push(query);
}

// Function to load history (not implemented in this example)
function History() {
  history = [];
  alert('History feature is not implemented.');
}

// Load home videos initially
function loadHome() {
  clearVideoContainer(); // Clear existing videos
  loadVideos(''); // Load initial videos (you can modify this to load from a specific category)
}

// Load shorts (not implemented in this example)
function loadShorts() {
  alert('Shorts feature is not implemented.');
}

// Load home videos initially when the page loads
loadHome();

// Infinite scroll implementation
window.onscroll = function() {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    // User has scrolled to the bottom
    var searchQuery = document.getElementById('searchInput').value.trim();
    if (searchQuery !== '') {
      loadVideos(searchQuery); // Load more videos for the current search query
    } else {
      loadHome(); // Load more videos for home
    }
  }
};
