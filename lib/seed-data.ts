import { collection, addDoc, getDocs, query } from 'firebase/firestore';
import { db } from './firebase';

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  itemCount: number;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  calories: number;
  protein: string;
  image: string;
  category: string;
}

const categories: Omit<Category, 'id'>[] = [
  {
    name: 'Pre-Workout',
    description: 'Energy boosting meals to fuel your training',
    icon: 'zap',
    itemCount: 15
  },
  {
    name: 'Post-Workout',
    description: 'Recovery meals rich in protein and nutrients',
    icon: 'activity',
    itemCount: 22
  },
  {
    name: 'Heart Healthy',
    description: 'Cardiovascular wellness focused nutrition',
    icon: 'heart',
    itemCount: 18
  },
  {
    name: 'Weight Management',
    description: 'Balanced meals for your fitness goals',
    icon: 'target',
    itemCount: 25
  }
];

const foodItems: Omit<FoodItem, 'id'>[] = [
  {
    name: 'Grilled Chicken Quinoa Bowl',
    description: 'Lean protein with complete amino acids, quinoa, and steamed broccoli. Perfect post-workout meal.',
    price: 12.99,
    calories: 450,
    protein: '35g',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Post-Workout'
  },
  {
    name: 'Salmon Sweet Potato Power',
    description: 'Omega-3 rich salmon with roasted sweet potato and mixed greens. Great for muscle recovery.',
    price: 15.99,
    calories: 520,
    protein: '32g',
    image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Post-Workout'
  },
  {
    name: 'Protein Power Smoothie Bowl',
    description: 'Plant-based protein blend with berries, nuts, and seeds. Ideal pre or post-workout fuel.',
    price: 9.99,
    calories: 380,
    protein: '25g',
    image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Pre-Workout'
  },
  {
    name: 'Turkey Avocado Wrap',
    description: 'Whole grain wrap with lean turkey, avocado, and fresh vegetables.',
    price: 8.99,
    calories: 420,
    protein: '30g',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Weight Management'
  },
  {
    name: 'Greek Yogurt Parfait',
    description: 'High-protein Greek yogurt with fresh berries and granola.',
    price: 6.99,
    calories: 280,
    protein: '20g',
    image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Heart Healthy'
  },
  {
    name: 'Tuna Poke Bowl',
    description: 'Fresh tuna with brown rice, edamame, and vegetables.',
    price: 13.99,
    calories: 420,
    protein: '30g',
    image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Heart Healthy'
  },
  {
    name: 'Chicken Salad',
    description: 'Fresh chicken with lettuce, tomatoes, and cucumbers.',
    price: 10.99,
    calories: 320,
    protein: '30g',
    image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Heart Healthy'
  },
  {
    name: 'Oatmeal Banana Energy Bowl',
    description: 'Steel-cut oats with banana, chia seeds, and almond butter. Slow-release carbs for pre-workout energy.',
    price: 7.99,
    calories: 350,
    protein: '12g',
    image: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Pre-Workout'
  },
  {
    name: 'Egg White Veggie Scramble',
    description: 'Egg whites scrambled with spinach, tomatoes, and peppers. Low-calorie, high-protein breakfast.',
    price: 8.49,
    calories: 210,
    protein: '22g',
    image: 'https://images.pexels.com/photos/5938/food-healthy-breakfast-egg.jpg?auto=compress&cs=tinysrgb&w=400',
    category: 'Weight Management'
  },
  {
    name: 'Quinoa Black Bean Salad',
    description: 'Quinoa, black beans, corn, and avocado tossed in a lime vinaigrette. Plant-based and filling.',
    price: 9.49,
    calories: 390,
    protein: '16g',
    image: 'https://images.pexels.com/photos/1640775/pexels-photo-1640775.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Heart Healthy'
  },
  {
    name: 'Beef & Broccoli Stir Fry',
    description: 'Lean beef strips with broccoli and bell peppers in a light soy-ginger sauce. Served with brown rice.',
    price: 13.49,
    calories: 480,
    protein: '36g',
    image: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Post-Workout'
  },
  {
    name: 'Avocado Toast with Poached Egg',
    description: 'Whole grain toast topped with smashed avocado and a poached egg. Simple, healthy, and delicious.',
    price: 7.49,
    calories: 320,
    protein: '14g',
    image: 'https://images.pexels.com/photos/1640776/pexels-photo-1640776.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Pre-Workout'
  },
  {
    name: 'Lentil & Spinach Soup',
    description: 'Hearty lentil soup with spinach, carrots, and celery. High in fiber and protein.',
    price: 8.99,
    calories: 260,
    protein: '18g',
    image: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Heart Healthy'
  },
  {
    name: 'Shrimp Brown Rice Bowl',
    description: 'Grilled shrimp with brown rice, edamame, and sesame seeds. Light and protein-rich.',
    price: 14.49,
    calories: 410,
    protein: '28g',
    image: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Weight Management'
  },
  {
    name: 'Berry Beet Pre-Workout Juice',
    description: 'Fresh beet, berry, and orange juice blend. Boosts nitric oxide for better workouts.',
    price: 5.99,
    calories: 120,
    protein: '2g',
    image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Pre-Workout'
  },
  {
    name: 'Chickpea & Kale Power Bowl',
    description: 'Roasted chickpeas, kale, sweet potato, and tahini dressing. Vegan and nutrient-dense.',
    price: 10.49,
    calories: 410,
    protein: '17g',
    image: 'https://images.pexels.com/photos/1640775/pexels-photo-1640775.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Weight Management'
  },
  {
    name: 'Cottage Cheese Fruit Plate',
    description: 'Low-fat cottage cheese with pineapple, berries, and melon. Light and refreshing.',
    price: 6.49,
    calories: 220,
    protein: '19g',
    image: 'https://images.pexels.com/photos/1640776/pexels-photo-1640776.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Heart Healthy'
  },
  {
    name: 'Tofu Stir Fry',
    description: 'Tofu cubes stir-fried with broccoli, carrots, and snap peas in a ginger garlic sauce.',
    price: 9.99,
    calories: 340,
    protein: '21g',
    image: 'https://images.pexels.com/photos/1640775/pexels-photo-1640775.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Weight Management'
  },
  {
    name: 'Almond Butter Banana Wrap',
    description: 'Whole wheat wrap with almond butter, banana, and a sprinkle of chia seeds.',
    price: 7.49,
    calories: 310,
    protein: '10g',
    image: 'https://images.pexels.com/photos/1640776/pexels-photo-1640776.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Pre-Workout'
  },
  {
    name: 'Baked Cod with Asparagus',
    description: 'Oven-baked cod fillet with lemon, served with steamed asparagus and brown rice.',
    price: 13.99,
    calories: 370,
    protein: '34g',
    image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Heart Healthy'
  },
  
];

export async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Check if categories already exist
    const categoriesQuery = query(collection(db, 'categories'));
    const categoriesSnapshot = await getDocs(categoriesQuery);
    
    if (categoriesSnapshot.empty) {
      console.log('Adding categories to database...');
      // Add categories
      for (const category of categories) {
        await addDoc(collection(db, 'categories'), category);
      }
      console.log('Categories initialized successfully');
    } else {
      console.log('Categories already exist in database');
    }

    // Check if food items already exist
    const foodItemsQuery = query(collection(db, 'foodItems'));
    const foodItemsSnapshot = await getDocs(foodItemsQuery);
    
    if (foodItemsSnapshot.empty) {
      console.log('Adding food items to database...');
      // Add food items
      for (const item of foodItems) {
        await addDoc(collection(db, 'foodItems'), item);
      }
      console.log('Food items initialized successfully');
    } else {
      console.log('Food items already exist in database');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    // Type narrowing for error
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
      });
    } else if (typeof error === 'object' && error !== null && 'code' in error) {
      console.error('Error details:', {
        code: (error as any).code,
        message: (error as any).message,
        stack: (error as any).stack,
      });
    } else {
      console.error('Unknown error type:', error);
    }
    throw error; // Re-throw to let calling code handle it
  }
}