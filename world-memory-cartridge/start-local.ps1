$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$folderConfigPath = Join-Path $root "world-folder.json"
$folderConfig = Get-Content $folderConfigPath -Raw | ConvertFrom-Json

function Get-FreePort {
    param(
        [int]$PreferredPort,
        [int]$SearchLimit
    )

    for ($offset = 0; $offset -le $SearchLimit; $offset++) {
        $candidate = $PreferredPort + $offset
        $listener = $null

        try {
            $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $candidate)
            $listener.Start()
            return $candidate
        } catch {
            continue
        } finally {
            if ($listener) {
                $listener.Stop()
            }
        }
    }

    throw "Unable to find a free port near $PreferredPort."
}

function Resolve-PythonCommand {
    if (Get-Command py -ErrorAction SilentlyContinue) {
        return @{
            FilePath = "py"
            Arguments = @("-3", "-m", "http.server")
        }
    }

    if (Get-Command python -ErrorAction SilentlyContinue) {
        return @{
            FilePath = "python"
            Arguments = @("-m", "http.server")
        }
    }

    throw "Neither 'py' nor 'python' is available."
}

$hostName = if ($env:WORLD_MEMORY_HOST) { $env:WORLD_MEMORY_HOST } else { $folderConfig.boot.host }
$preferredPort = if ($env:WORLD_MEMORY_PORT) { [int]$env:WORLD_MEMORY_PORT } else { [int]$folderConfig.boot.preferredPort }
$searchLimit = [int]$folderConfig.boot.portSearchLimit
$port = Get-FreePort -PreferredPort $preferredPort -SearchLimit $searchLimit
$pythonLaunch = Resolve-PythonCommand

$stateRoot = Join-Path $root "state\local-world"
$runtimeRoot = Join-Path $stateRoot "runtime"
$runtimePath = Join-Path $runtimeRoot "runtime.json"

New-Item -ItemType Directory -Force -Path $runtimeRoot | Out-Null

$serverArguments = @()
$serverArguments += $pythonLaunch.Arguments
$serverArguments += @($port, "--bind", $hostName, "--directory", $root)

$process = Start-Process `
    -FilePath $pythonLaunch.FilePath `
    -ArgumentList $serverArguments `
    -WorkingDirectory $root `
    -WindowStyle Hidden `
    -PassThru

$runtime = [ordered]@{
    kind = "world-folder-runtime"
    name = $folderConfig.name
    launchedAt = (Get-Date).ToString("o")
    host = $hostName
    port = $port
    url = "http://${hostName}:$port/"
    entry = "http://${hostName}:$port/index.html"
    pid = $process.Id
    root = $root
    primaryArtifact = $folderConfig.primaryArtifact
    markerFile = $folderConfigPath
}

$runtime | ConvertTo-Json -Depth 8 | Set-Content -Path $runtimePath -Encoding UTF8

Write-Host "World folder started." -ForegroundColor Cyan
Write-Host "URL: $($runtime.url)" -ForegroundColor Green
Write-Host "Entry: $($runtime.entry)" -ForegroundColor Green
Write-Host "PID: $($runtime.pid)" -ForegroundColor Yellow
Write-Host "Runtime: $runtimePath" -ForegroundColor DarkCyan
