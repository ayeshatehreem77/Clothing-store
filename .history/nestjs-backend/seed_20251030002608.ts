import { connect, connection, model } from 'mongoose';
import { ProductSchema } from './src/schemas/products.schemas';

async function seed() {
  try {
    await connect('mongodb://localhost:27017/zarmina-store');

    const Product = model('Product', ProductSchema, 'products');

    const products = [
      {
        name: "Embroidery Charm",
        brand: "Zarmeena",
        price: 9800,
        description: "A gracefully embroidered lawn suit with intricate threadwork and subtle lace detailing — perfect for festive days.",
        images: [
          "/assets/dress1-1.jpg",
          "/assets/dress1-2.jpg",
          "/assets/dress1-3.jpg"
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
          "/assets/dress2-1.jpg",
          "/assets/dress2-2.jpg",
          "/assets/dress2-3.jpg"
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
          "/assets/dress3-1.jpg",
          "/assets/dress3-2.jpg",
          "/assets/dress3-3.jpg"
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
          "/assets/dress4-1.jpg",
          "/assets/dress4-2.jpg",
          "/assets/dress4-3.jpg"
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
          "/assets/dress5-1.jpg",
          "/assets/dress5-2.jpg",
          "/assets/dress5-3.jpg"
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
          "/assets/dress6-1.jpg",
          "/assets/dress6-2.jpg",
          "/assets/dress6-3.jpg"
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
          "/assets/dress7-1.jpg",
          "/assets/dress7-2.jpg",
          "/assets/dress7-3.jpg"
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
          "/assets/dress8-1.jpg",
          "/assets/dress8-2.jpg",
          "/assets/dress8-3.jpg"
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
          "/assets/dress9-1.jpg",
          "/assets/dress9-2.jpg",
          "/assets/dress9-3.jpg"
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
