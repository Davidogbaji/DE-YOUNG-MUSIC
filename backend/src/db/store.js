import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { config } from '../config.js';
import { initialProducts, initialCategories, initialSettings } from './seedData.js';

const DATA_FILE = path.join(config.dataDir, 'store.json');

class DataStore {
  constructor() {
    this.data = {
      products: [],
      categories: [],
      orders: [],
      settings: {},
      admins: []
    };
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;

    try {
      if (!fs.existsSync(config.dataDir)) {
        fs.mkdirSync(config.dataDir, { recursive: true });
      }

      if (!fs.existsSync(config.uploadsDir)) {
        fs.mkdirSync(config.uploadsDir, { recursive: true });
      }

      if (fs.existsSync(DATA_FILE)) {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
        // Ensure all collections exist
        if (!this.data.products) this.data.products = [...initialProducts];
        if (!this.data.categories) this.data.categories = [...initialCategories];
        if (!this.data.orders) this.data.orders = [];
        if (!this.data.settings) this.data.settings = { ...initialSettings };
        if (!this.data.admins) this.data.admins = [];
      } else {
        // Fresh setup
        const hashedPassword = await bcrypt.hash(config.adminPassword, 10);
        this.data = {
          products: [...initialProducts],
          categories: [...initialCategories],
          orders: [],
          settings: { ...initialSettings },
          admins: [
            {
              id: 'admin-1',
              email: config.adminEmail.toLowerCase(),
              password: hashedPassword,
              name: 'Store Administrator',
              role: 'ADMIN',
              createdAt: new Date().toISOString()
            }
          ]
        };
        this.saveSync();
      }

      // Check if admin user exists, if not create default
      const adminExists = this.data.admins.find(a => a.email === config.adminEmail.toLowerCase());
      if (!adminExists) {
        const hashedPassword = await bcrypt.hash(config.adminPassword, 10);
        this.data.admins.push({
          id: 'admin-' + Date.now(),
          email: config.adminEmail.toLowerCase(),
          password: hashedPassword,
          name: 'Store Administrator',
          role: 'ADMIN',
          createdAt: new Date().toISOString()
        });
        this.saveSync();
      }

      this.isInitialized = true;
      console.log(`[DataStore] Database initialized with ${this.data.products.length} products.`);
    } catch (err) {
      console.error('[DataStore] Error initializing database:', err);
    }
  }

  saveSync() {
    try {
      const tempFile = `${DATA_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DATA_FILE);
    } catch (err) {
      console.error('[DataStore] Failed to write data file:', err);
    }
  }

  // Admin Methods
  getAdminByEmail(email) {
    if (!email) return null;
    return this.data.admins.find(a => a.email.toLowerCase() === email.toLowerCase());
  }

  async updateAdminPassword(email, newPassword) {
    const admin = this.getAdminByEmail(email);
    if (!admin) return false;
    admin.password = await bcrypt.hash(newPassword, 10);
    this.saveSync();
    return true;
  }

  // Product Methods
  getProducts(filters = {}) {
    let result = [...this.data.products];

    // Status filter
    if (filters.status) {
      result = result.filter(p => p.status === filters.status);
    } else if (filters.onlyActive !== false) {
      // Default to active for public queries unless explicitly requested all
      if (filters.admin !== true) {
        result = result.filter(p => p.status === 'active');
      }
    }

    // Category filter
    if (filters.category) {
      result = result.filter(p => 
        (p.category && p.category.toLowerCase() === filters.category.toLowerCase()) ||
        (p.categoryId && p.categoryId.toLowerCase() === filters.category.toLowerCase())
      );
    }

    // Brand filter
    if (filters.brand) {
      result = result.filter(p => p.brand && p.brand.toLowerCase() === filters.brand.toLowerCase());
    }

    // Search query
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    }

    // Price range
    if (filters.minPrice !== undefined && !isNaN(filters.minPrice)) {
      result = result.filter(p => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
      result = result.filter(p => p.price <= Number(filters.maxPrice));
    }

    // In-stock filter
    if (filters.inStock === 'true' || filters.inStock === true) {
      result = result.filter(p => p.stock > 0);
    }

    // Featured filter
    if (filters.featured === 'true' || filters.featured === true) {
      result = result.filter(p => p.featured === true);
    }

    // Sorting
    if (filters.sort === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sort === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Default newest
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return result;
  }

  getProductByIdOrSlug(idOrSlug) {
    if (!idOrSlug) return null;
    return this.data.products.find(p => p.id === idOrSlug || p.slug === idOrSlug) || null;
  }

  createProduct(productData) {
    const slug = (productData.name || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 6);

    const newProduct = {
      id: 'prod-' + Date.now(),
      name: productData.name,
      slug,
      category: productData.category || 'General',
      categoryId: productData.categoryId || '',
      brand: productData.brand || 'Generic',
      price: Number(productData.price) || 0,
      comparePrice: productData.comparePrice ? Number(productData.comparePrice) : null,
      stock: Number(productData.stock) || 0,
      featured: Boolean(productData.featured),
      status: productData.status || 'active',
      image: productData.image || 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80',
      description: productData.description || '',
      specs: typeof productData.specs === 'object' ? productData.specs : {},
      createdAt: new Date().toISOString()
    };

    this.data.products.unshift(newProduct);
    this.saveSync();
    return newProduct;
  }

  updateProduct(id, productData) {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const existing = this.data.products[index];
    const updated = {
      ...existing,
      name: productData.name !== undefined ? productData.name : existing.name,
      category: productData.category !== undefined ? productData.category : existing.category,
      categoryId: productData.categoryId !== undefined ? productData.categoryId : existing.categoryId,
      brand: productData.brand !== undefined ? productData.brand : existing.brand,
      price: productData.price !== undefined ? Number(productData.price) : existing.price,
      comparePrice: productData.comparePrice !== undefined ? (productData.comparePrice ? Number(productData.comparePrice) : null) : existing.comparePrice,
      stock: productData.stock !== undefined ? Number(productData.stock) : existing.stock,
      featured: productData.featured !== undefined ? Boolean(productData.featured) : existing.featured,
      status: productData.status !== undefined ? productData.status : existing.status,
      image: productData.image !== undefined ? productData.image : existing.image,
      description: productData.description !== undefined ? productData.description : existing.description,
      specs: productData.specs !== undefined ? (typeof productData.specs === 'object' ? productData.specs : {}) : existing.specs,
      updatedAt: new Date().toISOString()
    };

    this.data.products[index] = updated;
    this.saveSync();
    return updated;
  }

  updateStock(id, newStock) {
    const product = this.data.products.find(p => p.id === id);
    if (!product) return null;
    product.stock = Math.max(0, Number(newStock));
    product.updatedAt = new Date().toISOString();
    this.saveSync();
    return product;
  }

  deleteProduct(id) {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.data.products.splice(index, 1);
    this.saveSync();
    return true;
  }

  // Categories
  getCategories() {
    return this.data.categories;
  }

  getBrands() {
    const brandsSet = new Set();
    this.data.products.forEach(p => {
      if (p.brand) brandsSet.add(p.brand);
    });
    return Array.from(brandsSet).sort();
  }

  // Orders
  getOrders(filters = {}) {
    let result = [...this.data.orders];
    if (filters.status) {
      result = result.filter(o => o.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(o => 
        o.orderNumber.toLowerCase().includes(q) ||
        (o.customer && (o.customer.name.toLowerCase().includes(q) || o.customer.phone.includes(q)))
      );
    }
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return result;
  }

  createOrder(orderData) {
    const orderNumber = 'DY-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      id: 'order-' + Date.now(),
      orderNumber,
      customer: {
        name: orderData.customer?.name || 'Customer',
        phone: orderData.customer?.phone || '',
        email: orderData.customer?.email || '',
        address: orderData.customer?.address || '',
        city: orderData.customer?.city || '',
        state: orderData.customer?.state || 'Lagos',
        notes: orderData.customer?.notes || ''
      },
      items: (orderData.items || []).map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      paymentMethod: orderData.paymentMethod || 'WHATSAPP_CONFIRM',
      subtotal: Number(orderData.subtotal) || 0,
      deliveryFee: Number(orderData.deliveryFee) || 0,
      total: Number(orderData.total) || 0,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    // Decrement stock for ordered items
    newOrder.items.forEach(item => {
      const prod = this.data.products.find(p => p.id === item.id);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    });

    this.data.orders.unshift(newOrder);
    this.saveSync();
    return newOrder;
  }

  updateOrderStatus(id, status) {
    const order = this.data.orders.find(o => o.id === id || o.orderNumber === id);
    if (!order) return null;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    this.saveSync();
    return order;
  }

  // Settings
  getSettings() {
    return this.data.settings;
  }

  updateSettings(newSettings) {
    this.data.settings = {
      ...this.data.settings,
      ...newSettings
    };
    this.saveSync();
    return this.data.settings;
  }

  // Reset to initial demo data
  resetDemoData() {
    this.data.products = [...initialProducts];
    this.data.categories = [...initialCategories];
    this.data.settings = { ...initialSettings };
    this.saveSync();
    return true;
  }
}

export const store = new DataStore();
