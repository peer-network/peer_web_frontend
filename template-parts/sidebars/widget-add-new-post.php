<div class="widget">
  <div class="widget-inner widget-type-box widget-new-menu-post">
    <?php $currentPage = basename($_SERVER['PHP_SELF']); // e.g. "dashboard.php" or "profile.php"?>
    <ul class="menu">
      <li class="menu-item <?= ($currentPage === 'newpost.php') ? 'active' : '' ?>">
        <a id="btAddPost" href="newpost.php">
          <i class="peer-icon peer-icon-newpost"></i>
          <i class="filled peer-icon peer-icon-newpost-filled"></i>
          New post
        </a>
      </li>
    </ul>
  </div>
</div>