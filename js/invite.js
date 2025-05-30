document.addEventListener("DOMContentLoaded", function () {


        const urlParams = new URLSearchParams(window.location.search);
        const baseUrl = `${location.protocol}//${location.host}/`;
        const referralUuid = urlParams.get('referralUuid');
        const desktopFallback = baseUrl + "register.php?referralUuid=" + referralUuid;

        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const isAndroid = /android/i.test(userAgent);
        const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;


        localStorage.setItem('referralUuid', referralUuid);

        const deepLink = "peer://invite/" + referralUuid;
        const androidFallback = "https://play.google.com/store/apps/details?id=eu.peernetwork.app";
        const iosFallback = "https://apps.apple.com/app/peer-network/id6744612499";

        let fallbackTimeout;

        function copyToClipboard(text, redirect_link) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    console.log("Referral code copied to clipboard");
                }).catch(err => {
                    console.warn("Clipboard write failed:", err);
                });
            } else {
                // Fallback for older browsers
                const textarea = document.createElement("textarea");
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand("copy");
                    console.log("Fallback clipboard copy success");
                } catch (err) {
                    console.warn("Fallback clipboard copy failed", err);
                }
                document.body.removeChild(textarea);
            }

            window.location = redirect_link;
        }

        function openApp() {
            

            // If user leaves the browser (likely app opened), cancel fallback
            document.addEventListener('visibilitychange', function () {
                if (document.visibilityState === 'hidden') {
                    clearTimeout(fallbackTimeout);
                }
            });

            // Try to open the app
            window.location = deepLink;

            // Set fallback if app not opened
            fallbackTimeout = setTimeout(() => {
                
                if (isAndroid) {
                    //copyToClipboard(referralUuid,androidFallback); // ✅ Copy before redirect
                    // window.location = androidFallback;
                } else if (isIOS) {
                    //copyToClipboard(referralUuid,iosFallback); // ✅ Copy before redirect
                    //window.location = iosFallback;
                } else {
                    window.location = desktopFallback;
                }
            }, 1500);
        }

        openApp();

        document.getElementById("openAppBtn").addEventListener("click", function (e) {
              e.preventDefault();

              

              if (isAndroid) {
                  copyToClipboard(deepLink, androidFallback);
              } else if (isIOS) {
                  copyToClipboard(deepLink, iosFallback);
              } else {
                  copyToClipboard(referralUuid, desktopFallback);
              }
        });
       
});