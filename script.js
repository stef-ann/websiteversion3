// Open, close, minimize, and toggle logic
function openWindow(id) {
    const win = document.getElementById(id);
    win.classList.remove('hidden');
    bringToFront(win);
}

function closeWindow(id) {
    const win = document.getElementById(id);
    win.classList.add('hidden');
}

function minimizeWindow(id) {
    const win = document.getElementById(id);
    win.classList.add('hidden');
}

function toggleWindow(id) {
    const win = document.getElementById(id);
    win.classList.toggle('hidden');
    if (!win.classList.contains('hidden')) bringToFront(win);
}

// Bring window to front
function bringToFront(win) {
    const allWindows = document.querySelectorAll('.window');
    allWindows.forEach(w => w.style.zIndex = 100);
    win.style.zIndex = 101;
}

// Drag logic
document.querySelectorAll('.window').forEach(win => {
    const titlebar = win.querySelector('.window-titlebar');
    let isDragging = false, offsetX, offsetY;

    titlebar.addEventListener('mousedown', (e) => {
        isDragging = true;
        const rect = win.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        bringToFront(win);
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            win.style.left = (e.clientX - offsetX) + 'px';
            win.style.top = (e.clientY - offsetY) + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
});

async function fetchSystemInfo() {
    try {
        const response = await fetch('https://ipinfo.io/json?token=578e339a6329e3');
        const data = await response.json();

        const ip = data.ip;
        const location = `${data.city}, ${data.region}, ${data.country}`;
        const timezone = data.timezone;

        // Update widget
        document.getElementById('widget-ip').textContent = `IP: ${ip}`;
        document.getElementById('widget-location').textContent = `Location: ${location}`;
        updateSystemClock(timezone); // initial time
        setInterval(() => updateSystemClock(timezone), 1000); // update every second
    } catch (error) {
        console.error('IPInfo fetch error:', error);
    }
}

function updateSystemClock(timezone) {
    const timeString = new Date().toLocaleString('en-US', { timeZone: timezone });
    document.getElementById('widget-time').textContent = `Time: ${timeString}`;
}

// Call on load
document.addEventListener("DOMContentLoaded", fetchSystemInfo);


function loadTask(taskName) {
    const contentArea = document.querySelector('#about-me-window .main-content');
    fetch(`content/${taskName}.html`)
        .then(response => {
            if (!response.ok) throw new Error("Failed to load " + taskName);
            return response.text();
        })
        .then(html => {
            contentArea.innerHTML = html;
        })
        .catch(error => {
            contentArea.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
        });
}

function openLightbox(imgElement) {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    lightboxImg.src = imgElement.src;
    lightbox.classList.remove("hidden");
}

function closeLightbox() {
    document.getElementById("lightbox").classList.add("hidden");
}

function openLightbox(imgElement) {
    console.log("Opening lightbox for", imgElement.src);
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    lightboxImg.src = imgElement.src;
    lightbox.classList.remove("hidden");
}

function closeLightbox() {
    document.getElementById("lightbox").classList.add("hidden");
}

function maximizeWindow(id) {
    const win = document.getElementById(id);
    if (win.classList.contains('maximized')) {
        // Restore original size
        win.style.top = win.dataset.prevTop;
        win.style.left = win.dataset.prevLeft;
        win.style.width = win.dataset.prevWidth;
        win.style.height = win.dataset.prevHeight;
        win.classList.remove('maximized');
    } else {
        // Save current position & size
        win.dataset.prevTop = win.style.top;
        win.dataset.prevLeft = win.style.left;
        win.dataset.prevWidth = win.style.width;
        win.dataset.prevHeight = win.style.height;

        // Maximize to fill screen (minus taskbar)
        win.style.top = '0px';
        win.style.left = '0px';
        win.style.width = '100vw';
        win.style.height = 'calc(100vh - 40px)'; // 40px = taskbar
        win.classList.add('maximized');
    }
}
