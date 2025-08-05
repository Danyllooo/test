document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    const player = document.getElementById('muzyka');
    const bgVideo = document.getElementById('bg-video');
    const volumeControl = document.getElementById('volumeControl');

    player.volume = parseFloat(volumeControl.value);

    overlay.addEventListener('click', () => {
        overlay.style.display = 'none';
        player.play().catch(err => console.log("Błąd audio:", err));
        bgVideo.play().catch(err => console.log("Błąd video:", err));
    });

    volumeControl.addEventListener('input', () => {
        const vol = parseFloat(volumeControl.value);
        player.volume = vol;
    });

    // ------------------------
    // galeria
    // ------------------------
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'g') {
            const input = prompt("Wpisz hasło, aby przejść do galerii:");
            const decoded = atob("bHVrYXM=");
            if (input === decoded) {
                window.location.href = "index2.html";
            } else if (input !== null) {
                alert("Błędne hasło!");
            }
        }
    });

    const galleryBtn = document.getElementById('openGalleryBtn');
    if (galleryBtn) {
        galleryBtn.addEventListener('click', () => {
            const password = prompt("Wpisz hasło, aby przejść do galerii:");
            if (password === "lukas") {
                window.location.href = "index2.html";
            } else if (password !== null) {
                alert("Błędne hasło!");
            }
        });
    }

    // ------------------------
    // Efekt śniegu
    // ------------------------
    const canvas = document.getElementById('snow');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let flakes = [];

    function addFlake() {
        const x = Math.random() * canvas.width;
        const size = Math.random() * 3 + 2;
        const speed = Math.random() * 1 + 0.5;
        flakes.push({ x, y: 0, size, speed });
    }

    function drawFlakes() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        flakes.forEach((flake, i) => {
            ctx.moveTo(flake.x, flake.y);
            ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
            flake.y += flake.speed;
            if (flake.y > canvas.height) {
                flakes.splice(i, 1);
            }
        });
        ctx.fill();
    }

    setInterval(addFlake, 100);
    setInterval(drawFlakes, 50);

    // ------------------------
    // Pobieranie statusu Discord API 
    // ------------------------
     async function fetchDiscordStatus() {
    try {
      const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
      const data = await res.json();

      if (data && data.success) {
        const user = data.data.discord_user;
        const spotify = data.data.spotify;
        const avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;

        document.getElementById('avatar').src = avatarUrl;
        document.getElementById('status-avatar').src = avatarUrl;
        document.getElementById('username').textContent = user.display_name || user.username;
        document.getElementById('status-name').textContent = user.display_name || user.username;

        const spotifyContainer = document.getElementById('spotify-container');
        spotifyContainer.innerHTML = '';

        if (spotify) {
          const albumArt = spotify.album_art_url || spotify.album_art_url_640 || 'default-image.png';

          const card = document.createElement('div');
          card.className = 'spotify-card';
          card.style.width = '420px';  

          card.innerHTML = `
            <img class="spotify-album-art" src="${albumArt}" alt="Okładka albumu" />
            <div class="spotify-info">
              <div class="spotify-song">${spotify.song}</div>
              <div class="spotify-artist">${spotify.artist}</div>
            </div>
          `;
          spotifyContainer.appendChild(card);
        }
      }
    } catch (err) {
      console.error('Błąd pobierania statusu Discord:', err);
    }
  }

  fetchDiscordStatus();
  setInterval(fetchDiscordStatus, 15000);
});