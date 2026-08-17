$ErrorActionPreference = 'Stop'

Set-Location $PSScriptRoot
$env:CSC_IDENTITY_AUTO_DISCOVERY = 'false'

if (Test-Path dist) {
  Remove-Item -Recurse -Force dist
}

npx electron-builder --win portable

Write-Host ""
Write-Host "Done. Share this file with anyone:" -ForegroundColor Green
Write-Host "  $PSScriptRoot\dist\SatyamCRM-Portable.exe" -ForegroundColor Cyan
