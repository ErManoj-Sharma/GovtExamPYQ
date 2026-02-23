import { syllabus } from "./categories/index.js";

function getAllTopics(obj, prefix = '') {
  let topics = [];
  for (const [category, subCategories] of Object.entries(obj)) {
    if (typeof subCategories === 'object' && subCategories !== null) {
      for (const [subCategory, items] of Object.entries(subCategories)) {
        if (Array.isArray(items)) {
          for (const item of items) {
            topics.push(item);
          }
        } else if (typeof items === 'object' && items !== null) {
          for (const nestedItems of Object.values(items)) {
            if (Array.isArray(nestedItems)) {
              for (const item of nestedItems) {
                topics.push(item);
              }
            }
          }
        }
      }
    }
  }
  return [...new Set(topics)].sort();
}

export const categories = getAllTopics(syllabus);
