// scripts.js

let nextPageToken = '';
let isLoading = false;
let history = [];

function searchVideos() {
  var searchQuery = document.getElementById('searchInput').value.trim();
  if (searchQuery === '') return;

  nextPageToken = '';
  clearVideoContainer();
  addToHistory(searchQuery);
  loadVideos(searchQuery);
}

function loadVideos(keyword) {
  if (isLoading) return;

  isLoading = true;
  var url = `https://www.googleapis.com/youtube/v3/search?key=AIzaSyD264oh-8oBj02CTcHgD024qr633XOw1Ks&type=video&part=snippet&q=${keyword}&pageToken=${nextPageToken}&maxResults=20`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.items) {
        displayVideos(data.items);
        nextPageToken = data.nextPageToken || '';
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
    if (!video.id.videoId) return;

    var videoId = video.id.videoId;
    var videoTitle = video.snippet.title;
    var videoThumbnail = video.snippet.thumbnails.medium.url;

    var videoItem = document.createElement('div');
    videoItem.classList.add('video-item');

    var thumbnailImg = document.createElement('img');
    thumbnailImg.classList.add('video-thumbnail');
    thumbnailImg.src = videoThumbnail;

    var titleDiv = document.createElement('div');
    titleDiv.classList.add('video-title');
    titleDiv.textContent = videoTitle;

    videoItem.appendChild(thumbnailImg);
    videoItem.appendChild(titleDiv);

    videoItem.onclick = function() {
      embedVideo(videoId);
    };

    videoGrid.appendChild(videoItem);
  });
}

function embedVideo(videoId) {
  var videoGrid = document.getElementById('videoGrid');
  videoGrid.innerHTML += `<iframe width="100%" height="400" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
}

function clearVideoContainer() {
  var videoGrid = document.getElementById('videoGrid');
  videoGrid.innerHTML = '';
}

function addToHistory(query) {
  history.push(query);
}

function History() {
  history = [];
  alert('History feature is not implemented.');
}

function loadHome() {
  clearVideoContainer();
  loadVideos('');
}

function loadShorts() {
  alert('Shorts feature is not implemented.');
}

loadHome();

window.addEventListener('scroll', function() {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    var searchQuery = document.getElementById('searchInput').value.trim();
    if (searchQuery !== '') {
      loadVideos(searchQuery);
    } else {
      loadHome();
    }
  }
});
