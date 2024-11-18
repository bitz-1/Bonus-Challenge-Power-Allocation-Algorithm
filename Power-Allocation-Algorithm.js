const readline = require("readline");

// Constants
const MAX_CAPACITY = 100; // Total system capacity
const SAFE_CAPACITY = 92; // Safe usable capacity
const MAX_DEVICE_CAPACITY = 40; // Maximum power a single device can use

// Variables
const devices = []; // FIFO array to track connected devices
let currentUsage = 0; // Total power currently allocated

// Allocate power to all active devices
function allocatePower() {
    let availablePower = SAFE_CAPACITY;

    devices.forEach(device => {
        if (availablePower > 0) {
            const maxPower = Math.min(device.requestedPower, MAX_DEVICE_CAPACITY);
            device.allocatedPower = Math.min(maxPower, availablePower);
            availablePower -= device.allocatedPower;
        } else {
            device.allocatedPower = 0; // No power left to allocate
        }
    });

    // Update the total current usage
    currentUsage = devices.reduce((total, device) => total + device.allocatedPower, 0);
}

// Add a new device
function connectDevice(deviceId, requestedPower) {
    requestedPower = Math.min(requestedPower, MAX_DEVICE_CAPACITY);
    const newDevice = { id: deviceId, requestedPower, allocatedPower: 0 };
    devices.push(newDevice);
    allocatePower();
    console.log(`Device ${deviceId} connected with requested power ${requestedPower}.`);
    console.log("Devices:", devices);
}

// Remove a device
function disconnectDevice(deviceId) {
    const index = devices.findIndex(device => device.id === deviceId);
    if (index !== -1) {
        devices.splice(index, 1); // Remove the device from the list
        allocatePower();
        console.log(`Device ${deviceId} disconnected.`);
    } else {
        console.log(`Device ${deviceId} not found.`);
    }
    console.log("Devices:", devices);
}

// Update a device's power request
function updateDevice(deviceId, newRequestedPower) {
    const device = devices.find(device => device.id === deviceId);
    if (device) {
        device.requestedPower = Math.min(newRequestedPower, MAX_DEVICE_CAPACITY);
        allocatePower();
        console.log(`Device ${deviceId} updated with new request ${newRequestedPower}.`);
    } else {
        console.log(`Device ${deviceId} not found.`);
    }
    console.log("Devices:", devices);
}

// User interaction
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function menu() {
    console.log("\nPower Allocation System");
    console.log("1. Connect a new device");
    console.log("2. Disconnect a device");
    console.log("3. Update a device's power request");
    console.log("4. Exit");
    rl.question("Choose an option: ", handleUserInput);
}

function handleUserInput(option) {
    switch (option.trim()) {
        case "1":
            rl.question("Enter device ID: ", deviceId => {
                rl.question("Enter requested power: ", requestedPower => {
                    connectDevice(deviceId, parseInt(requestedPower, 10));
                    menu();
                });
            });
            break;
        case "2":
            rl.question("Enter device ID to disconnect: ", deviceId => {
                disconnectDevice(deviceId);
                menu();
            });
            break;
        case "3":
            rl.question("Enter device ID to update: ", deviceId => {
                rl.question("Enter new requested power: ", newRequestedPower => {
                    updateDevice(deviceId, parseInt(newRequestedPower, 10));
                    menu();
                });
            });
            break;
        case "4":
            console.log("Exiting...");
            rl.close();
            break;
        default:
            console.log("Invalid option. Try again.");
            menu();
            break;
    }
}

// Start the menu
menu();
