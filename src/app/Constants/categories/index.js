import { hindi } from "./hindi.js";
import { rajasthanHistory } from "./rajasthanHistory.js";
import { indiaGeography } from "./indianGeography.js";
import { rajasthanGeography } from "./rajasthanGeography.js";
import { currentAffairs } from "./currentAffairs.js";
import { reasoningAbility } from "./reasoning.js";
import { mathematics } from "./maths.js";
import { rajasthanArtCulture } from "./rajasthanArtAndCulture.js";
import { worldGeography } from "./worldGeography.js";
import { modernHistory, medievalHistory } from "./modernHistory.js";
import { law } from "./law.js";
import { indianPolity } from "./indianPolity.js";
import { rajasthanPolity } from "./rajasthanPolity.js";
import { biology, botany, chemistry, physics, zoology } from "./science.js";
export const syllabus = {
    ...hindi,
    ...indiaGeography,
    ...rajasthanHistory,
    ...modernHistory,
    ...rajasthanGeography,
    ...currentAffairs,
    ...reasoningAbility,
    ...mathematics,
    ...rajasthanArtCulture,
    ...worldGeography,
    ...medievalHistory,
    ...law,
    ...biology,
    ...botany,
    ...chemistry,
    ...physics,
    ...zoology,
    ...indianPolity,
    ...rajasthanPolity

}

console.log(syllabus)