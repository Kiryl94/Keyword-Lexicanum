# Bootstrap — Keyword Lexicanum
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Set-Location $PSScriptRoot\..

Write-Host 'Copying foundation docs...'
& "$PSScriptRoot\copy-foundation.ps1"

Write-Host 'Installing dependencies...'
npm install

Write-Host 'Typechecking...'
npm run typecheck

Write-Host ''
Write-Host 'Bootstrap complete. Start the dev server with:'
Write-Host '  npx expo start'
Write-Host ''
Write-Host 'Try sample lookups after launch:'
Write-Host '  WH40k: close quarters, engagement'
Write-Host '  D&D: advantage'
