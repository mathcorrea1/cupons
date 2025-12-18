<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="className"
  >
    <!-- Ticket -->
    <path v-if="name === 'ticket'" d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    <path v-if="name === 'ticket'" d="M13 5v2" />
    <path v-if="name === 'ticket'" d="M13 17v2" />
    <path v-if="name === 'ticket'" d="M13 11v2" />
    
    <!-- Store -->
    <path v-if="name === 'store'" d="M3 9h18" />
    <path v-if="name === 'store'" d="M9 21V9" />
    <path v-if="name === 'store'" d="M15 21V9" />
    <path v-if="name === 'store'" d="M3 9L5 3h14l2 6" />
    <path v-if="name === 'store'" d="M3 9v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9" />
    
    <!-- Users -->
    <path v-if="name === 'users'" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle v-if="name === 'users'" cx="9" cy="7" r="4" />
    <path v-if="name === 'users'" d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path v-if="name === 'users'" d="M16 3.13a4 4 0 0 1 0 7.75" />
    
    <!-- Home -->
    <path v-if="name === 'home'" d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline v-if="name === 'home'" points="9 22 9 12 15 12 15 22" />
    
    <!-- LayoutDashboard -->
    <rect v-if="name === 'layout-dashboard'" x="3" y="3" width="7" height="9" />
    <rect v-if="name === 'layout-dashboard'" x="14" y="3" width="7" height="5" />
    <rect v-if="name === 'layout-dashboard'" x="14" y="12" width="7" height="9" />
    <rect v-if="name === 'layout-dashboard'" x="3" y="16" width="7" height="5" />
    
    <!-- LogOut -->
    <path v-if="name === 'log-out'" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline v-if="name === 'log-out'" points="16 17 21 12 16 7" />
    <line v-if="name === 'log-out'" x1="21" y1="12" x2="9" y2="12" />
    
    <!-- ShoppingBag -->
    <path v-if="name === 'shopping-bag'" d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path v-if="name === 'shopping-bag'" d="M3 6h18" />
    <path v-if="name === 'shopping-bag'" d="M16 10a4 4 0 0 1-8 0" />
    
    <!-- Plus -->
    <path v-if="name === 'plus'" d="M5 12h14" />
    <path v-if="name === 'plus'" d="M12 5v14" />
    
    <!-- Eye -->
    <path v-if="name === 'eye'" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle v-if="name === 'eye'" cx="12" cy="12" r="3" />
    
    <!-- Edit -->
    <path v-if="name === 'edit'" d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path v-if="name === 'edit'" d="m15 5 4 4" />
    
    <!-- Trash2 -->
    <path v-if="name === 'trash-2'" d="M3 6h18" />
    <path v-if="name === 'trash-2'" d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path v-if="name === 'trash-2'" d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line v-if="name === 'trash-2'" x1="10" y1="11" x2="10" y2="17" />
    <line v-if="name === 'trash-2'" x1="14" y1="11" x2="14" y2="17" />
    
    <!-- X -->
    <path v-if="name === 'x'" d="M18 6 6 18" />
    <path v-if="name === 'x'" d="m6 6 12 12" />
    
    <!-- CheckCircle -->
    <path v-if="name === 'check-circle'" d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline v-if="name === 'check-circle'" points="22 4 12 14.01 9 11.01" />
    
    <!-- Calendar -->
    <rect v-if="name === 'calendar'" x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line v-if="name === 'calendar'" x1="16" y1="2" x2="16" y2="6" />
    <line v-if="name === 'calendar'" x1="8" y1="2" x2="8" y2="6" />
    <line v-if="name === 'calendar'" x1="3" y1="10" x2="21" y2="10" />
    
    <!-- MapPin -->
    <path v-if="name === 'map-pin'" d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle v-if="name === 'map-pin'" cx="12" cy="10" r="3" />
    
    <!-- Phone -->
    <path v-if="name === 'phone'" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    
    <!-- Loader -->
    <line v-if="name === 'loader'" x1="12" y1="2" x2="12" y2="6" />
    <line v-if="name === 'loader'" x1="12" y1="18" x2="12" y2="22" />
    <line v-if="name === 'loader'" x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
    <line v-if="name === 'loader'" x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
    <line v-if="name === 'loader'" x1="2" y1="12" x2="6" y2="12" />
    <line v-if="name === 'loader'" x1="18" y1="12" x2="22" y2="12" />
    <line v-if="name === 'loader'" x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
    <line v-if="name === 'loader'" x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  name: string
  size?: number | string
  className?: string
}>(), {
  size: 24
})
</script>
