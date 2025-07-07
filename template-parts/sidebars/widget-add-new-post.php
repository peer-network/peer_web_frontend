<div class="widget">
  <div class="widget-inner widget-type-box widget-new-menu-post">
    <?php $currentPage = basename($_SERVER['PHP_SELF']); // e.g. "dashboard.php" or "profile.php"?>
    <ul class="menu">
      <li class="menu-item <?= ($currentPage === 'newpost.php') ? 'active' : '' ?>">
        <a id="btAddPost" href="newpost.php">
          <img class="icon" src="svg/newpost.svg" alt="add post" />
          New post
        </a>
      </li>
    </ul>
  </div>
</div>