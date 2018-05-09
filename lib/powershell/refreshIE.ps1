$signature = @'
[DllImport("wininet.dll", SetLastError = true, CharSet=CharSet.Auto)]
public static extern bool InternetSetOption(IntPtr hInternet, int dwOption, IntPtr lpBuffer, int dwBufferLength);
'@

$INTERNET_OPTION_REFRESH            = 37
$type = Add-Type -MemberDefinition $signature -Name wininet -Namespace pinvoke -PassThru
$type::InternetSetOption(0, $INTERNET_OPTION_REFRESH, 0, 0)
