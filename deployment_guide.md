# Free Production Deployment Guide 🚀

To get the full PHP + MySQL architecture of **Jamdade Borewells** live on the internet so judges or clients can interact with it, you will need a host that supports databases natively.

Here is the fastest, free method using **InfinityFree** (a highly reliable free cPanel host).

## Step 1: Create a Free Hosting Account
1. Go to [InfinityFree.com](https://infinityfree.com/?source=jamdade-borewells-deployment) and sign up for a free account.
2. Once logged in, click **Create Account / New Hosting Account**.
3. Choose a free subdomain name that sounds professional, e.g., `jamdade-borewells.epizy.com` or `jamdade-drilling.infinityfreeapp.com`.
4. Click **Create** to initialize your server.

## Step 2: Set Up the Remote MySQL Database
Your XAMPP database won't automatically transfer to the cloud. We need to create it on their server.
1. Inside your new InfinityFree dashboard, click the **"Control Panel"** button (this opens cPanel).
2. Scroll down to the **"Databases"** section and click on **MySQL Databases**.
3. Create a new database name. It will automatically be prefixed with your username (e.g., `epiz_349281_jamdade`).
4. **Copy down the absolute credentials they display:**
   - Database Name *(e.g. epiz_349281_jamdade)*
   - MySQL Username *(e.g. epiz_349281)*
   - MySQL Password *(Look this up under Account Details)*
   - MySQL Hostname *(e.g. sql108.epizy.com)*

## Step 3: Update `config.php` for Production
Before uploading, you must tell the code how to access this new live cloud database.
Open `api/config.php` locally on your computer and edit these variables using the exact credentials from Step 2:

```php
$host = 'sql108.epizy.com';       // REPLACE THIS
$dbname = 'epiz_349281_jamdade';  // REPLACE THIS
$username = 'epiz_349281';        // REPLACE THIS
$password = 'your_host_password'; // REPLACE THIS
```

## Step 4: Upload the Code to the Internet
1. Go back to your InfinityFree dashboard and click **"File Manager"**.
2. Double-click the yellow folder named **`htdocs`**. *(Warning: Do not upload files outside of this folder!)*
3. Delete any default holding pages (like `index2.html`).
4. **Upload** all the files from your local Jamdade Borewells folder directly into this `htdocs` directory. Include the modified `api/config.php`.

## Step 5: Execute Database Tables Setup
Once all files reach 100% upload completion:
1. Open your internet browser (Chrome/Edge/Safari).
2. Go to your live website URL and point it at the setup script:
   👉 `http://your-chosen-domain.com/api/setup_db.php`
3. You will see **"🎉 Setup Complete!"** printed on the screen. The tables for Admins, Invoices, and Bookings have just been successfully constructed on your cloud host.

## Step 6: Test!
Your website is now universally accessible. 
Navigate to `http://your-chosen-domain.com` and test the booking form and AI chatbot on your mobile phone to verify the live API connects securely to the cloud!
