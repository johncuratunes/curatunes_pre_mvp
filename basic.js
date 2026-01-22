// Sound System using real human-made sounds
class SoundManager {
    constructor() {
        this.sounds = {};
        this.audioContext = null;
        this.initAudioContext();
        this.loadSounds();
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    loadSounds() {
        // Using local sound files for best quality and reliability
        // Download free high-quality UI sounds from:
        // - freesound.org (search: "ui click", "button click", "pop", "whoosh", "hover")
        // - zapsplat.com (free account required)
        // - mixkit.co/free-sound-effects/ui
        // - pixabay.com/music/search/ui
        //
        // Place the sound files in a 'sounds' folder in your project root
        // Recommended formats: .mp3 or .ogg (for better browser compatibility)
        
        const soundPath = 'sounds/'; // Change this if your sounds are in a different folder
        
        this.sounds = {
            click: new Audio(soundPath + 'click.mp3'),
            click2: new Audio(soundPath + 'click2.mp3'),
            pop: new Audio(soundPath + 'pop.mp3'),
            whoosh: new Audio(soundPath + 'whoosh.mp3'),
            hover: new Audio(soundPath + 'hover.mp3')
        };

        // Set volume levels for each sound (adjust as needed)
        this.sounds.click.volume = 0.15;
        this.sounds.click2.volume = 0.15;
        this.sounds.pop.volume = 0.2;
        this.sounds.whoosh.volume = 0.03;
        this.sounds.hover.volume = 0.075;

        // Preload sounds
        Object.entries(this.sounds).forEach(([name, sound]) => {
            sound.preload = 'auto';
            sound.load();
            // Handle errors gracefully - fallback to silent if file not found
            sound.onerror = () => {
                console.warn(`Sound file '${name}' not found. Please add sound files to the 'sounds' folder.`);
                // Create a silent audio as fallback
                this.sounds[name] = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzGFzvLZijYIG2m98OSfTgwOUKfk8LZjGwY4kdfyzHksBSR3x/DdkEAKFF606euoVRQKRp/g8r5sIQcxhc7y2Yo2CBtpvfDkn04MDlCn5PC2YxsGOJHX8sx5LAUkd8fw3ZBAC');
            };
        });
    }

    playClick() {
        if (this.sounds.click) {
            const sound = this.sounds.click.cloneNode();
            sound.volume = 0.15;
            sound.play().catch(() => {}); // Ignore autoplay errors
        }
    }

    playClick2() {
        if (this.sounds.click2) {
            const sound = this.sounds.click2.cloneNode();
            sound.volume = 0.05;
            sound.play().catch(() => {});
        }
    }

    playPop() {
        if (this.sounds.pop) {
            const sound = this.sounds.pop.cloneNode();
            sound.volume = 0.2;
            sound.play().catch(() => {});
        }
    }

    playWhoosh() {
        if (this.sounds.whoosh) {
            const sound = this.sounds.whoosh.cloneNode();
            sound.volume = 0.005;
            sound.play().catch(() => {});
        }
    }

    playHover() {
        if (this.sounds.hover) {
            const sound = this.sounds.hover.cloneNode();
            sound.volume = 0.075;
            sound.play().catch(() => {});
        }
    }
}

// Initialize sound manager
const sounds = new SoundManager();

// Helper function to play sound on user interaction
function playSoundOnClick(soundType = 'click') {
    // Resume audio context if suspended (required by browsers)
    if (sounds.audioContext && sounds.audioContext.state === 'suspended') {
        sounds.audioContext.resume();
    }
    
    switch(soundType) {
        case 'click':
            sounds.playClick();
            break;
        case 'click2':
            sounds.playClick2();
            break;
        case 'pop':
            sounds.playPop();
            break;
        case 'whoosh':
            sounds.playWhoosh();
            break;
        case 'hover':
            sounds.playHover();
            break;
        default:
            sounds.playClick();
    }
}

// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href').substring(1);
        
        // Check if we're actually switching to a different page
        const currentActivePage = document.querySelector('.page.active');
        const targetPage = document.getElementById(targetId);
        
        // Only play whoosh if switching to a different page
        if (currentActivePage && currentActivePage.id !== targetId) {
            playSoundOnClick('whoosh');
        } else {
            playSoundOnClick('click');
        }
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Show target page
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        targetPage.classList.add('active');
    });
});

// Socials button handlers
document.querySelectorAll('.socials-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        playSoundOnClick('pop');
        document.getElementById('socialsModal').classList.add('active');
    });
});

// Close modal
document.querySelector('.close').addEventListener('click', () => {
    playSoundOnClick('click');
    document.getElementById('socialsModal').classList.remove('active');
});

// Close modal on outside click
window.addEventListener('click', (e) => {
    const modal = document.getElementById('socialsModal');
    if (e.target === modal) {
        playSoundOnClick('click');
        modal.classList.remove('active');
    }
});

// Social media links
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        playSoundOnClick('click2');
    });
});

// Add click sounds to all buttons
document.querySelectorAll('button').forEach(btn => {
    if (!btn.classList.contains('socials-btn') && !btn.classList.contains('social-btn')) {
        btn.addEventListener('click', () => {
            playSoundOnClick('click');
        });
    }
});

// Card hover sounds
let hoverTimeout;
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        // Resume audio context if needed
        if (sounds.audioContext && sounds.audioContext.state === 'suspended') {
            sounds.audioContext.resume();
        }
        
        // Clear any pending hover sound
        clearTimeout(hoverTimeout);
        
        // Small delay to avoid too many sounds
        hoverTimeout = setTimeout(() => {
            playSoundOnClick('hover');
        }, 50);
    });
});

