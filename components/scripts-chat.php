<?php
$base = '/peer_web_frontend/js/chat';
$chatPath = realpath(__DIR__ . '/../js/chat');
?>

<script src="js/lib.min.js?<?php echo filemtime('js/lib.min.js'); ?>" defer></script>
<script src="/js/chat/state.js?<?php echo filemtime(__DIR__ . '/../js/chat/state.js'); ?>" defer></script>
<script src="/js/chat/utils.js?<?php echo filemtime(__DIR__ . '/../js/chat/utils.js'); ?>" defer></script>
<script src="/js/chat/graphql.js?<?php echo filemtime(__DIR__ . '/../js/chat/graphql.js'); ?>" defer></script>
<script src="/js/chat/api.js?<?php echo filemtime(__DIR__ . '/../js/chat/api.js'); ?>" defer></script>
<script src="/js/chat/ui.js?<?php echo filemtime(__DIR__ . '/../js/chat/ui.js'); ?>" defer></script>
<script src="/js/chat/loader.js?<?php echo filemtime(__DIR__ . '/../js/chat/loader.js'); ?>" defer></script>
<script src="/js/chat/index.js?<?php echo filemtime(__DIR__ . '/../js/chat/index.js'); ?>" defer></script>
<script src="/js/dashboard.js?<?php echo filemtime(__DIR__ . '/../js/dashboard.js'); ?>" defer></script>


