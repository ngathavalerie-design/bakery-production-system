<template>
  <div 
    class="product-card"
    :style="!isActive ? 'opacity: 0.35;' : ''"
  >
    <button 
      @click="$emit('toggle-active')"
      :class="['status-toggle-btn', isActive ? 'btn-active' : 'btn-inactive']"
    >
      {{ isActive ? 'Active' : 'Inactive' }}
    </button>

    <div class="card-body">
      <div class="title-row">
        <span :class="['status-dot', getDotClass(shelfLifeHours)]"></span>
        <h2 class="product-name">{{ name }}</h2>
      </div>
      
      <div class="metadata-rows">
        <p class="meta-text">
          Price: 
          <span :style="price >= 150 ? 'color: #4caf50; font-weight: bold;' : 'color: #9e9e9e;'">
            KES {{ price }}
          </span>
        </p>
        <p class="meta-text">Category: <span class="val-text">{{ category }}</span></p>
        <p class="meta-text">Shelf Life: <span class="val-text">{{ shelfLifeHours }} hours</span></p>
      </div>
    </div>

    <div class="card-footer">
      <div class="shelf-status-row">
        <span class="label">Shelf Status:</span>
        <span :class="['status-badge-text', getStatusTextClass(shelfLifeHours)]">
          {{ getStatusText(shelfLifeHours) }}
        </span>
      </div>

      <button 
        @click="$emit('select-product')"
        :disabled="!isActive"
        class="sell-action-btn"
      >
        Sell
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  shelfLifeHours: { type: Number, required: true },
  isActive: { type: Boolean, required: true }
})

defineEmits(['toggle-active', 'select-product'])

const getDotClass = (hours) => {
  if (hours <= 12) return 'dot-red'
  if (hours <= 48) return 'dot-green'
  return 'dot-blue'
}

const getStatusText = (hours) => {
  if (hours <= 12) return 'Urgent'
  if (hours <= 48) return 'Fast Seller'
  return 'Long shelf life'
}

const getStatusTextClass = (hours) => {
  if (hours <= 12) return 'txt-red'
  if (hours <= 48) return 'txt-green'
  return 'txt-blue'
}
</script>

<style scoped>
.product-card {
  background-color: #242424;
  border: 1px solid #555555;
  border-radius: 12px;
  padding: 24px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.status-toggle-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  cursor: pointer;
  background: transparent;
}
.btn-active { color: #4caf50; border: 1px solid #2e7d32; }
.btn-inactive { color: #f44336; border: 1px solid #c62828; }

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}
.dot-red { background-color: #f44336; }
.dot-green { background-color: #4caf50; }
.dot-blue { background-color: #2196f3; }

.product-name {
  font-size: 24px;
  color: #d4d4d4;
  font-weight: normal;
  margin: 0;
}

.metadata-rows {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 15px;
}

.meta-text {
  margin: 0;
  color: #9e9e9e;
}

.val-text {
  color: #d4d4d4;
}

.card-footer {
  margin-top: 24px;
  padding-top: 16px;
}

.shelf-status-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 12px;
}

.txt-red { color: #f44336; font-weight: bold; }
.txt-green { color: #4caf50; font-weight: bold; }
.txt-blue { color: #2196f3; font-weight: bold; }

.sell-action-btn {
  width: 100%;
  background-color: #333333;
  border: 1px solid #555555;
  color: #ffffff;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}
.sell-action-btn:hover {
  background-color: #444444;
}
.sell-action-btn:disabled {
  opacity: 0.2;
  cursor: not-allowed;
}
</style>