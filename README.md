# Resume Builder

This is a resume builder application built with Vite, React, Firebase, and Tailwind CSS.

## Features

- User authentication using Firebase
- Create and edit resumes
- Generate PDF resumes
- Responsive UI design using Tailwind CSS

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/CodexParas/resume-builder.git
   ```

2. Install dependencies:

   ```bash
   cd resume-builder
   npm install
   ```

3. Set up Firebase:

   - Create a new Firebase project
   - Enable Authentication and Firestore in the Firebase console
   - Copy your Firebase project configuration and place them in `.env` as

   ```VITE_API_KEY=your-api-key
   VITE_AUTH_DOMAIN=your-auth-domain
   VITE_PROJECT_ID=your-project-id
   VITE_STORAGE_BUCKET=your-storage-bucket
   VITE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_APP_ID=your-app-id
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5173` to see the app.

## Usage

- Sign up or log in to create an account.
- Create a new resume by filling in the required information.
- Edit or delete existing resumes.
- Generate a PDF version of your resume.

## Contributing

Contributions are welcome! If you have any suggestions or improvements, please create a pull request.
