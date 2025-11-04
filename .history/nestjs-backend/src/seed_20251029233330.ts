import { connect, connection, model } from 'mongoose';
import { ProductSchema } from './schemas/products.schemas';

async function seed() {
  try {
    await connect('mongodb://localhost:27017/your_database_name');

    const Product = model('Product', ProductSchema, 'products');

    const products = [
      {
        name: "Embroidery Charm",
        brand: "Zarmeena",
        price: 9800,
        description: "A gracefully embroidered lawn suit with intricate threadwork and subtle lace detailing — perfect for festive days.",
        images: [
          "https://example.com/images/embroidery1.jpg",
          "https://example.com/images/embroidery2.jpg",
          "https://example.com/images/embroidery3.jpg"
        ],
        stock: 10,
        featured: true,
      },
      {
        name: "Paisley Elegance",
        brand: "Zarmeena",
        price: 11200,
        description: "Inspired by timeless paisley motifs, this cotton set blends tradition with a hint of modern flair.",
        images: [
          "https://example.com/images/paisley1.jpg",
          "https://example.com/images/paisley2.jpg",
          "https://example.com/images/paisley3.jpg"
        ],
        stock: 8,
        featured: true,
      },
      {
        name: "Pastel Dream",
        brand: "Zarmeena",
        price: 8700,
        description: "A pastel-toned chiffon outfit that radiates softness — ideal for daytime grace and summer elegance.",
        images: [
          "https://example.com/images/pastel1.jpg",
          "https://example.com/images/pastel2.jpg",
          "https://example.com/images/pastel3.jpg"
        ],
        stock: 15,
        featured: false,
      },
      {
        name: "Rosey Ensemble",
        brand: "Zarmeena",
        price: 9500,
        description: "An enchanting rose-pink organza suit with floral embroidery and shimmering embellishments.",
        images: [
          "https://example.com/images/rosey1.jpg",
          "https://example.com/images/rosey2.jpg",
          "https://example.com/images/rosey3.jpg"
        ],
        stock: 12,
        featured: true,
      },
      {
        name: "Ruby Elegance",
        brand: "Zarmeena",
        price: 13800,
        description: "A deep ruby silk outfit exuding sophistication, paired with a delicately detailed dupatta for festive evenings.",
        images: [
          "https://example.com/images/ruby1.jpg",
          "https://example.com/images/ruby2.jpg",
          "https://example.com/images/ruby3.jpg"
        ],
        stock: 6,
        featured: true,
      },
      {
        name: "Violet Dream",
        brand: "Zarmeena",
        price: 10200,
        description: "Soft violet hues on chiffon fabric, featuring intricate zari and sequence work — dreamy and refined.",
        images: [
          "https://example.com/images/violet1.jpg",
          "https://example.com/images/violet2.jpg",
          "https://example.com/images/violet3.jpg"
        ],
        stock: 9,
        featured: false,
      },
      {
        name: "Formal Portrait",
        brand: "Zarmeena",
        price: 15900,
        description: "A luxurious velvet three-piece ensemble perfect for formal occasions — classic craftsmanship meets modern tailoring.",
        images: [
          "https://example.com/images/formal1.jpg",
          "https://example.com/images/formal2.jpg",
          "https://example.com/images/formal3.jpg"
        ],
        stock: 5,
        featured: true,
      },
      {
        name: "Sunshine Chic",
        brand: "Zarmeena",
        price: 7800,
        description: "Bright yellow cotton outfit with mirror-work accents — a cheerful addition to your daytime wardrobe.",
        images: [
          "https://example.com/images/sunshine1.jpg",
          "https://example.com/images/sunshine2.jpg",
          "https://example.com/images/sunshine3.jpg"
        ],
        stock: 18,
        featured: false,
      },
      {
        name: "Midnight Elegance",
        brand: "Zarmeena",
        price: 16800,
        description: "An exquisite navy-blue silk attire, hand-embroidered with golden motifs — perfect for a touch of evening glamour.",
        images: [
          "https://example.com/images/midnight1.jpg",
          "https://example.com/images/midnight2.jpg",
          "https://example.com/images/midnight3.jpg"
        ],
        stock: 7,
        featured: true,
      },
    ];

    await Product.deleteMany({});
    await Product.insertMany(products);

    console.log("✅ 9 Zarmeena products inserted successfully with 3 images each!");
    connection.close();
  } catch (error) {
    console.error("❌ Error inserting products:", error);
    connection.close();
  }
}

seed();
