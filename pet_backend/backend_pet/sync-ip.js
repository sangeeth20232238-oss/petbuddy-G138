const os = require('os');
const fs = require('fs');
const path = require('path');

function getIPAddress() {
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return '127.0.0.1';
}

const currentIP = getIPAddress();
const frontendConfigPath = path.resolve(__dirname, '../../../../Documents/petbuddy-G138/src/config/api.ts');

// Check if file exists before trying to write
if (fs.existsSync(frontendConfigPath)) {
    let content = fs.readFileSync(frontendConfigPath, 'utf8');
    const updatedContent = content.replace(/const PC_IP = '.*';/, `const PC_IP = '${currentIP}';`);

    if (content !== updatedContent) {
        fs.writeFileSync(frontendConfigPath, updatedContent);
        console.log(`\x1b[32m[IP Sync]\x1b[0m Updated Frontend IP to: \x1b[36m${currentIP}\x1b[0m`);
    } else {
        console.log(`\x1b[32m[IP Sync]\x1b[0m Frontend IP is already up to date: \x1b[36m${currentIP}\x1b[0m`);
    }
} else {
    console.log(`\x1b[31m[IP Sync]\x1b[0m Could not find frontend config at: ${frontendConfigPath}`);
}
