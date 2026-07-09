const socket = io("https://camra-project.onrender.com");
const videoElement = document.getElementById('myVideo');

// --- 📲 PHONE WALA KAAM (SENDER) ---
document.getElementById('startCamBtn').addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }); // Back camera automatic khulega
        videoElement.srcObject = stream;
        
        // Canvas banakar frames nikalna
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 400;
        canvas.height = 300;

        // Har 100ms me frame server par bhejna
        setInterval(() => {
            context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            const frameData = canvas.toDataURL('image/jpeg', 0.5); // 0.5 quality taaki network slow na ho
            socket.emit('video-frame', frameData);
        }, 100);

        alert("Phone camera shuru ho gaya hai aur frames bhej raha hai!");
    } catch (err) {
        alert("Camera access nahi mila: " + err);
    }
});

// --- 💻 LAPTOP WALA KAAM (RECEIVER) ---
document.getElementById('startWatchBtn').addEventListener('click', () => {
    alert("Laptop receiver mode active! Ab phone se aane wali stream yahan dikhegi.");
});

// Jab bhi server se koi naya frame aaye, use video ke upar image ki tarah chipka do
socket.on('stream-frame', (frameData) => {
    // Purane srcObject ko hata kar direct frame data base64 show karenge
    videoElement.srcObject = null; 
    videoElement.src = frameData;
});