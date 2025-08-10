# 📂 Course Structurer

**Course Structurer** 🚀 instantly transforms YouTube video timestamps ⏱️ into a neatly structured project directory—perfect for organizing course content into code-ready folders 💻.

---

## ✨ Features

- 📝 **User Input & Configuration**  
  - Paste your course timestamps from YouTube.  
  - Customize the directory structure:  
    - 📁 Define section and topic folder naming conventions.  
    - 📄 Specify the number of files per topic (comma-separated).  

- 👀 **Preview & Export**  
  - Review the generated folder hierarchy before downloading.  
  - 📦 Export the entire directory structure in your preferred format.  

---

## 🚀 Getting Started

### 📋 Prerequisites
- 🌐 Modern web browser (Chrome, Firefox, Edge, Safari).  
- 📶 Internet connection for live deployments (e.g., Vercel).  

### 🛠️ Usage Steps
1. 🔗 Navigate to the app.  
2. ⌨️ Paste your YouTube course timestamps into the input field.  
3. ⚙️ Customize:  
   - 📂 Section folder format (e.g., `Section_{number}`).  
   - 📂 Topic folder format (e.g., `Topic_{number}`).  
   - ✍️ Add comma-separated number of files per topic.  
4. 🛠️ Click **Parse & Generate** to build the structure.  
5. 👁️ Preview the output.  
6. 📥 Download the complete directory as files or a ZIP.  

---

## 📂 Directory Structure Preview

```

Course-Structurer/
├── Section\_1/
│   ├── Topic\_1/
│   │   ├── file1.ext
│   │   └── file2.ext
│   └── Topic\_2/
│       ├── file1.ext
│       └── file2.ext
└── Section\_2/
├── Topic\_1/
│   ├── file1.ext
│   └── file2.ext
└── Topic\_2/
├── file1.ext
└── file2.ext

````

*(📌 Actual names and extensions adapt based on your configuration.)*

---

## ⚙️ Installation & Deployment

To self-host a local version:  

```bash
git clone https://github.com/yourusername/course-structurer.git
cd course-structurer
npm install      # or yarn install
npm run dev      # or yarn dev
````

Visit `http://localhost:3000` 🌍 to use the app.

Deploy (e.g., via Vercel):

```bash
vercel deploy
```

---

## 🛠️ Technologies Used

* 🎨 **Frontend**:

  * [React](https://reactjs.org/) ⚛️ for UI components.
  * State management (React Hooks/Context API).
  * CSS framework or custom styling.

* 🚀 **Build & Deployment**:

  * [Next.js](https://nextjs.org/) for SSR & routing.
  * Hosted on Vercel ☁️.

* 🧩 **Utilities**:

  * Form handling for parsing timestamps.
  * Logic to generate folder/file structure.
  * ZIP export with [JSZip](https://stuk.github.io/jszip/).

---

## 🤝 Contribution Guidelines

We welcome contributions ❤️!

1. 🍴 Fork the repository.
2. 🌱 Create a feature branch (`git checkout -b feature/xyz`).
3. 💬 Commit changes with clear messages.
4. 📬 Open a pull request.

---

## 📜 License

Licensed under the [MIT License](LICENSE) 📄.

---

## 📧 Contact

👨‍💻 Developed by **Fleming John**
💌 Questions or feedback? Reach out via GitHub Issues or email.

---

⭐ **If you like this project, please give it a star on GitHub!** ⭐

```

---

If you want, I can also **add badges and a screenshot section** so the README pops even more on GitHub. That would make it look like a premium open-source project.
```
