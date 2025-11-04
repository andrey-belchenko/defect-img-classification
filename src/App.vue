<template>
  <div :class="$style.container">
    <div>
      <input type="file" accept="image/*" @change="handleImageSelect" />
    </div>
    <div>
      <img v-if="imageUrl" :src="imageUrl" :class="$style.image" />
    </div>
    <div :class="$style.imageInfo">
      {{ imageInfo }}
    </div>
  </div>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getClassifierData, getClassifierText, type ClassifierItem } from './classifier';
import { analyzeDefect } from './ai-client';

const imageUrl = ref<string | null>(null);
const classifierData = ref<ClassifierItem[]>(undefined as ClassifierItem[]);
const classifierText = ref("");

const imageInfo = ref("");

onMounted(async () => {
  classifierData.value = await getClassifierData();
  classifierText.value = await getClassifierText();
});

const handleImageSelect = async (e: Event) => {
  imageInfo.value = "Загрузка...";
  const file = (e.target as HTMLInputElement).files?.[0];
  imageUrl.value = file ? URL.createObjectURL(file) : null;
  if (file) {
    const ids = await analyzeDefect(file, classifierText.value);
    const dataDict = new Map(classifierData.value.map(item => [item.id, item]));
    const records = ids.map(id => dataDict.get(id));
    imageInfo.value = JSON.stringify(records, null, 2);
  } else {
    imageInfo.value = "";
  }
};

</script>

<style module>
.container {
  margin: 20px;
}

.image {
  width: "auto";
  height: 500px;
  margin-top: 20px;
}

.imageInfo {
  margin-top: 20px;
  white-space: pre-wrap;
  font-family: monospace;
}
</style>
