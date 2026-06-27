param(
    [string]$Password = "changeit",
    [string]$Output = "dev-keystore.p12"
)

$ErrorActionPreference = "Stop"
$backendRoot = Split-Path -Parent $PSScriptRoot
$outputPath = Join-Path $backendRoot $Output

$keytoolCommand = Get-Command keytool -ErrorAction SilentlyContinue
$keytool = if ($keytoolCommand) { $keytoolCommand.Source } else { $null }

if (-not $keytool -and $env:JAVA_HOME) {
    $candidate = Join-Path $env:JAVA_HOME "bin\keytool.exe"
    if (Test-Path -LiteralPath $candidate) {
        $keytool = $candidate
    }
}

if (-not $keytool) {
    $keytool = Get-ChildItem -Path "$env:ProgramFiles\Java" -Recurse -Filter keytool.exe -ErrorAction SilentlyContinue |
        Sort-Object FullName -Descending |
        Select-Object -First 1 -ExpandProperty FullName
}

if (-not $keytool) {
    throw "keytool.exe was not found. Install JDK or add keytool to PATH."
}

& $keytool -genkeypair `
    -alias progile-dev `
    -keyalg RSA `
    -keysize 2048 `
    -storetype PKCS12 `
    -keystore $outputPath `
    -validity 365 `
    -storepass $Password `
    -keypass $Password `
    -dname "CN=localhost, OU=Coursework, O=Progile, L=Local, S=Local, C=RU"

Write-Output "Generated $outputPath"
