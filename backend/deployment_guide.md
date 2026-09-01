# EC2 Deployment Guide: Skinify Backend

This guide outlines the step-by-step process of deploying the Node.js backend server onto an AWS EC2 instance running **Ubuntu Server (LTS)** without Docker. 

Because the backend utilizes **Puppeteer** for page scraping, the instance will require headless Chromium dependencies and appropriate resource sizing.

---

## 1. Recommend EC2 Instance Sizing & Security Groups

### Instance Sizing
* **Recommended**: `t3.small` (2 vCPUs, 2 GB RAM) or `t3.medium` (2 vCPUs, 4 GB RAM).
* **Why?** Puppeteer launches headless browser instances to scrape websites. This is CPU and memory-intensive. 
* **Note on `t3.micro` (1 GB RAM)**: If you must use `t3.micro` for testing or free tier, you **must configure swap space** (see step 3) to prevent the OS from killing the Node process when a browser launches.

### Security Group Rules
Create a security group and allow:
1. **SSH (Port 22)**: Restricted to your IP or IP range.
2. **HTTP (Port 80)**: Accessible from anywhere (`0.0.0.0/0`).
3. **HTTPS (Port 443)**: Accessible from anywhere (`0.0.0.0/0`).
4. *(Optional)* **Port 3001**: Only if you want to query the backend directly without Nginx, though Nginx proxying is highly recommended.

---

## 2. Connect and Update the OS

SSH into your EC2 instance:
```bash
ssh -i /path/to/your-key.pem ubuntu@your-ec2-ip
```

Once logged in, update your system packages:
```bash
sudo apt update && sudo apt upgrade -y
```

---

## 3. Configure Swap Space (Crucial for 1GB/2GB instances)

If your instance has 1GB or 2GB of RAM, add 2GB of Swap space to handle Puppeteer memory spikes:
```bash
# Create a 2GB swap file
sudo fallocate -l 2G /swapfile

# Set correct permissions
sudo chmod 600 /swapfile

# Format it as swap space
sudo mkswap /swapfile

# Enable the swap file
sudo swapon /swapfile

# Make the swap file permanent across reboots
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verify swap is active
free -h
```

---

## 4. Install Node.js (v20)

Install Node.js v20 LTS via the NodeSource official repository:
```bash
# Download and import the NodeSource GPG key and repository script
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js and npm
sudo apt-get install -y nodejs

# Verify the installations
node -v
npm -v
```

---

## 5. Install Headless Chromium System Dependencies

Puppeteer downloads its own Chrome executable during installation, but it relies on several shared Linux system libraries to run headlessly.

### Manual Installation
If Option A fails or if you want to install them manually, run the following command. 

*Note: For Ubuntu 24.04+ (or Resolute), run this command which uses `libasound2t64` instead of `libasound2`:*
```bash
sudo apt-get update && sudo apt-get install -y \
  ca-certificates \
  fonts-liberation \
  libasound2t64 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgbm1 \
  libgcc1 \
  libgconf-2-4 \
  libgdk-pixbuf2.0-0 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libpango-1.0-0 \
  libpangocairo-1-0 \
  libstdc++6 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  lsb-release \
  xdg-utils \
  wget
```

*(If you are on an older Ubuntu version like 22.04, replace `libasound2t64` with `libasound2` in the command above).*

---


## 6. Clone the Code and Install Packages

1. Clone your project code onto the EC2 instance:
   ```bash
   git clone https://github.com/vixxk/Skinify_Frontend_Cloner.git
   cd Skinify_Frontend_Cloner/backend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
   > [!NOTE]
   > The `postinstall` script inside `package.json` will automatically trigger Puppeteer to download the local Chrome browser binaries into your `node_modules` structure.

---

## 7. Setup Environment Variables

Create the `.env` file in the `backend` folder:
```bash
nano .env
```

Paste your production configurations (adjust API keys and model options as needed):
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key
FIREWORKS_API_KEY=your_fireworks_api_key
FIREWORKS_MODEL=accounts/fireworks/models/deepseek-v4-pro
```
*Press `Ctrl+O` then `Enter` to save, and `Ctrl+X` to exit nano.*

---

## 8. Run the App in the Background with PM2

To keep the application running persistently in the background and restart it automatically if it crashes or the server reboots:

1. Install PM2 globally:
   ```bash
   sudo npm install -g pm2
   ```
2. Start your backend application:
   ```bash
   pm2 start server.js --name "skinify-backend"
   ```
3. Save the active process list:
   ```bash
   pm2 save
   ```
4. Set up PM2 to automatically startup on system reboot:
   ```bash
   pm2 startup
   ```
   *This command will output a configuration block starting with `sudo env PATH=...`. Copy and paste that exact line into your terminal to enable the startup daemon script.*

---

## 9. Configure Nginx as a Reverse Proxy with a Free sslip.io Domain

If you do not have a purchased domain name, you can use **sslip.io** for a free wildcard domain that maps automatically to your EC2 public IP address. For example, if your public IP is `54.210.23.45`, your free domain will be:
`54.210.23.45.sslip.io`

There is no sign-up or configuration required on any website. Any hostname ending with `[IP].sslip.io` resolves automatically to that `[IP]`.

Instead of exposing port `3001` directly to the web, configure Nginx to receive requests on port `80` (HTTP) and proxy them to the backend:

1. Install Nginx:
   ```bash
   sudo apt install nginx -y
   ```
2. Create/edit Nginx server configuration:
   ```bash
   sudo nano /etc/nginx/sites-available/skinify-backend
   ```
3. Paste the following configuration (replace `YOUR_EC2_PUBLIC_IP` with your actual EC2 public IP, e.g. `54.210.23.45.sslip.io`):
   ```nginx
   server {
       listen 80;
       server_name YOUR_EC2_PUBLIC_IP.sslip.io; # e.g. 54.210.23.45.sslip.io

       location / {
           proxy_pass http://127.0.0.1:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
4. Enable the new site configuration:
   ```bash
   sudo ln -s /etc/nginx/sites-available/skinify-backend /etc/nginx/sites-enabled/
   ```
5. Remove the default Nginx site configuration link:
   ```bash
   sudo rm /etc/nginx/sites-enabled/default
   ```
6. Test your Nginx configuration syntax:
   ```bash
   sudo nginx -t
   ```
7. Restart Nginx to apply changes:
   ```bash
   sudo systemctl restart nginx
   ```

---

## 10. Enable SSL (HTTPS) with Let's Encrypt Certbot & sslip.io

Since `sslip.io` provides a valid DNS resolution to your EC2 IP, Let's Encrypt can issue a fully functional SSL certificate for it completely free:

1. Install Certbot and the Nginx plugin:
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   ```
2. Run Certbot to acquire the certificate and automatically configure Nginx:
   ```bash
   sudo certbot --nginx -d YOUR_EC2_PUBLIC_IP.sslip.io
   ```
3. Follow the interactive prompts (provide your email, agree to the terms, etc.). Once successful, Certbot will automatically rewrite the Nginx configuration to support secure HTTPS requests.


---

## Useful Maintenance Commands

* **View application logs**: `pm2 logs skinify-backend`
* **Restart backend application**: `pm2 restart skinify-backend`
* **Stop backend application**: `pm2 stop skinify-backend`
* **View running processes**: `pm2 list`
* **Check Node CPU/RAM load**: `pm2 monit`

---

## 11. Troubleshooting Common Errors

### Error 1: `ENOSPC: no space left on device` during `npm install`
This occurs when the EC2 disk drive runs out of free space (common on default 8GB EBS volumes during Puppeteer Chrome binary download).

**Solutions:**
1. **Clean up disk space & npm cache:**
   ```bash
   sudo apt clean
   sudo apt autoremove -y
   sudo rm -rf ~/.npm /tmp/*
   ```
2. **Install dependencies skipping Puppeteer binary download:**
   ```bash
   PUPPETEER_SKIP_DOWNLOAD=true npm install
   ```
   *Then install Chrome browser separately if needed using `sudo npx puppeteer browsers install chrome --install-deps`.*
3. **Expand EBS Volume (if instance is out of space):**
   Check disk usage with `df -h`. If root volume is 100% full, increase volume size in AWS Console (EC2 -> Volumes -> Modify Volume to e.g. 20GB), then extend the partition on EC2:
   ```bash
   # For nvme root partition (e.g. Ubuntu t3 instances)
   sudo growpart /dev/nvme0n1 1
   sudo resize2fs /dev/nvme0n1p1
   ```

---

### Error 2: `[ Directory '/etc/nginx/sites-available' does not exist ]`
This occurs when trying to edit Nginx configuration before Nginx is installed on the EC2 instance.

**Solution:**
Ensure Nginx is installed first before running `nano`:
```bash
sudo apt update && sudo apt install -y nginx
```
After Nginx is installed, `/etc/nginx/sites-available` will be created automatically, and you can proceed with:
```bash
sudo nano /etc/nginx/sites-available/skinify-backend
```

