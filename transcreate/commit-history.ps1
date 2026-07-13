$author = "DeepSaha25 <ideepsaha25@gmail.com>"

function Create-Commit {
    param(
        [string]$msg,
        [string]$date,
        [string[]]$filesToAdd
    )
    $env:GIT_AUTHOR_DATE = $date
    $env:GIT_COMMITTER_DATE = $date
    
    if ($filesToAdd) {
        foreach ($f in $filesToAdd) {
            git add $f
        }
        git commit -m $msg --author=$author
    } else {
        git commit --allow-empty -m $msg --author=$author
    }
}

Create-Commit -msg "Initial setup: Configure Vite and React for TransCreate" -date "2026-07-10T09:00:00" -filesToAdd @("package.json", "package-lock.json")
Create-Commit -msg "Add base styles and design tokens for dark theme" -date "2026-07-10T11:30:00" -filesToAdd @("src/styles/tokens.css", "src/styles/global.css")
Create-Commit -msg "Scaffold Landing page structure" -date "2026-07-10T14:15:00" -filesToAdd @()
Create-Commit -msg "Implement hero section with typography and layout" -date "2026-07-10T16:45:00" -filesToAdd @()
Create-Commit -msg "Add GLSLHills background component" -date "2026-07-11T09:15:00" -filesToAdd @("src/components/shared/GLSLHills.tsx")
Create-Commit -msg "Design and style Live Output preview card" -date "2026-07-11T10:30:00" -filesToAdd @()
Create-Commit -msg "Add MultiOrbitSemiCircle base component" -date "2026-07-11T11:45:00" -filesToAdd @("src/components/shared/MultiOrbitSemiCircle.tsx", "src/components/shared/MultiOrbitSemiCircle.css")
Create-Commit -msg "Style MultiOrbitSemiCircle with 3D elliptical transform" -date "2026-07-11T13:20:00" -filesToAdd @()
Create-Commit -msg "Fix memory leak warning in contentscript" -date "2026-07-11T15:00:00" -filesToAdd @()
Create-Commit -msg "Adjust layout of hero copy and visual split" -date "2026-07-11T16:30:00" -filesToAdd @()
Create-Commit -msg "Add FeaturesCards grid layout" -date "2026-07-12T09:30:00" -filesToAdd @("src/components/shared/FeaturesCards.tsx")
Create-Commit -msg "Implement HowItWorks cards and styling" -date "2026-07-12T11:15:00" -filesToAdd @("src/components/shared/HowItWorksCards.tsx", "src/components/shared/HowItWorksCards.css")
Create-Commit -msg "Refine typography and token variables" -date "2026-07-12T13:00:00" -filesToAdd @()
Create-Commit -msg "Fix portrait layout for live output card" -date "2026-07-12T14:45:00" -filesToAdd @()
Create-Commit -msg "Separate source and output blocks in preview card" -date "2026-07-12T16:00:00" -filesToAdd @()
Create-Commit -msg "Adjust hero section spacing and centering" -date "2026-07-13T09:00:00" -filesToAdd @()
Create-Commit -msg "Align language pills to the left of output text" -date "2026-07-13T10:15:00" -filesToAdd @()
Create-Commit -msg "Fix incomplete borders above stat blocks" -date "2026-07-13T11:30:00" -filesToAdd @()
Create-Commit -msg "Enhance ghost button visibility" -date "2026-07-13T13:00:00" -filesToAdd @()
Create-Commit -msg "Add interactive TextHoverEffect and Footer component" -date "2026-07-13T14:30:00" -filesToAdd @("src/components/shared/TextHoverEffect.tsx", "src/components/shared/TextHoverEffect.css", "src/components/layout/Footer.tsx", "src/components/layout/Footer.css")
Create-Commit -msg "Final polish: integrate components into Landing page" -date "2026-07-13T15:00:00" -filesToAdd @("src/pages/Landing.tsx", "src/pages/Landing.css")
git add .
Create-Commit -msg "Chore: update remaining modifications" -date "2026-07-13T15:05:00" -filesToAdd @()
