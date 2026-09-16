Add-Type -AssemblyName System.Drawing

$src = 'C:\Users\Dev\nayapay\public\logo.jpeg'
$resRoot = 'C:\Users\Dev\nayapay\android\app\src\main\res'
$sizes = @{
  'mipmap-mdpi' = 48
  'mipmap-hdpi' = 72
  'mipmap-xhdpi' = 96
  'mipmap-xxhdpi' = 144
  'mipmap-xxxhdpi' = 192
}

function Save-CleanIcon($image, $size, $path) {
  $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bmp)
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $graphics.DrawImage($image, 0, 0, $size, $size)
  $graphics.Dispose()

  for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
      $pixel = $bmp.GetPixel($x, $y)
      if ($pixel.R -lt 18 -and $pixel.G -lt 18 -and $pixel.B -lt 18) {
        $bmp.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
      }
    }
  }

  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}

$img = [System.Drawing.Image]::FromFile($src)
foreach ($entry in $sizes.GetEnumerator()) {
  $dir = Join-Path $resRoot $entry.Key
  New-Item -ItemType Directory -Force -Path $dir | Out-Null

  foreach ($name in @('ic_launcher.png', 'ic_launcher_round.png', 'ic_launcher_foreground.png')) {
    $path = Join-Path $dir $name
    Save-CleanIcon $img $entry.Value $path
    Write-Output $path
  }
}
$img.Dispose()
