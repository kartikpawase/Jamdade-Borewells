# Jamdade Borewells SaaS Platform 💧

A premium, state-of-the-art Borewell Management System built with a highly responsive, glassmorphic UI and a robust PHP/MySQL backend architecture. Designed to function as a professional business tool for booking drilling services, estimating costs, and generating dynamic GST invoices.

## 🌟 Key Features
* **Premium Apple/Tesla-Style UI:** Glassmorphism, tailored typography, dark mode scaling, and smooth GSAP-driven micro-animations.
* **Smart Booking System:** Dynamic cost calculators based on input drilling depth.
* **Interactive AI Chatbot:** Customer assistance widget with animated reply logic built directly into the UI.
* **RESTful PHP APIs:** Secure, asynchronous `fetch()` API operations for seamless interactions without reloading pages.
* **Admin Ecosystem:** Secure login with hashed passwords and a dashboard featuring real-time statistical readouts natively fetched from the MySQL database.
* **Database Tracking:** All bookings and generated bills are stored permanently into an automated relational database.

## 🛠️ Tech Stack
* **Frontend:** HTML5, Tailwind CSS, Javascript, Chart.js, Phosphor Icons.
* **Backend:** PHP 8.x, PDO API.
* **Database:** MySQL.
* **Animations:** GSAP.

## 🚀 Setup & Installation (Local Development)

Because this application relies on a server-sided language (PHP), you cannot run it by simply double-clicking the `.html` files. Follow these steps to host it via a local development environment.

1. **Install XAMPP** or **MAMP** on your local machine.
2. Clone this repository directly into your local `htdocs` or `/www/` server root folder:
   ```bash
   git clone https://github.com/kartikpawase/jamdade-borewells.git
   ```
3. Start both the **Apache** server and **MySQL** database in your XAMPP control panel.
4. **Initialize the Database:** Open your browser and run the automatic setup script located at:
   ```
   http://localhost/jamdade-borewells/api/setup_db.php
   ```
   *You should see a "Setup Complete" message.*
5. Navigate to your landing page at `http://localhost/jamdade-borewells/index.html`.

### 🔑 Default Admin Login
Once the database is executed, a default administrative account is generated.
* **Username:** admin
* **Password:** password123

> Note: Make sure to change these credentials before migrating to a production environment.

## 🌍 Production Deployment
To deploy this project to the public internet, it **is not recommended** to use static hosting providers like Vercel or Netlify. Because this is a dynamic full-stack architecture, it requires a host with explicit PHP and MySQL support (e.g., Hostinger, GoDaddy, cPanel, or a digital VPS).

1. Upload the files to the `public_html` directory of your host.
2. Set up a new MySQL Database in your cPanel.
3. Update `api/config.php` with the new live database Username, Password, and Database Name.
4. Run the setup script again on your live URL to initialize the tables.

---
*Built autonomously using cutting-edge Agentic AI Architecture.*
