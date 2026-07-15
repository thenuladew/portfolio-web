Get-ChildItem -Path "src" -Recurse -Include "*.tsx","*.css" | ForEach-Object {
  $content = Get-Content $_.FullName -Raw
  # Background colors
  $content = $content -replace "#050508", "#0b101a"
  $content = $content -replace "bg-\[#050508\]", "bg-[#0b101a]"
  # Neutral card/surface colors -> BugThrive equivalents
  $content = $content -replace "bg-neutral-950\/80", "bg-[#11141d]/90"
  $content = $content -replace "bg-neutral-950\/60", "bg-[#11141d]/70"
  $content = $content -replace "bg-neutral-950", "bg-[#11141d]"
  $content = $content -replace "border-neutral-900", "border-[#1a1f2e]"
  $content = $content -replace "border-neutral-800", "border-[#212634]"
  $content = $content -replace "border-neutral-700", "border-[#2a3441]"
  $content = $content -replace "bg-neutral-900\/80", "bg-[#161b28]/90"
  $content = $content -replace "bg-neutral-900\/60", "bg-[#161b28]/70"
  $content = $content -replace "bg-neutral-900", "bg-[#161b28]"
  $content = $content -replace "bg-\[#0c0c0c\]", "bg-[#0b101a]"
  $content = $content -replace "bg-\[#07070a\]", "bg-[#0b101a]"
  # Text colors
  $content = $content -replace "text-neutral-400", "text-[#8fa3b8]"
  $content = $content -replace "text-neutral-500", "text-[#6b7d8f]"
  $content = $content -replace "text-neutral-600", "text-[#4a5568]"
  $content = $content -replace "text-neutral-700", "text-[#374151]"
  $content = $content -replace "text-neutral-200", "text-[#c8d8e8]"
  $content = $content -replace "text-neutral-300", "text-[#b0c4d8]"
  Set-Content $_.FullName $content -NoNewline
}
Write-Host "Done - deep color swap complete"
