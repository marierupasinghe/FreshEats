# FreshEats WebApp

FreshEats is a nutrition-focused food ordering app designed for fitness enthusiasts. It provides a curated menu of healthy meals categorized by workout needs and health goals.

## Features

- **Curated Categories:** Meals organized into Pre-Workout, Post-Workout, Heart Healthy, and Weight Management.
- **Nutritional Details:** Each food item includes calories, protein, and other key nutrition info.
- **Firebase Integration:** Uses Firebase Firestore for storing categories and food items.
- **Easy Seeding:** Includes a script to initialize the database with sample categories and food items.

## Getting Started

1. **Clone the repository:**
   ```
   git clone https://github.com/yourusername/fresh.git
   cd fresh
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Set up Firebase:**
   - Create a Firebase project.
   - Add your Firebase config to `lib/firebase.ts`.

4. **Seed the database:**
   ```
   npm run seed
   ```
   This will populate Firestore with sample categories and food items.

5. **Run the app:**
   ```
   npm run dev
   ```

## Project Structure

- `lib/seed-data.ts` - Contains sample data and the database initialization script.
- `lib/firebase.ts` - Firebase configuration.
- `pages/` - Next.js pages.

## License

MIT

## Acknowledgements

- Food images from [Pexels](https://pexels.com).
- Built with [Next.js](https://nextjs.org/) and [Firebase](https://firebase.google.com/).