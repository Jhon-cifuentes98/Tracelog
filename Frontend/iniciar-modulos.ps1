$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$npm = (Get-Command npm.cmd -ErrorAction SilentlyContinue).Source
if (!$npm) {
  $npm = Join-Path $env:ProgramFiles 'nodejs\npm.cmd'
}
if (!(Test-Path -LiteralPath $npm -PathType Leaf)) {
  throw 'No se encontró npm.cmd. Instala Node.js o agrega npm al PATH.'
}
$nodeDirectory = Split-Path -Parent $npm

$modules = @(
  @{ Workspace = 'modulos/hu-01/frontend'; Port = 5173 }
  @{ Workspace = 'modulos/hu-02/frontend'; Port = 5174 }
  @{ Workspace = 'modulos/hu-03/frontend'; Port = 5175 }
  @{ Workspace = 'modulos/hu-04/frontend'; Port = 5176 }
  @{ Workspace = 'modulos/hu-05/frontend'; Port = 5177 }
  @{ Workspace = 'modulos/hu-13/frontend'; Port = 5178 }
  @{ Workspace = 'modulos/hu-07/frontend'; Port = 5179 }
  @{ Workspace = 'modulos/hu-14/frontend'; Port = 5181 }
)

foreach ($module in $modules) {
  $listener = Get-NetTCPConnection -State Listen -LocalPort $module.Port -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($listener) {
    Write-Warning "El puerto $($module.Port) ya está ocupado por PID $($listener.OwningProcess); se conserva la instancia activa."
    continue
  }

  $command = "`$env:Path = '$nodeDirectory;' + `$env:Path; Set-Location -LiteralPath '$root'; & '$npm' run dev --workspace=$($module.Workspace) -- --host 127.0.0.1 --port $($module.Port) --strictPort; if (`$LASTEXITCODE -ne 0) { exit `$LASTEXITCODE }"
  Start-Process -FilePath 'powershell.exe' -ArgumentList @('-NoExit', '-ExecutionPolicy', 'Bypass', '-Command', $command)
}