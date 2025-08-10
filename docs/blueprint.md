# **App Name**: Course Structurer

## Core Features:

- URL Input: Accept a YouTube course URL as input.
- Timestamp Parsing: Accept and parse timestamp text, extracting section and topic titles.
- Timestamp Auto-Fetch: Use a tool that tries to automatically fetch timestamps from YouTube videos if the videoId is available from parsing the given YouTube URL.
- Directory Generation: Generate a directory structure based on the parsed sections and topics.
- File Creation: Create files for each topic inside its respective section folder, using the topic title as the filename, including generating index.js and styles.css files in project subfolders. Allow a user to specify what the template file structure and file name conventions should be.
- Script Generation: Generate bash and CMD scripts to recreate the directory structure.
- ZIP Packaging: Package the generated structure and scripts into a downloadable ZIP file.

## Style Guidelines:

- Primary color: A vibrant green (#4F772D) to represent structure and clarity.
- Background color: A dark gray (#333333), close in hue to the green, for a clean, unobtrusive backdrop.
- Accent color: White (#FFFFFF) to highlight key actions and interactive elements.
- Font pairing: Use 'Space Grotesk' (sans-serif) for headings to provide a tech-forward feel, paired with 'Inter' (sans-serif) for body text to maintain readability.
- Use simple, clear icons to represent actions like downloading and parsing, focused on user-friendliness.
- Emphasize a clear, linear layout to reflect the structured nature of the application. Organize inputs and outputs logically.
- Use subtle animations, such as smooth transitions, when parsing is complete or the ZIP file is ready for download to give some user feedback.
- Use soft rounded corners (20px radius) with a clean elevated card style, and apply a subtle drop shadow (0 4px 12px rgba(0,0,0,0.1)) for a modern minimal look.
- Add a loading animation while fetching timestamps or generating the directory structure to provide visual feedback to the user.