
import { openDB } from 'idb';

// Database version
const DB_VERSION = 1;
const DB_NAME = 'synjoint-db';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  picture?: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  author: string;
  authorId: string;
  date: string;
}

export interface CareerPost {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  date: string;
}

// Initialize the database
const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    console.log('Creating or upgrading database...');
    
    // Create users store
    if (!db.objectStoreNames.contains('users')) {
      const userStore = db.createObjectStore('users', { keyPath: 'id' });
      userStore.createIndex('email', 'email', { unique: true });
      console.log('Created users store');
    }
    
    // Create blogs store
    if (!db.objectStoreNames.contains('blogs')) {
      const blogStore = db.createObjectStore('blogs', { keyPath: 'id' });
      blogStore.createIndex('authorId', 'authorId');
      console.log('Created blogs store');
    }
    
    // Create careers store
    if (!db.objectStoreNames.contains('careers')) {
      db.createObjectStore('careers', { keyPath: 'id' });
      console.log('Created careers store');
    }
  }
});

// User management
export const userDB = {
  async getAll(): Promise<User[]> {
    return (await dbPromise).getAll('users');
  },
  
  async get(id: string): Promise<User | undefined> {
    return (await dbPromise).get('users', id);
  },
  
  async getByEmail(email: string): Promise<User | undefined> {
    const db = await dbPromise;
    const index = db.transaction('users').store.index('email');
    return index.get(email);
  },
  
  async add(user: User): Promise<string> {
    await (await dbPromise).put('users', user);
    return user.id;
  },
  
  async update(user: Partial<User> & { id: string }): Promise<void> {
    const db = await dbPromise;
    const tx = db.transaction('users', 'readwrite');
    const store = tx.store;
    
    const existingUser = await store.get(user.id);
    if (!existingUser) {
      throw new Error(`User with id ${user.id} not found`);
    }
    
    await store.put({
      ...existingUser,
      ...user
    });
    
    await tx.done;
  },
  
  async delete(id: string): Promise<void> {
    await (await dbPromise).delete('users', id);
  }
};

// Blog management
export const blogDB = {
  async getAll(): Promise<BlogPost[]> {
    return (await dbPromise).getAll('blogs');
  },
  
  async get(id: string): Promise<BlogPost | undefined> {
    return (await dbPromise).get('blogs', id);
  },
  
  async add(blog: BlogPost): Promise<string> {
    await (await dbPromise).put('blogs', blog);
    return blog.id;
  },
  
  async update(blog: Partial<BlogPost> & { id: string }): Promise<void> {
    const db = await dbPromise;
    const tx = db.transaction('blogs', 'readwrite');
    const store = tx.store;
    
    const existingBlog = await store.get(blog.id);
    if (!existingBlog) {
      throw new Error(`Blog with id ${blog.id} not found`);
    }
    
    await store.put({
      ...existingBlog,
      ...blog
    });
    
    await tx.done;
  },
  
  async delete(id: string): Promise<void> {
    await (await dbPromise).delete('blogs', id);
  },
  
  async getByAuthorId(authorId: string): Promise<BlogPost[]> {
    const db = await dbPromise;
    const tx = db.transaction('blogs');
    const index = tx.store.index('authorId');
    return index.getAll(authorId);
  }
};

// Career management
export const careerDB = {
  async getAll(): Promise<CareerPost[]> {
    return (await dbPromise).getAll('careers');
  },
  
  async get(id: string): Promise<CareerPost | undefined> {
    return (await dbPromise).get('careers', id);
  },
  
  async add(career: CareerPost): Promise<string> {
    await (await dbPromise).put('careers', career);
    return career.id;
  },
  
  async update(career: Partial<CareerPost> & { id: string }): Promise<void> {
    const db = await dbPromise;
    const tx = db.transaction('careers', 'readwrite');
    const store = tx.store;
    
    const existingCareer = await store.get(career.id);
    if (!existingCareer) {
      throw new Error(`Career with id ${career.id} not found`);
    }
    
    await store.put({
      ...existingCareer,
      ...career
    });
    
    await tx.done;
  },
  
  async delete(id: string): Promise<void> {
    await (await dbPromise).delete('careers', id);
  }
};

// Initialize database with some example data if needed
export const initializeDB = async () => {
  try {
    const db = await dbPromise;
    
    // Check if admin user exists
    const adminUser = await userDB.getByEmail('admin@synjoint.com');
    if (!adminUser) {
      console.log('Adding admin user');
      await userDB.add({
        id: '1',
        email: 'admin@synjoint.com',
        name: 'Admin User',
        role: 'admin',
        createdAt: new Date().toISOString()
      });
    }
    
    // Check if regular user exists
    const regularUser = await userDB.getByEmail('user@example.com');
    if (!regularUser) {
      console.log('Adding regular user');
      await userDB.add({
        id: '2',
        email: 'user@example.com',
        name: 'Regular User',
        role: 'user',
        createdAt: new Date().toISOString()
      });
    }
    
    // Check if blogs exist already
    const blogs = await db.getAll('blogs');
    if (blogs.length === 0) {
      // Add initial blogs
      console.log('Adding sample blog posts');
      const blogStore = db.transaction('blogs', 'readwrite').store;
      await blogStore.add({
        id: '1',
        title: 'The Future of Medical Technology',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod metus at risus tristique, sit amet luctus justo finibus.',
        imageUrl: '/lovable-uploads/cef8ce24-f36c-4060-8c3e-41ce14874770.png',
        author: 'Admin User',
        authorId: '1',
        date: '2023-05-15'
      });
      
      await blogStore.add({
        id: '2',
        title: 'Advancements in Joint Replacement',
        content: 'Nullam euismod metus at risus tristique, sit amet luctus justo finibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        imageUrl: '/lovable-uploads/67a5affa-62f9-4f9b-96c4-2f2b01963a4e.png',
        author: 'Admin User',
        authorId: '1',
        date: '2023-06-22'
      });
    }
    
    // Check if careers exist already
    const careers = await db.getAll('careers');
    if (careers.length === 0) {
      // Add initial careers
      console.log('Adding sample career posts');
      const careerStore = db.transaction('careers', 'readwrite').store;
      await careerStore.add({
        id: '1',
        title: 'R&D Engineer',
        description: 'Join our research and development team to design and develop innovative medical devices.',
        requirements: ['Bachelor\'s degree in Engineering', '3+ years of experience', 'Knowledge of medical device regulations'],
        location: 'Mumbai, India',
        date: '2023-07-10'
      });
      
      await careerStore.add({
        id: '2',
        title: 'Quality Assurance Specialist',
        description: 'Ensure our products meet the highest quality standards and regulatory requirements.',
        requirements: ['Bachelor\'s degree in related field', '2+ years in quality assurance', 'Experience with ISO standards'],
        location: 'Bangalore, India',
        date: '2023-07-15'
      });
    }
    
    console.log('Database initialization complete');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};
