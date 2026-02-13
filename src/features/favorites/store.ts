import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

const STORAGE_KEY = 'schema-dashboard:favorites'

const parseFavorites = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return [] as string[]
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : []
  } catch {
    return []
  }
}

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<string[]>(parseFavorites())

  watch(
    favorites,
    (value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    },
    { deep: true }
  )

  const favoriteSet = computed(() => new Set(favorites.value))

  const isFavorite = (key: string) => favoriteSet.value.has(key)

  const toggleFavorite = (key: string) => {
    if (isFavorite(key)) {
      favorites.value = favorites.value.filter((item) => item !== key)
      return
    }
    favorites.value = [...favorites.value, key]
  }

  return {
    favorites,
    isFavorite,
    toggleFavorite
  }
})
