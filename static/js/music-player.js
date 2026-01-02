document.addEventListener('DOMContentLoaded', function() {
    const player = document.getElementById('global-music-player');
    const audio = document.getElementById('global-audio');
    const target = document.getElementById('about-player-target');
    
    // UI Elements
    const miniPlayBtn = document.getElementById('mini-play-btn');
    const fullPlayIcon = document.getElementById('global-play-icon');
    const titleElem = document.getElementById('global-title');
    const artistElem = document.getElementById('global-artist');
    const coverElem = document.getElementById('global-cover');

    // State
    let currentTrackIndex = 0;
    let isPlaying = false;

    // 1. Layout Logic (Teleportation)
    if (target && player) {
        // We are on About page
        target.appendChild(player);
        player.classList.remove('mode-mini');
        player.classList.add('mode-full');
        player.style.display = 'flex'; // Ensure visible
    } else if (player) {
        // We are on other pages
        player.classList.remove('mode-full');
        player.classList.add('mode-mini');
        player.style.display = 'flex'; // Ensure visible
    }

    // 2. Playlist Logic
    const playlist = window.sitePlaylist || [];
    
    function loadTrack(index) {
        if (index < 0 || index >= playlist.length) return;
        const track = playlist[index];
        currentTrackIndex = index;
        
        if(titleElem) titleElem.textContent = track.title;
        if(artistElem) artistElem.textContent = track.artist;
        if(coverElem) coverElem.src = track.cover || "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg";
        
        // Only change src if it's different to avoid reloading
        // But since page reloaded, we must set it.
        // To support "resume", we need to check localStorage
        if(audio.src !== track.url && !audio.src.endsWith(track.url)) {
             audio.src = track.url;
        }
    }

    function updatePlayStatus(playing) {
        isPlaying = playing;
        if (playing) {
            player.classList.add('playing');
            if(miniPlayBtn) miniPlayBtn.textContent = '⏸';
            if(fullPlayIcon) fullPlayIcon.textContent = '⏸';
        } else {
            player.classList.remove('playing');
            if(miniPlayBtn) miniPlayBtn.textContent = '▶';
            if(fullPlayIcon) fullPlayIcon.textContent = '▶';
        }
    }

    function togglePlay() {
        if (audio.paused) {
            audio.play().then(() => {
                updatePlayStatus(true);
                saveState();
            }).catch(e => console.error("Play failed:", e));
        } else {
            audio.pause();
            updatePlayStatus(false);
            saveState();
        }
    }

    // 3. State Persistence
    function saveState() {
        const state = {
            index: currentTrackIndex,
            currentTime: audio.currentTime,
            playing: !audio.paused,
            timestamp: Date.now()
        };
        localStorage.setItem('musicPlayerState', JSON.stringify(state));
    }

    function restoreState() {
        const saved = localStorage.getItem('musicPlayerState');
        if (saved) {
            try {
                const state = JSON.parse(saved);
                // Check if state is too old (e.g. > 1 hour), maybe ignore? 
                // For now, just restore.
                
                if (state.index >= 0 && state.index < playlist.length) {
                    loadTrack(state.index);
                    audio.currentTime = state.currentTime;
                    
                    // Auto-resume if it was playing
                    // Note: Browsers block autoplay. We try, but might fail.
                    if (state.playing) {
                        const playPromise = audio.play();
                        if (playPromise !== undefined) {
                            playPromise.then(() => {
                                updatePlayStatus(true);
                            }).catch(error => {
                                console.log("Autoplay prevented by browser policy");
                                updatePlayStatus(false);
                            });
                        }
                    }
                } else {
                    loadDefault();
                }
            } catch (e) {
                console.error("Error restoring state", e);
                loadDefault();
            }
        } else {
            loadDefault();
        }
    }

    function loadDefault() {
        if (playlist.length > 0) {
            // Check theme for default track
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const themeMatchIndex = playlist.findIndex(t => t.theme === (isDark ? 'dark' : 'light'));
            loadTrack(themeMatchIndex !== -1 ? themeMatchIndex : 0);
        }
    }

    // Event Listeners
    if (player) {
        player.addEventListener('click', function(e) {
            // Prevent click if clicking specific controls if needed, 
            // but generally clicking anywhere toggles play is fine for mini.
            // For full mode, maybe we want specific buttons?
            // The original code had click on player toggles play.
            togglePlay();
        });
    }

    if (audio) {
        audio.addEventListener('timeupdate', () => {
            // Save state every second or so? Too frequent.
            // Maybe just on pause/unload.
            // But if user navigates, we need it saved.
            // 'beforeunload' is better.
        });
        
        audio.addEventListener('ended', () => {
            if (!audio.loop) {
                updatePlayStatus(false);
            }
        });
    }

    window.addEventListener('beforeunload', () => {
        saveState();
    });

    // Initialize
    restoreState();

    // Expose API for Terminal
    window.musicPlayer = {
        play: (index) => {
            loadTrack(index);
            audio.play().then(() => updatePlayStatus(true));
        },
        stop: () => {
            audio.pause();
            updatePlayStatus(false);
        },
        next: () => {
            const nextIdx = (currentTrackIndex + 1) % playlist.length;
            window.musicPlayer.play(nextIdx);
        },
        prev: () => {
            const prevIdx = (currentTrackIndex - 1 + playlist.length) % playlist.length;
            window.musicPlayer.play(prevIdx);
        },
        list: () => playlist,
        getCurrentIndex: () => currentTrackIndex
    };
});
