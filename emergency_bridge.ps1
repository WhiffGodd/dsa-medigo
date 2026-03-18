$port = 5000
$logFile = "emergency_log.json"

# Initialize log file if it doesn't exist
if (-not (Test-Path $logFile)) {
    "[]" | Out-File $logFile -Encoding utf8
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/emergency/")
$listener.Start()

Write-Host "Emergency Bridge started at http://localhost:$port/emergency/"
Write-Host "Press Ctrl+C to stop."

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.AddHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
            $response.AddHeader("Access-Control-Allow-Headers", "Content-Type")
            $response.StatusCode = 200
            $response.Close()
            continue
        }

        if ($request.HttpMethod -eq "POST") {
            $reader = New-Object System.IO.StreamReader($request.InputStream)
            $body = $reader.ReadToEnd()
            $reader.Close()

            $data = $body | ConvertFrom-Json
            $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            
            $logEntry = @{
                timestamp = $timestamp
                ip = $data.ip
                gps = $data.gps
                type = $data.type
            }

            # Update Log
            $currentLog = Get-Content $logFile | ConvertFrom-Json
            $currentLog += $logEntry
            $currentLog | ConvertTo-Json | Out-File $logFile -Encoding utf8

            Write-Host "Emergency Received: IP $($data.ip), GPS $($data.gps)"

            # Git Push
            try {
                git add $logFile
                git commit -m "Emergency Tracking Alert - $timestamp"
                git push
                Write-Host "Successfully pushed to Git."
            } catch {
                Write-Host "Git Push Failed: $_"
            }

            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $buffer = [System.Text.Encoding]::UTF8.GetBytes('{"status":"success"}')
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.Close()
        }
    }
} finally {
    $listener.Stop()
}
