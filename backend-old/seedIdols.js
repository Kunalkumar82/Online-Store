const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const sampleIdols = [
  {
    productId: "BRS-GAN-001",
    name: "Golden Brass Ganesha",
    category: "Ganesha",
    price: 4500,
    stockQuantity: 25,
    description: "Finely handcrafted brass Ganesha idol, perfect for home temples or gifting.",
    material: "Brass",
    size: "8x5 inches",
    views: 120,
    images: ["/uploads/sample-ganesha.jpg"] // Assuming the frontend handles missing files gracefully, or we just rely on the fallback package icon
  },
  {
    productId: "MBL-SAR-002",
    name: "Pure White Marble Saraswati",
    category: "Saraswati",
    price: 8500,
    stockQuantity: 5,
    description: "Elegant white marble Saraswati idol with detailed carving on the veena.",
    material: "Marble",
    size: "12x7 inches",
    views: 310,
    images: []
  },
  {
    productId: "PLR-KRI-003",
    name: "Bal Krishna Makhan Chor",
    category: "Krishna",
    price: 2200,
    stockQuantity: 0,
    description: "Beautifully painted polyresin Bal Krishna eating butter.",
    material: "Polyresin",
    size: "6x5 inches",
    views: 45,
    images: []
  },
  {
    productId: "BRS-SHV-004",
    name: "Antique Finish Shiva Lingam",
    category: "Shiva",
    price: 1800,
    stockQuantity: 50,
    description: "Heavy antique finish brass Shiva Lingam for daily abhishek.",
    material: "Brass",
    size: "4x4 inches",
    views: 88,
    images: []
  },
  {
    productId: "BRZ-HAN-005",
    name: "Panchamukhi Hanuman",
    category: "Hanuman",
    price: 3600,
    stockQuantity: 8,
    description: "Rare five-faced Hanuman idol, renowned for protection and strength.",
    material: "Bronze Finish",
    size: "10x6 inches",
    views: 205,
    images: []
  }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/divine_idol_store');
        console.log('MongoDB connected for seeding...');

        // Clear existing to avoid duplicate name clutter (optional, but let's just insert to be safe, maybe don't clear so we don't delete what they have)
        // await Product.deleteMany({});
        
        await Product.insertMany(sampleIdols);
        console.log('Data Imported successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error with seeding: ${error.message}`);
        process.exit(1);
    }
}

seedDB();
