const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (const { search, replace } of replacements) {
        content = content.replace(search, replace);
    }
    fs.writeFileSync(filePath, content, 'utf8');
}

// 1. Footer.tsx
replaceInFile('src/components/layout/Footer.tsx', [
    { search: /import React from "react";\n/, replace: '' }
]);

// 2. FeaturesCards.tsx
replaceInFile('src/components/shared/FeaturesCards.tsx', [
    { search: /pattern="dots"/, replace: 'pattern="stripes"' }
]);

// 3. HowItWorksCards.tsx
replaceInFile('src/components/shared/HowItWorksCards.tsx', [
    { search: /import React from "react";\n/, replace: '' }
]);

// 4. MultiOrbitSemiCircle.tsx
replaceInFile('src/components/shared/MultiOrbitSemiCircle.tsx', [
    { search: /import React, { useEffect, useState } from "react";\n/, replace: 'import { useEffect, useState } from "react";\n' },
    { search: /import React from "react";\n/, replace: '' }
]);

// 5. OpenStudioButton.tsx
replaceInFile('src/components/shared/OpenStudioButton.tsx', [
    { search: /import React from 'react';\n/, replace: '' }
]);

// 6. TextHoverEffect.tsx
replaceInFile('src/components/shared/TextHoverEffect.tsx', [
    { search: /import React, { useRef/, replace: 'import { useRef' }
]);

// 7. AnalyticsView.tsx
replaceInFile('src/components/studio/AnalyticsView.tsx', [
    { search: /import { TranscriptLine, EmotionTag }/, replace: 'import { TranscriptLine }' }
]);

// 8. LineCard.tsx
replaceInFile('src/components/studio/LineCard.tsx', [
    { search: /import { Play, Square } from 'lucide-react'/, replace: "import { Play } from 'lucide-react'" }
]);

// 9. Landing.tsx
replaceInFile('src/pages/Landing.tsx', [
    { search: /const TECH = \['IBM Granite 3\.3', 'LangChain\.js', 'Hugging Face', 'React', 'TypeScript'\]\n/, replace: '' }
]);

// 10. Studio.tsx
replaceInFile('src/pages/Studio.tsx', [
    { search: /import { ArrowLeft, Play, LayoutDashboard, Database, BarChart3, Settings } from 'lucide-react'/, replace: "import { ArrowLeft, LayoutDashboard, Database, BarChart3, Settings } from 'lucide-react'" }
]);

// 11. langchainService.ts
replaceInFile('src/services/langchainService.ts', [
    { search: /return mockResults\[index % mockResults\.length\];/, replace: "return mockResults[index % mockResults.length] as any;" }
]);

console.log("Fixes applied.");
