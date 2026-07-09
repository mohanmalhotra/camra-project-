// Server se connect karne ke liye socket initialize karein
const socket = io();

async function openCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        const videoElement = document.getElementById('myVideo');
        videoElement.srcObject = stream;
        console.log("Access mil gaya!");

        // --- CAMERA FRAMES KO SERVER PAR BHEJNA ---
        // Ek hidden canvas banayenge video ke frames ko image (data) me badalne ke liye
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 400;
        canvas.height = 300;

        // Har 100 milliseconds (0.1 second) me ek frame capture karke server ko bhejenge
        setInterval(() => {
            context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            const frameData = canvas.toDataURL('image/jpeg', 0.5); // Image ko compress karke text format me badla
            
            // Server ko frame bheja
            socket.emit('video-frame', frameData);
        }, 100);

    } catch (error) {
        console.error("Access nahi mila: ", error);
    }
}

window.onload = openCamera;