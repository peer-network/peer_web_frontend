<?php
$base = '/peer_web_frontend/js/chat';
$chatPath = realpath(__DIR__ . '/../js/chat');
?>

<script src="js/lib.min.js?<?php echo filemtime('js/lib.min.js'); ?>" defer></script>

<script src="<?= $base ?>/state.js?<?= filemtime($chatPath . '/state.js') ?>" defer></script>
<script src="<?= $base ?>/utils.js?<?= filemtime($chatPath . '/utils.js') ?>" defer></script>
<script src="<?= $base ?>/graphql.js?<?= filemtime($chatPath . '/graphql.js') ?>" defer></script>
<script src="<?= $base ?>/api.js?<?= filemtime($chatPath . '/api.js') ?>" defer></script>
<script src="<?= $base ?>/ui.js?<?= filemtime($chatPath . '/ui.js') ?>" defer></script>
<script src="<?= $base ?>/loader.js?<?= filemtime($chatPath . '/loader.js') ?>" defer></script>
<script src="<?= $base ?>/index.js?<?= filemtime($chatPath . '/index.js') ?>" defer></script>