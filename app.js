const socket = io("https://camra-project.onrender.com");
const videoElement = document.getElementById('myVideo');
const receiverImage = document.getElementById('receiverImg'); // Naya image tag select kiya

// --- 📲 PHONE WALA KAAM (SENDER) ---
document.getElementById('startCamBtn').addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }); 
        videoElement.srcObject = stream;
        videoElement.style.display = "block"; // Phone par camera view dikhane ke liye
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 400;
        canvas.height = 300;

        // Har 100ms me frame nikal kar server ko bhejenge
        setInterval(() => {
            if (videoElement.srcObject) {
                context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                const frameData = canvas.toDataURL('image/jpeg', 0.4); // Quality 0.4 taaki lag na ho
                socket.emit('video-frame', frameData);
            }
        }, 100);

        alert("Phone camera shuru ho gaya hai!");
    } catch (err) {
        alert("Camera access nahi mila: " + err);
    }
});

// --- 💻 LAPTOP WALA KAAM (RECEIVER) ---
document.getElementById('startWatchBtn').addEventListener('click', () => {
    alert("Laptop receiver mode active! Ab phone ki stream yahan dikhegi.");
});

// Jab server se frame aaye, toh laptop par use IMG tag me set karo
socket.on('stream-frame', (frameData) => {
    receiverImage.src = frameData; // Yeh line ab bina kisi error ke live photo badlegi
});