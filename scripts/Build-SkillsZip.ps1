#Requires -Version 5.1
<#
.SYNOPSIS
    Builds a flat zip of all skill folders for installing into Kiro / agents that
    only read folders at the root of their skills directory.

.DESCRIPTION
    Walks SKILLS/ recursively, finds every folder whose name starts with "001-"
    and contains a SKILL.md, then copies each one to a flat staging directory
    (no category subfolders) and zips the result.

    The output zip looks like:

        skills.zip
          001-foo/
            SKILL.md
            (other files)
          001-bar/
            SKILL.md
            ...

    Drop the contents of the zip into the agent's skills folder and every skill
    is at the root level where the agent expects them.

.PARAMETER Source
    Path to the SKILLS root. Defaults to ../SKILLS relative to this script.

.PARAMETER OutFile
    Path of the output zip. Defaults to ../dist/skills.zip relative to this script.

.PARAMETER OnDuplicate
    What to do when two skill folders share the same name across categories:
      Skip   - keep the first one found, warn about the rest (default)
      Suffix - keep both; rename later occurrences as <name>--<category>
      Fail   - stop with an error
.PARAMETER Force
    Overwrite the output zip if it exists.

.EXAMPLE
    pwsh ./Build-SkillsZip.ps1
.EXAMPLE
    pwsh ./Build-SkillsZip.ps1 -OnDuplicate Suffix -Force
#>
[CmdletBinding()]
param(
    [string]$Source,
    [string]$OutFile,
    [ValidateSet('Skip', 'Suffix', 'Fail')]
    [string]$OnDuplicate = 'Skip',
    [switch]$Force
)

$ErrorActionPreference = 'Stop'

# Resolve default paths relative to this script
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot  = Split-Path -Parent $scriptDir

if (-not $Source)  { $Source  = Join-Path $repoRoot 'SKILLS' }
if (-not $OutFile) { $OutFile = Join-Path $repoRoot 'dist\skills.zip' }

if (-not (Test-Path -LiteralPath $Source -PathType Container)) {
    throw "Source folder not found: $Source"
}

# Ensure output directory exists
$outDir = Split-Path -Parent $OutFile
if ($outDir -and -not (Test-Path -LiteralPath $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

if (Test-Path -LiteralPath $OutFile) {
    if ($Force) {
        Remove-Item -LiteralPath $OutFile -Force
    } else {
        throw "Output already exists: $OutFile (use -Force to overwrite)"
    }
}

# Find every skill folder
Write-Host "Scanning $Source ..."
$sourceRoot = (Resolve-Path $Source).Path
$skills = Get-ChildItem -LiteralPath $sourceRoot -Recurse -Directory |
    Where-Object {
        $_.Name -like '001-*' -and (Test-Path -LiteralPath (Join-Path $_.FullName 'SKILL.md'))
    }

if (-not $skills) {
    throw "No skill folders found under $Source"
}

Write-Host ("Found {0} skill folder(s)." -f $skills.Count)

# Detect collisions
$groups   = $skills | Group-Object Name
$collided = $groups | Where-Object { $_.Count -gt 1 }
if ($collided) {
    Write-Host ""
    Write-Host "Duplicate skill folder names detected:" -ForegroundColor Yellow
    foreach ($g in $collided) {
        Write-Host ("  {0} ({1} occurrences)" -f $g.Name, $g.Count) -ForegroundColor Yellow
        foreach ($d in $g.Group) {
            $rel = $d.FullName.Substring($sourceRoot.Length).TrimStart('\','/')
            Write-Host ("    - {0}" -f $rel)
        }
    }
    Write-Host ""
    if ($OnDuplicate -eq 'Fail') {
        throw "Duplicates present and -OnDuplicate is Fail. Aborting."
    }
}

# Stage to a temp folder so we can zip everything in one shot
$staging = Join-Path ([System.IO.Path]::GetTempPath()) ("skills-zip-" + [Guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $staging -Force | Out-Null

try {
    $seen      = @{}     # name -> already copied?
    $copied    = 0
    $skipped   = 0
    $renamed   = 0

    # Sort with SQERSTERS first so the user's own skills win on duplicate-name collisions,
    # then alphabetical by full path for deterministic ordering.
    $sorted = $skills | Sort-Object @{
        Expression = { if ($_.FullName -match '[\\/]SQERSTERS[\\/]') { 0 } else { 1 } }
    }, FullName

    foreach ($skill in $sorted) {
        $name = $skill.Name
        $relFromSource = $skill.FullName.Substring($sourceRoot.Length).TrimStart('\','/')

        if ($seen.ContainsKey($name)) {
            if ($OnDuplicate -eq 'Skip') {
                Write-Host ("  skip:    {0} (already added from {1})" -f $relFromSource, $seen[$name]) -ForegroundColor DarkYellow
                $skipped++
                continue
            }
            elseif ($OnDuplicate -eq 'Suffix') {
                # Build a category-derived suffix from the relative path
                # e.g. "GAMES\HOI4\001-hoi4-skills" -> suffix "games-hoi4"
                $parts = $relFromSource -split '[\\/]'
                $catParts = $parts[0..([Math]::Max(0, $parts.Length - 2))]
                $suffix = ($catParts -join '-').ToLowerInvariant()
                if (-not $suffix) { $suffix = 'dup' }
                $name = "$($skill.Name)--$suffix"
                Write-Host ("  rename:  {0} -> {1}" -f $relFromSource, $name) -ForegroundColor Cyan
                $renamed++
            }
        }

        $dest = Join-Path $staging $name
        Copy-Item -LiteralPath $skill.FullName -Destination $dest -Recurse
        $seen[$name] = $relFromSource
        Write-Host ("  add:     {0}" -f $name)
        $copied++
    }

    Write-Host ""
    Write-Host "Compressing..."
    Compress-Archive -Path (Join-Path $staging '*') -DestinationPath $OutFile -CompressionLevel Optimal -Force

    $zipInfo = Get-Item -LiteralPath $OutFile
    $sizeMb  = [Math]::Round($zipInfo.Length / 1MB, 2)

    Write-Host ""
    Write-Host "Done." -ForegroundColor Green
    Write-Host ("  Output:   {0}" -f $OutFile)
    Write-Host ("  Size:     {0} MB" -f $sizeMb)
    Write-Host ("  Added:    {0}" -f $copied)
    if ($skipped) { Write-Host ("  Skipped:  {0} (duplicate names)" -f $skipped) -ForegroundColor DarkYellow }
    if ($renamed) { Write-Host ("  Renamed:  {0} (duplicate names with category suffix)" -f $renamed) -ForegroundColor Cyan }
}
finally {
    if (Test-Path -LiteralPath $staging) {
        Remove-Item -LiteralPath $staging -Recurse -Force -ErrorAction SilentlyContinue
    }
}
