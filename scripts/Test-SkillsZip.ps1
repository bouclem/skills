#Requires -Version 5.1
<#
.SYNOPSIS
    Verifies that a skills zip produced by Build-SkillsZip.ps1 has the expected
    flat structure (every skill folder at the root, each with a SKILL.md).

.DESCRIPTION
    Runs four checks against the zip:
      1. Every top-level entry is a folder named 001-*.
      2. No nested 001-*/001-* paths (which would mean a Build-SkillsZip bug).
      3. Every top-level skill folder contains a SKILL.md.
      4. No empty skill folders.

    Exits with code 0 if all checks pass, 1 if any fail.

.PARAMETER Path
    Path to the zip to verify. Defaults to ../dist/skills.zip relative to
    this script.

.EXAMPLE
    pwsh ./Test-SkillsZip.ps1

.EXAMPLE
    pwsh ./Test-SkillsZip.ps1 -Path C:\my\skills.zip
#>
[CmdletBinding()]
param(
    [string]$Path
)

$ErrorActionPreference = 'Stop'

# Default to ../dist/skills.zip relative to this script
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot  = Split-Path -Parent $scriptDir
if (-not $Path) { $Path = Join-Path $repoRoot 'dist\skills.zip' }

if (-not (Test-Path -LiteralPath $Path)) {
    throw "Zip not found: $Path"
}

Add-Type -AssemblyName System.IO.Compression.FileSystem

$zipPath = (Resolve-Path -LiteralPath $Path).Path
$zip = [System.IO.Compression.ZipFile]::OpenRead($zipPath)

try {
    # Top-level segment of every entry, normalising both / and \ separators
    $entries = $zip.Entries
    $topLevels = $entries | ForEach-Object { ($_.FullName -split '[\\/]')[0] } | Sort-Object -Unique

    $nonSkillRoots = $topLevels | Where-Object { $_ -notlike '001-*' }
    $nestedSkills  = $entries  | Where-Object { $_.FullName -match '[\\/]001-.*[\\/]001-' }

    # Map: skill folder name -> does it contain a SKILL.md?
    $skillsWithMd = @{}
    foreach ($t in $topLevels) { $skillsWithMd[$t] = $false }
    foreach ($e in $entries) {
        $parts = $e.FullName -split '[\\/]'
        if ($parts.Count -ge 2 -and $parts[1] -ieq 'SKILL.md') {
            $skillsWithMd[$parts[0]] = $true
        }
    }
    $missingMd = $skillsWithMd.GetEnumerator() | Where-Object { -not $_.Value } | ForEach-Object { $_.Key }

    # Skill folders that have no entries beyond the folder marker itself
    $entriesPerSkill = @{}
    foreach ($t in $topLevels) { $entriesPerSkill[$t] = 0 }
    foreach ($e in $entries) {
        $parts = $e.FullName -split '[\\/]'
        if ($parts.Count -ge 2 -and $parts[1]) {
            $entriesPerSkill[$parts[0]]++
        }
    }
    $emptySkills = $entriesPerSkill.GetEnumerator() | Where-Object { $_.Value -eq 0 } | ForEach-Object { $_.Key }

    # Report
    $sizeMb = [Math]::Round((Get-Item -LiteralPath $zipPath).Length / 1MB, 2)
    Write-Host ("Zip:                      {0}" -f $zipPath)
    Write-Host ("Size:                     {0} MB" -f $sizeMb)
    Write-Host ("Total entries:            {0}" -f $entries.Count)
    Write-Host ("Unique top-level dirs:    {0}" -f $topLevels.Count)
    Write-Host ""

    $checks = @(
        @{ Name = 'All top-level dirs are 001-* skill folders'; Failed = @($nonSkillRoots) }
        @{ Name = 'No nested 001- folders';                     Failed = @($nestedSkills | ForEach-Object { $_.FullName }) }
        @{ Name = 'Every skill has a SKILL.md';                 Failed = @($missingMd) }
        @{ Name = 'No empty skill folders';                     Failed = @($emptySkills) }
    )

    $anyFail = $false
    foreach ($c in $checks) {
        if ($c.Failed.Count -eq 0) {
            Write-Host ("  PASS  {0}" -f $c.Name) -ForegroundColor Green
        } else {
            $anyFail = $true
            Write-Host ("  FAIL  {0} ({1} offender(s))" -f $c.Name, $c.Failed.Count) -ForegroundColor Red
            $c.Failed | Select-Object -First 10 | ForEach-Object { Write-Host ("        - {0}" -f $_) -ForegroundColor Red }
            if ($c.Failed.Count -gt 10) { Write-Host ("        ... and {0} more" -f ($c.Failed.Count - 10)) -ForegroundColor Red }
        }
    }

    Write-Host ""
    if ($anyFail) {
        Write-Host "Result: FAIL" -ForegroundColor Red
        exit 1
    } else {
        Write-Host "Result: OK" -ForegroundColor Green
        exit 0
    }
}
finally {
    $zip.Dispose()
}
