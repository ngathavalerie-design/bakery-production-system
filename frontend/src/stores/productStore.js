import { defineStore } from 'pinia'

export const useProductStore = defineStore('productStore', {
state: () => ({
    // Central source of truth - expanded with more default items
    products: [
      // --- Your Original Baseline Items ---
      { id: 1, name: 'Sweet Croissants', category: 'Pastry', selling_price: 150, shelf_life_hours: 24, unit: 'pcs', active: true },
      { id: 2, name: 'Blueberry Muffins', category: 'Cake', selling_price: 120, shelf_life_hours: 48, unit: 'pcs', active: true },
      
      // --- New Additions: Breads & Loaves ---
      { id: 3, name: 'Premium White Bread (400g)', category: 'Bread', selling_price: 65, shelf_life_hours: 72, unit: 'pkt', active: true },
      { id: 4, name: 'Whole Wheat Brown Bread', category: 'Bread', selling_price: 70, shelf_life_hours: 72, unit: 'pkt', active: true },
      { id: 5, name: 'Sweet Milk Bread Loaf', category: 'Bread', selling_price: 85, shelf_life_hours: 60, unit: 'pkt', active: true },
      
      // --- New Additions: Pastries & Local Favorites ---
      { id: 6, name: 'Spiced Cinnamon Rolls', category: 'Pastry', selling_price: 110, shelf_life_hours: 36, unit: 'pcs', active: true },
      { id: 7, name: 'Beef Pie', category: 'Pastry', selling_price: 130, shelf_life_hours: 24, unit: 'pcs', active: true },
      { id: 8, name: 'Glazed Ring Donuts', category: 'Pastry', selling_price: 80, shelf_life_hours: 48, unit: 'pcs', active: true },
      
      // --- New Additions: Cakes & Celebration Slices ---
      { id: 9, name: 'Rich Chocolate Cake Slice', category: 'Cake', selling_price: 180, shelf_life_hours: 48, unit: 'pcs', active: true },
      { id: 10, name: 'Red Velvet Cupcake', category: 'Cake', selling_price: 100, shelf_life_hours: 48, unit: 'pcs', active: true },
      { id: 11, name: 'Vanilla Sponge Cake (1kg)', category: 'Cake', selling_price: 1200, shelf_life_hours: 72, unit: 'pcs', active: true }
    ]
  }),
  actions: {
    // Task 2: Pure addition to add an item to your current array
    addProduct(newProduct) {
      this.products.unshift({
        id: Date.now(),
        active: true, // Starts active by default
        ...newProduct
      })
    },
    // Task 3: Pure addition to remove an item by its ID
    deleteProduct(id) {
      this.products = this.products.filter(product => product.id !== id)
    },
    // Task 4: Pure addition to flip the active status
    toggleActive(id) {
      const product = this.products.find(product => product.id === id)
      if (product) {
        product.active = !product.active
      }
    }
  }
})