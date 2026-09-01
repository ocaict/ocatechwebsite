# OCATECH Digital Solutions — Official Website & AI Assistant

Welcome to the official web repository for **OCATECH Digital Solutions**, an ICT Training Center & Technology Solutions Hub located at **62 New Market Road, Onitsha North, Anambra State, Nigeria** (BN 9677251).

This website is designed for high speed, low-bandwidth mobile optimization, rich tech aesthetics, zero recurring hosting costs, and AI-powered visitor assistance.

---

## 🌟 Key Highlights

- **$0 / Zero Recurring Costs**: Runs 100% within the free tiers of Cloudflare Pages, Groq API, and Resend API indefinitely with no credit card required.
- **15 Practical Training Programmes**: Comprehensive filterable course catalog with syllabus breakdown and WhatsApp enrollment buttons.
- **AI Chatbot Powered by Groq**: Instant grounded answers using Llama 3.1 8B based strictly on real OCATECH business facts (pricing inquiries redirected to WhatsApp).
- **Direct Email Inquiries via Resend**: Inquiries submitted through the contact/apply form are delivered directly to `ocatechskill@gmail.com`.
- **Billboard Brand Alignment**: Custom modern dark theme using official brand colors (`#071125` Navy, `#012D96` Blue, `#FF0000` Red, `#FF6600` Orange).
- **Mobile-First & Accessible**: Seamlessly responsive across smartphones, tablets, and desktops.

---

## 📂 Project Structure

```
ocatech-website/
├── index.html                  # Homepage (Hero, Stats, Featured Courses, Methodology, ICT Services)
├── programmes.html             # Full 15-programme catalog with Category Filter & WhatsApp CTAs
├── services.html               # ICT Services (CCTV, Solar/Inverter, Software & OS Maintenance)
├── about.html                  # Profile, Vision, Mission, 6 Core Values, Training Philosophy
├── contact.html                # Interactive Inquiry/Application Form & Direct Contact Channels
├── 404.html                    # Custom branded error page
├── sitemap.xml                 # Search Engine Optimization sitemap
├── robots.txt                  # Search engine crawler directives
├── .gitignore                  # Git safety ignores (.env, cache)
├── .env.example                # Example environment secrets template
├── README.md                   # This non-technical maintenance guide
├── data/
│   ├── programmes.json         # Single source of truth for all 15 training programmes
│   └── business-info.json      # Structured business facts, location, contact, and services
├── functions/
│   └── api/
│       ├── chat.js             # Cloudflare Pages Function: Groq Llama 3.1 AI chatbot
│       └── contact.js          # Cloudflare Pages Function: Resend email dispatcher
└── assets/
    ├── css/
    │   └── styles.css          # Design system, CSS variables, layouts, animations, chatbot UI
    ├── js/
    │   ├── main.js             # Mobile nav drawer, active link state, category filter logic
    │   ├── chatbot.js          # Chatbot widget logic, suggested chips, markdown rendering
    │   └── contact-form.js     # Form validation, Resend API dispatcher, loading spinner
    └── images/
        ├── logo.svg            # Scalable SVG brand logo wordmark
        ├── logo-original.png   # Billboard logo asset
        ├── hero-placeholder.svg
        ├── service-cctv.svg
        ├── service-solar.svg
        └── service-software.svg
```

---

## 🚀 Step-by-Step Free Deployment on Cloudflare Pages

### Step 1: Push Code to GitHub
1. Create a free account at [GitHub.com](https://github.com) if you do not have one.
2. Create a new repository named `ocatech-website`.
3. Push the files in this folder to your GitHub repository.

---

### Step 2: Get Your Free Groq API Key (For AI Chatbot)
1. Visit **[console.groq.com](https://console.groq.com/)** and sign up for a free account.
2. Click **API Keys** on the left menu.
3. Click **Create API Key**, name it `OCATECH-Website`, and copy the key (it starts with `gsk_...`).
4. Keep this key safe.

---

### Step 3: Get Your Free Resend API Key (For Form Email Delivery)
1. Visit **[resend.com](https://resend.com/)** and create a free account (100 free emails per day).
2. Go to **API Keys** and click **Create API Key**.
3. Copy the key (it starts with `re_...`).

---

### Step 4: Connect GitHub to Cloudflare Pages
1. Sign up or log in to **[Cloudflare Dashboard](https://dash.cloudflare.com/)** (100% Free).
2. Go to **Workers & Pages** &rarr; click **Create Application** &rarr; select **Pages** &rarr; **Connect to Git**.
3. Select your GitHub account and choose the `ocatech-website` repository.
4. Set the build settings:
   - **Framework preset**: `None`
   - **Build command**: *(Leave blank)*
   - **Build output directory**: *(Leave blank or `/`)*
5. Click **Save and Deploy**. Cloudflare will deploy your website to a live URL like `https://ocatech-website.pages.dev`.

---

### Step 5: Add Secret Environment Variables in Cloudflare
To activate the Groq AI Chatbot and Email delivery securely:

1. In Cloudflare Dashboard, open your project **ocatech-website**.
2. Go to **Settings** &rarr; **Environment variables** &rarr; **Add variable**.
3. Add the following 3 variables for both **Production** and **Preview**:

| Variable Name | Value | Description |
|---|---|---|
| `GROQ_API_KEY` | `gsk_your_groq_api_key_here` | Free Groq API Key |
| `RESEND_API_KEY` | `re_your_resend_api_key_here` | Free Resend API Key |
| `CONTACT_EMAIL_TO` | `ocatechskill@gmail.com` | Business inbox to receive inquiries |

4. Click **Save**.
5. Trigger a new deployment (or push a commit) so the functions pick up the keys.

---

## 🛠️ How to Update Content (Non-Developer Friendly)

### 1. Adding or Editing a Training Programme
Open [`data/programmes.json`](data/programmes.json) directly on GitHub and edit or add an entry:
```json
{
  "id": "new-course-id",
  "name": "New Course Name",
  "category": "Web & Software Development",
  "categorySlug": "web-development",
  "tagColor": "green",
  "shortDescription": "Short summary...",
  "duration": "8 Weeks",
  "modules": ["Module 1", "Module 2"]
}
```
Both the website catalog and the AI chatbot will automatically reflect the update!

### 2. Updating Contact Numbers or Center Address
Open [`data/business-info.json`](data/business-info.json) and update the phone, WhatsApp, or address.

### 3. Replacing Placeholder Images with Real Photos
When you take real photos of the Onitsha training center, computer lab, or CCTV/solar installations:
1. Save your photos inside `assets/images/`.
2. Update the `src` attribute in the HTML files where you see comments like `<!-- PLACEHOLDER: replace with real photo -->`.

### 4. Activating Student Testimonials
When you collect real reviews from students:
1. Open [`about.html`](about.html).
2. Locate the `<section class="section testimonials-section">`.
3. Remove `style="display: none;"` and insert student names and quotes.

---

## 💻 Local Preview

To view the website locally on your computer:
1. Open a terminal in this folder.
2. Run a simple local web server:
   ```bash
   python -m http.server 8000
   ```
   *or with Node.js:*
   ```bash
   npx serve .
   ```
3. Open `http://localhost:8000` in your web browser.

---

## 📞 Support & Business Contact
- **OCATECH Digital Solutions**
- **Address**: 62 New Market Road, Onitsha North, Anambra State, Nigeria
- **Phone / WhatsApp**: 08165321429
- **Phone**: 07062620862
- **Email**: ocatechskill@gmail.com
